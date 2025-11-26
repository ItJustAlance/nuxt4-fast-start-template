/**
 * usePaginatedFetch — универсальный composable для постраничной загрузки данных (пагинации) с поддержкой SSR.
 *
 *  Возможности:
 * - Поддерживает SSR-инициализацию через useState (ssrStateKey)
 * - Управляет состоянием списка (list) и страниц (filterPage)
 * - Автоматически догружает страницы при изменении page, 
 * если загрузится изначально page=3, то после loadMore загрузятся [1,2,4,5]
 * - Сбрасывает список при изменении фильтров (queryParams)
 * - Избегает повторных запросов уже загруженных страниц
 * - Поддерживает "Показать ещё" (loadMore)
 *
 *  Пример:
 * const filterPage = ref({ page: 1, limit: 10, total: 0 });
 * const queryParams = computed(() => ({ category: selectedCategory }));
 *
 * const { list, isLoading, loadMore, filterPage } = usePaginatedFetch({
 *   endpoint: '/api/items',
 *   queryParams,
 *   dataPath: 'data.items',
 *   paginationPath: 'data.pagination',
 *   filterPage,
 *   ssrStateKey: 'items-list', // опционально
 *   isFirstLoad: true,
 * });
 *
 *  Возвращает:
 * - list — реактивный массив элементов
 * - filterPage — объект { page, limit, total }
 * - isLoading / hasMoreLoading — индикаторы загрузки
 * - loadMore() — подгрузка следующей страницы
 * - resetPage() — сброс на первую страницу
 */
import { ref, watch, computed, nextTick, watchEffect } from 'vue';
import { fetchGet } from '@/utils/fetchUtils';

interface Options<T> {
  endpoint: string;
  queryParams: any; // computed(...)
  dataPath: string; // например "data.items"
  paginationPath: string; // например "data.pagination"
  filterPage: any; // reactive { page, limit, total }
  // опционально: если вы сохраняете SSR-результат в useState под ключом, передайте этот ключ
  ssrStateKey?: string;
  isFirstLoad: boolean;
}

export function usePaginatedFetch<T>(options: Options<T>) {
  const list = ref<T[]>([]);
  const filterPage = options.filterPage;

  const actualQueryParams = computed(() => ({
    ...(options.queryParams?.value ?? {}),
    page: Number(filterPage.value.page) || 1,
    perPage: Number(filterPage.value.limit) || 1,
  }));

  // набор уже загруженных страниц
  const fetchedPages = ref<Set<number>>(new Set());

  // флаг чтобы защититься от программных переустановок page (избежать лишних циклов)
  const isResetting = ref(false);

  // попытка прочитать SSR-данные (если компонент положил их в useState по ключу)
  const ssrState =
    typeof options.ssrStateKey === 'string' && options.ssrStateKey
      ? useState<any>(options.ssrStateKey, () => null)
      : null;

  // если есть SSR-данные — попробуем взять страницу из них (если присутствует pagination.pageCurrent)
  let ssrInitialPage: number | null = null;
  if (ssrState && ssrState.value) {
    try {
      const p =
        ssrState.value?.data?.pagination?.currentPage ??
        ssrState.value?.pagination?.currentPage ??
        ssrState.value?.data?.pagination?.page ??
        ssrState.value?.pagination?.page ??
        null;
      ssrInitialPage = p ? Number(p) : null;
    } catch {
      ssrInitialPage = null;
    }
  }

  // Если есть SSR-данные — применим их сразу и пометим страницу как загруженную.
  // ВАЖНО: если pageCurrent отсутствует в SSR-ответе, используем filterPage.value.page как fallback.
  if (ssrState && ssrState.value) {
    const appliedPage = ssrInitialPage ?? (Number(filterPage.value.page) || 1);
    // если ещё не помечено — применяем (это предотвратит повторный fetch в watch)
    if (!fetchedPages.value.has(appliedPage)) {
      try {
        applyResponseToPage(ssrState.value, appliedPage);
      } catch (e) {
        // если распаковка не удалась — ничего, позволим обычному fetch уйти
        console.warn('usePaginatedFetch: cannot apply SSR state, will fetch normally', e);
      }
    }
  }

  const isLoading = ref(false);
  const hasMoreLoading = ref(false);

  // helper: взять значение по пути
  function getValueByPath(obj: any, path: string, defaultValue = undefined) {
    if (!obj) return defaultValue;
    return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj) ?? defaultValue;
  }

  // применяем ответ для конкретной страницы — вставляем элементы и обновляем пагинацию
  function applyResponseToPage(resp: any, pageNum: number) {
    const items = Array.isArray(getValueByPath(resp, options.dataPath, []))
      ? getValueByPath(resp, options.dataPath, [])
      : [];

    const pagination = getValueByPath(resp, options.paginationPath, {}) ?? {};

    // Вставляем элементы в правильное место в списке:
    // если ещё не было загруженных страниц — просто ставим
    if (!fetchedPages.value.size) {
      list.value = items.slice();
    } else {
      // добавляем в конец, чтобы не ломать порядок
      list.value = list.value.concat(items);
    }

    // обновляем метаданные пагинации
    filterPage.value.total = Number(pagination.total ?? filterPage.value.total ?? 0);
    filterPage.value.limit = Number(pagination.perPage ?? filterPage.value.limit ?? filterPage.value.limit);

    // отмечаем страницу как загруженную
    fetchedPages.value.add(Number(pageNum));
    // Force reactive update
    fetchedPages.value = new Set(fetchedPages.value);
  }

  // fetch конкретной страницы (если не загружена)
  async function fetchPage(pageNum: number) {
    pageNum = Number(pageNum) || 1;
    // защита от повторного вызова
    if (isLoading.value || hasMoreLoading.value) return;
    if (fetchedPages.value.has(pageNum)) return;
    // подготовка params (копируем queryParams, но явно задаём page/perPage)
    const params = { ...(options.queryParams?.value ?? {}) };
    params.page = pageNum;
    params.perPage = Number(filterPage.value.limit) || 1;

    console.log('params', params);

    // выставляем нужный лоадер
    if (pageNum === 1) {
      isLoading.value = true;
    } else {
      hasMoreLoading.value = true;
    }

    try {
      const res = await fetchGet(useRuntimeConfig().public.realApiUrl, options.endpoint, params);
      if (!res) return;
      applyResponseToPage(res, pageNum);
      await nextTick();
    } catch (e) {
      console.error('usePaginatedFetch.fetchPage error', e);
    } finally {
      isLoading.value = false;
      hasMoreLoading.value = false;
    }
  }

  // Если есть SSR-данные и мы ещё не пометили SSR-страницу — применим их сразу и пометим страницу загруженной.
  if (ssrState && ssrState.value && ssrInitialPage) {
    // защитимся: если текущий filterPage уже равен этой странице, не делать лишнего
    if (!fetchedPages.value.has(Number(ssrInitialPage))) {
      try {
        applyResponseToPage(ssrState.value, Number(ssrInitialPage));
      } catch (e) {
        // игнорируем ошибки распаковки
        // если что-то пошло не так — позволим нормальному fetch работать
      }
    }
  }

  // watch на изменение запрошенной страницы — загружаем только если страница ещё не загружена
  watch(
    () => filterPage.value.page || 1,
    (page) => {
      const p = Number(page) || 1;

      // если страница уже загружена — ничего не делаем
      if (fetchedPages.value.has(p)) {
        // edge-case: если список пуст (например SSR дал пустой результат и мы пометили страницу),
        // то всё равно попробуем загрузить, чтобы убедиться, что данные есть
        if (!list.value.length) {
          fetchPage(p);
        }
        return;
      }

      // если есть SSR-данные и запрошенная страница совпадает с SSR-страницей — применим SSR-значение
      if (ssrState && ssrState.value && ssrInitialPage && p === Number(ssrInitialPage)) {
        try {
          applyResponseToPage(ssrState.value, Number(ssrInitialPage));
          return;
        } catch {
          // fallthrough -> fetchPage
        }
      }

      // иначе — делаем сетевой запрос для нужной страницы
      fetchPage(p);
    },
    { immediate: true },
  );

  watch(
    () => options.queryParams.value,
    (newVal, oldVal) => {
      // Защита от программных перенастроек
      if (isResetting.value) return;

      if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

      // выделим page из новых и старых параметров
      const newPage = Number(newVal?.page ?? 1);
      const oldPage = Number(oldVal?.page ?? 1);

      // helper: копия объекта без page
      const withoutPage = (obj: any) => {
        const copy = { ...(obj || {}) };
        delete copy.page;
        return copy;
      };

      const otherChanged = JSON.stringify(withoutPage(newVal)) !== JSON.stringify(withoutPage(oldVal));

      // Если изменились параметры кроме page -> это фильтр/поиск: полностью сбрасываем список и загружаем первую страницу
      if (otherChanged) {
        fetchedPages.value = new Set();
        list.value = [];

        // Если мы уже на 1 странице - просто запрашиваем её
        if (Number(filterPage.value.page) === 1) {
          fetchPage(1);
          return;
        }

        // Иначе - переключаем текущую страницу на 1 (watch на filterPage подхватит и вызовет fetch)
        isResetting.value = true;
        filterPage.value.page = 1;
        // сбрасываем флаг после следующего тика, чтобы позволить реакции пройти
        nextTick(() => {
          isResetting.value = false;
        });

        return;
      }

      // Если дошли сюда - изменился только page в queryParams. Синхронизируем filterPage.page
      if (newPage !== oldPage) {
        // Просто установим filterPage.page — существующий watch на filterPage сделает fetchPage
        filterPage.value.page = newPage;
      }
    },
    { deep: true },
  );

  watchEffect(() => {
    isLoading.value = true;
    const test2 = options.queryParams.value;
    const test = actualQueryParams;
    isLoading.value = false;
  });

  // loadMore: находим минимальную отсутствующую страницу, начиная с 1
  function loadMore() {
    if (isLoading.value || hasMoreLoading.value) return;

    let next = 1;
    const MAX = 100000;
    while (fetchedPages.value.has(next) && next < MAX) next++;

    // Устанавливаем page — это вызовет watch и запустит загрузку этой страницы
    filterPage.value.page = next;
  }

  function resetPage() {
    filterPage.value.page = 1;
  }

  return {
    list,
    filterPage,
    isLoading,
    resetPage,
    hasMoreLoading,
    loadMore,
  };
}
