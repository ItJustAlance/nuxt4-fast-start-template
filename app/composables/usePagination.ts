// ~/composables/usePagination.ts
import { ref } from 'vue';
import type { TPaginatedResponse, TPaginationParams } from '~/types/api/TPagination';

/**
 * Универсальный usePagination.
 * defaultPerPage используется до первого ответа, затем itemsPerPage может быть обновлён из meta/perPage.
 */
export function usePagination<T>(
  fetchFunction: (params: TPaginationParams) => Promise<TPaginatedResponse<T> | unknown>,
  initialParams: TPaginationParams = {},
  defaultPerPage = 10,
) {
  const itemsPerPage = ref<number>(defaultPerPage);
  const currentPage = ref<number>(1);
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(1);
  const data = ref<T[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const params = ref<TPaginationParams>({ ...initialParams });

  // request id для защиты от гонок
  let lastRequestId = 0;

  const parseResult = (result: TPaginatedResponse<T> | unknown) => {
    let items: T[] = [];

    // dataBlock может быть либо объектом с items/pagination, либо массивом
    const dataBlock = result?.data;
    const topMeta = result?.meta ?? null;

    // приоритет: data.pagination -> data.meta -> top-level meta -> top-level fields
    const paginationBlock =
      dataBlock && typeof dataBlock === 'object' && !Array.isArray(dataBlock) && dataBlock.pagination
        ? dataBlock.pagination
        : null;

    const dataMeta =
      dataBlock && typeof dataBlock === 'object' && !Array.isArray(dataBlock) && dataBlock.meta ? dataBlock.meta : null;

    // items извлекаем в первую очередь
    if (dataBlock && typeof dataBlock === 'object' && Array.isArray(dataBlock.items)) {
      items = dataBlock.items as T[];
    } else if (Array.isArray(dataBlock)) {
      items = dataBlock as T[];
    } else if (Array.isArray(result)) {
      items = result as T[];
    } else {
      // возможно result.data содержит вложенный массив под другим ключом — но пока стандартные случаи покрыты выше
      items = [];
    }

    // теперь извлекаем пагинационные поля по приоритету
    const pTotal =
      (paginationBlock && typeof paginationBlock.total === 'number' ? paginationBlock.total : undefined) ??
      (dataMeta && typeof dataMeta.total === 'number' ? dataMeta.total : undefined) ??
      (topMeta && typeof topMeta.total === 'number' ? topMeta.total : undefined) ??
      (typeof result?.total === 'number' ? result.total : undefined) ??
      undefined;

    const pPerPage =
      (paginationBlock && typeof paginationBlock.perPage === 'number' ? paginationBlock.perPage : undefined) ??
      (dataMeta && typeof dataMeta.perPage === 'number' ? dataMeta.perPage : undefined) ??
      (topMeta && typeof topMeta.perPage === 'number' ? topMeta.perPage : undefined) ??
      (typeof result?.perPage === 'number' ? result.perPage : undefined) ??
      undefined;

    const pCurrent =
      (paginationBlock && typeof paginationBlock.currentPage === 'number' ? paginationBlock.currentPage : undefined) ??
      (dataMeta && typeof dataMeta.currentPage === 'number' ? dataMeta.currentPage : undefined) ??
      (topMeta && typeof topMeta.currentPage === 'number' ? topMeta.currentPage : undefined) ??
      (typeof result?.currentPage === 'number' ? result.currentPage : undefined) ??
      undefined;

    const pTotalPages =
      (paginationBlock && typeof paginationBlock.totalPages === 'number' ? paginationBlock.totalPages : undefined) ??
      (paginationBlock && typeof paginationBlock.count === 'number' && typeof pPerPage === 'number' && pPerPage > 0
        ? Math.ceil((paginationBlock.count as number) / pPerPage)
        : undefined) ??
      (dataMeta && typeof dataMeta.lastPage === 'number' ? dataMeta.lastPage : undefined) ??
      (dataMeta && typeof dataMeta.totalPages === 'number' ? dataMeta.totalPages : undefined) ??
      (topMeta && typeof topMeta.lastPage === 'number' ? topMeta.lastPage : undefined) ??
      (topMeta && typeof topMeta.totalPages === 'number' ? topMeta.totalPages : undefined) ??
      (typeof result?.totalPages === 'number' ? result.totalPages : undefined) ??
      undefined;

    // final safe values
    const safeTotal = Number(pTotal ?? (items ? items.length : 0));
    const safePerPage = Number(pPerPage ?? itemsPerPage.value) || itemsPerPage.value;
    const safeTotalPages = Number(pTotalPages ?? Math.max(1, Math.ceil(safeTotal / safePerPage)));
    const safeCurrentPage = Number(pCurrent ?? currentPage.value ?? 1) || 1;

    return {
      items: items ?? [],
      total: safeTotal,
      totalPg: safeTotalPages,
      currentPg: safeCurrentPage,
      perPageFromMeta: typeof pPerPage === 'number' && pPerPage > 0 ? Number(pPerPage) : undefined,
    };
  };

  const getData = async (page = 1) => {
    const reqId = ++lastRequestId;
    try {
      isLoading.value = true;
      error.value = null;

      // сразу пометим запрошенную страницу — полезно чтобы UI сразу отражал навигацию
      currentPage.value = page;

      const result = await fetchFunction({
        ...params.value,
        page,
        perPage: itemsPerPage.value,
      });

      // если между отправкой и получением ответа уже был новый запрос — игнорируем этот ответ
      if (reqId !== lastRequestId) {
        return;
      }

      const { items, total, totalPg, currentPg, perPageFromMeta } = parseResult(result);

      // синхронизируем perPage если пришёл от бэка
      if (typeof perPageFromMeta === 'number' && perPageFromMeta > 0 && perPageFromMeta !== itemsPerPage.value) {
        itemsPerPage.value = perPageFromMeta;
      }

      data.value = items ?? [];
      totalItems.value = Number(total ?? 0) || 0;
      totalPages.value = Number(totalPg ?? 1) || 1;

      // применяем currentPg только если валидный
      if (typeof currentPg === 'number' && !Number.isNaN(currentPg) && currentPg > 0) {
        currentPage.value = Number(currentPg);
      } else {
        // проверка границ — оставляем requested page, но в пределах totalPages
        if (currentPage.value < 1) currentPage.value = 1;
        if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
      }
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      // если это последний запрос — показываем ошибку
      if (reqId === lastRequestId) {
        error.value = 'Ошибка загрузки данных';
      }
    } finally {
      // отключаем индикатор загрузки только для последнего запроса
      if (reqId === lastRequestId) {
        isLoading.value = false;
      }
    }
  };

  const setPage = (page: number) => {
    // позволяем установить страницу даже если totalPages ещё не загружен (==0)
    if (page > 0 && (totalPages.value === 0 || page <= totalPages.value)) {
      currentPage.value = page;
      void getData(page);
    }
  };

  const setPerPage = (perPage: number) => {
    itemsPerPage.value = perPage;
    setPage(1);
  };

  const setParams = (newParams: TPaginationParams) => {
    params.value = { ...params.value, ...newParams };
    setPage(1);
  };

  return {
    data,
    currentPage,
    itemsPerPage,
    totalPages,
    setPage,
    setPerPage,
    getData,
    isLoading,
    error,
    setParams,
    params,
    totalItems,
  };
}
