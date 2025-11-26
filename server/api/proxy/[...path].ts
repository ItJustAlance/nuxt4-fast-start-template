import { getRouterParam, getQuery, getRequestHeaders } from 'h3';
import appUtils from '@/utils/appUtils';
const DEBUG_PROXY_REQUESTS = true; // дублирует в логах запросы и их ответы

/**
 * Прокси для перекидывания запросов на бекенд ДПО 2 и ДПО 1, в ответ всегда ожидает json-данные.
 * Поддерживает:
 * - GET/DELETE-запросы с параметрами в ссылках
 * - POST/PUT/PATCH-запросы с json-данными в body
 * - POST/PUT/PATCH-запросы с form data в body, включая файлы
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path');
  console.log('pathpath', path);
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const method = event.method || 'GET';

  // если запрос к дпо 1, то вручную ставим путь
  const urlPath = `${config.public.realApiUrl}/${path}`;

  // готовим вручную параметры, чтобы сохранить [] не экранированными (нужно для множественного выбора, например, фильтров)
  let urlParams = appUtils.prepareUrlQueryPath(query);
  if (urlParams) {
    urlParams = '?' + urlParams;
  }
  const fullUrl = urlPath + urlParams;

  // проброс всех заголовков (кроме host)
  const headers: any = { ...getRequestHeaders(event) };
  delete headers.host;

  // проброс боди, включая файлы
  let body: any;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    if (headers['content-type']?.includes('multipart/form-data')) {
      // потоковая передача
      body = event.node.req;
    } else {
      // обычный текст
      body = await readRawBody(event);
    }
  } else {
    // для GET запросов с параметрами в ссылке надо удалить json-тип,
    // иначе ларавел будет пытаться прочитать body, которого нет (вернет пустую страницу)
    delete headers['content-type'];
  }

  if (DEBUG_PROXY_REQUESTS) {
    console.log();
    console.log('proxy fetch request:', method, fullUrl);
    console.log('proxy fetch body:');
    if (body) {
      if (typeof body === 'string') {
        console.log(body);
      } else {
        console.log('[binary stream]');
      }
    }
    console.log('proxy fetch cookies:');
    console.log(headers.cookie);
  }

  const response = await fetch(fullUrl, {
    method: event.method,
    headers,
    credentials: 'include',
    body,
    duplex: 'half', // требуется для потоковой отправки файлов
  });

  // Попытка распарсить JSON (если не получилось — пометим код и вернём ошибку)
  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.log('proxy get response', response);
    console.error('proxy fail:', error);
    data = {
      message: `внутренняя ошибка на прокси: ${error}`,
    };

    // Если не получилось распарсить JSON, ставим 502 (Bad Gateway) или status от response
    const code = response.status >= 400 ? response.status : 502;
    console.error('[proxy] failed to parse JSON from upstream', fullUrl, error);
    // Пробросим ошибку, чтобы Nuxt показал страницу ошибки при SSR
    throw createError({
      statusCode: code,
      message: `Proxy parse error: ${error?.message ?? 'Invalid JSON from upstream'}`,
      data: { message: 'Proxy failed to parse JSON' },
    });

    return data;
  }

  if (DEBUG_PROXY_REQUESTS) {
    // console.log('proxy result response:', response);
    console.log('proxy result status:', response.status);
    console.log('proxy result data:');
    console.log(JSON.stringify(data));
    console.log();
  }

  // Если бекенд вернул ошибочный HTTP-статус — пробрасываем этот статус клиенту
  // --- ВАЖНО: если бекенд вернул ошибочный статус — пробрасываем его серверу/клиенту
  if (!response.ok) {
    // Установим статус ответа прокси
    // event.node.res.statusCode = response.status;

    const msg = `[proxy] upstream error ${response.status} ${method} ${fullUrl}`;
    if (response.status === 404) console.warn(msg, data);
    else console.error(msg, data);

    throw createError({
      statusCode: response.status,
      message: data?.message ?? response.statusText ?? 'Upstream error',
      data,
    });
  }

  // 2) Upstream вернул 200, но семантически ресурс отсутствует (частый случай для GET /courses/:id)
  //    — распознаём это по структуре ответа и кидаем 404.
  //    Подставь здесь правила под свою АPI: пример для /courses/:id
  try {
    if (data?.success === false && /not found/i.test(String(data?.message ?? ''))) {
      throw createError({ statusCode: 404, message: String(data.message ?? 'Resource not found'), data: { message: data.message ?? null } });
    }

    // аналогично, можно добавить для других endpoint'ов:
    // if (/^users\/\d+$/.test(path) && (data?.data == null)) { throw createError({...}) }
  } catch (err) {
    // если мы уже бросили createError — пробрасываем дальше
    if (err?.statusCode) throw err;
    // иначе продолжаем
  }

  return data;
});
