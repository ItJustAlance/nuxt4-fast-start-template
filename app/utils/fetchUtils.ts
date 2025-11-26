import appUtils from '~/utils/appUtils';

let isInitialized = false;

function initializeApi() {
  // показать инфо только при первом использовании
  if (isInitialized) return;

  const config = useRuntimeConfig();
  console.log('путь к реальному апи', config.public.realApiUrl);
  console.log('путь к внутреннему апи', config.public.fakeApiUrl);
  console.log('путь к прокси апи', config.public.proxyApiUrl);

  isInitialized = true;
}

const makeProxyUrl = (url: string) => {
  // проксировать запросы к внешнему серверу через локальный
  // TODO: пока проксировать апи можно всегда, т.к. тестовый портал в режиме dev-сервера работает,
  //  на реальном продакшене надо смотреть настройки серверов

  const config = useRuntimeConfig();
  try {
    if (config.public.realApiUrl !== config.public.proxyApiUrl && url.startsWith(config.public.realApiUrl)) {
      url = url.replace(config.public.realApiUrl, config.public.proxyApiUrl);
    }

    // костыль, чтобы временно можно было работать на нескольких доменах сразу
    const domains = new Map([
      ['new.dpomos.ru', 'https://new.dpomos.ru'],
      ['dev.dpomos.ru', 'https://dev.dpomos.ru'],
      ['dev-roma.dpomos.ru', 'https://dev-roma.dpomos.ru'],
      ['dev-oleg.dpomos.ru', 'https://dev-oleg.dpomos.ru'],
      ['dev-vova.dpomos.ru', 'https://dev-vova.dpomos.ru'],
    ]);
    const currentHost = window?.location.hostname || '';
    if (url.startsWith('https://testportal.corp-univer.ru')) {
      for (const [host, replacement] of domains) {
        if (currentHost.includes(host)) {
          url = url.replace('https://testportal.corp-univer.ru', replacement);
          break;
        }
      }
    }

    return url;
  } catch {
    return url;
  }
};

function buildFormData(formData: FormData, data: any, parentKey?: string) {
  if (data === null || data === undefined) {
    // игнор пустых полей
  } else if (data instanceof Date) {
    // дата
    formData.append(parentKey!, data.toISOString());
  } else if (data instanceof File || data instanceof Blob) {
    // файл
    formData.append(parentKey!, data);
  } else if (typeof data === 'object' && !Array.isArray(data)) {
    // объект
    for (const key of Object.keys(data)) {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    }
  } else if (Array.isArray(data)) {
    // массив
    // пример: key[]=value1, key[]=value2 или вложенные
    data.forEach((item) => {
      buildFormData(formData, item, parentKey ? `${parentKey}[]` : '[]');
    });
  } else {
    // другое
    formData.append(parentKey!, String(data));
  }
}

export async function fetchPost(
  apiUrl: string,
  apiPath: string,
  data: Record<string, any>,
  isFormData: boolean = false,
  extraHeaders: Record<string, string> = {},
) {
  try {
    initializeApi();

    const isServer = appUtils.isRunOnServer();
    const fullUrl = makeProxyUrl(`${apiUrl}${apiPath}`);

    let contentType: string | null;
    let body: FormData | string;
    if (isFormData) {
      // в form-формате
      const formData = new FormData();
      buildFormData(formData, data);
      // DEBUG: распечатать, что ушло
      for (const [k, v] of formData.entries()) {
        console.log('FormData', k, '→', v);
      }
      body = formData;
      // НЕ указываем Content-Type, браузер сам его проставит
      contentType = null;
    } else {
      // в json-формате
      body = JSON.stringify(data);
      contentType = 'application/json';
    }

    // на сервере прокидываем cookie заголовки
    const headers: any = isServer ? useRequestHeaders(['cookie']) : { ...extraHeaders };
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return await $fetch(fullUrl, {
      method: 'POST',
      body,
      credentials: 'include', // важно для отправки cookies
      headers,
    });
  } catch (error) {
    console.error('Ошибка в fetchPost:', error);

    if (error.data && typeof error.data === 'object') {
      throw new Error(JSON.stringify(error.data) || 'Произошла ошибка');
    }

    throw new Error('Ошибка при выполнении запроса', error);
  }
}

export function useFetchPost(apiUrl: string, apiPath: string, data = {}, isFormData = false, headers = {}) {
  initializeApi();
  const fullUrl = makeProxyUrl(`${apiUrl}${apiPath}`);

  let body;
  if (isFormData) {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    body = formData;
  } else {
    body = data;
  }

  // Устанавливаем заголовок по умолчанию
  const defaultHeaders = {
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    ...headers,
  };

  console.log('defaultHeaders', defaultHeaders);

  const {
    data: response,
    pending,
    error,
    refresh,
  } = useFetch(fullUrl, {
    method: 'POST',
    body,
    headers: defaultHeaders,
    immediate: true,
    retry: 2, // Автоматический повтор запроса при ошибке
  });

  return { response, pending, error, refresh };
}

export async function fetchGet<T = any>(
  apiUrl: string,
  apiPath: string,
  params?: Record<string, any>,
  opts: { throwOnNotFound?: boolean } = { throwOnNotFound: true }
): Promise<T | null> {
  initializeApi();
  try {
    const isServer = appUtils.isRunOnServer();
    const fullUrl = makeProxyUrl(`${apiUrl}${apiPath}`);

    // Типизированный $fetch
    return await $fetch<T>(fullUrl, {
      method: 'GET',
      query: params,
      credentials: 'include',
      headers: isServer ? useRequestHeaders(['cookie']) : { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    // если уже H3Error / createError — пробрасываем как есть (сохраняем data)
    const statusCode = e?.statusCode ?? e?.response?.status;
    const data = e?.data ?? e?.response?.data ?? null;
    const message = e?.message ?? e?.statusMessage ?? (data && data.message) ?? 'Request error';

    // специальная логика для 401 (можно вернуть null вместо броска)
    if (statusCode === 401) {
      console.warn('[fetchGet] Неавторизован — возвращаю null');
      return null;
    }

    // 404: по умолчанию бросаем H3Error, но можно отключить через opts.throwOnNotFound === false
    if (statusCode === 404 && opts.throwOnNotFound === false) {
      console.warn(`[fetchGet] 404 for ${apiPath} — returning null (throwOnNotFound=false)`);
      return null;
    }

    if (statusCode) {
      // пробрасываем H3Error с оригинальными данными в поле data
      throw createError({
        statusCode: Number(statusCode),
        message,
        data,
      });
    }

    // прочие ошибки — логируем и пробрасываем
    console.error('Ошибка в fetchGet (unknown):', e);
    throw e;
  }
}

export async function fetchDelete(apiUrl: string, apiPath: string, params?: Record<string, any>) {
  initializeApi();
  try {
    const isServer = appUtils.isRunOnServer();
    const fullUrl = makeProxyUrl(`${apiUrl}${apiPath}`);

    return await $fetch(fullUrl, {
      method: 'DELETE',
      query: params,
      credentials: 'include',
      headers: isServer ? useRequestHeaders(['cookie']) : { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    if (e?.response?.status === 401) {
      console.warn('[fetchDelete] Неавторизован — возвращаю null');
      return null;
    }

    console.error('Ошибка в fetchDelete:', e);
    throw e;
  }
}

/** обработка серверных ошибок при SSR */
export function handleAsyncDataError(errorRef: Ref<any>) {
  if (!errorRef?.value) return;

  const err = errorRef.value;
  const statusCode = err?.statusCode ?? err?.status ?? 500;
  const message = err?.message ?? err?.statusMessage ?? 'Server error';
  const data = err?.data ?? null;

  if (process.server) {
    // при SSR — бросаем, чтобы Nuxt вернул нужный HTTP-код
    throw createError({
      statusCode,
      statusMessage: message,
      data,
    });
  } else {
    // при CSR — можно показать toast / редирект / router.push('/404')
    // if (statusCode === 404) {
    //   navigateTo('/404'); // или своя страница ошибки
    // } else {
    //   console.error('Client fetch error:', statusCode, message);
    // }
  }
}
