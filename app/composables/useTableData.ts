import { ref, onMounted, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { usePagination } from '~/composables/usePagination';

export function useTable<T>(options: UseTableOptions<T> & { extraParams?: Record<string, Ref<any>> }) {
  const {
    fetchFn,
    defaultSortBy = '',
    defaultPerPage = 1,
    defaultSortOrder = 'asc',
    manualSort = false,
    getItemId = (item) => (item).id,
    extraParams = {},
  } = options;
  console.log('START useTable');
  const allCheck = ref(false);
  const selected = ref<Record<string | number, boolean>>({});
  const sortBy = ref(defaultSortBy);
  const sortOrder = ref<SortOrder>(defaultSortOrder);

  const { data, currentPage, itemsPerPage, totalPages, setPage, setPerPage, getData, isLoading, error } =
    usePagination<T>((params) => {
      console.log('extraParams', extraParams);
      const resolvedExtras = Object.fromEntries(Object.entries(extraParams).map(([key, val]) => [key, val]));

      const merged = {
        ...params,
        perPage: itemsPerPage.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        ...resolvedExtras,
      };

      return fetchFn(merged);
    });

  const toggleAllCheck = () => {
    if (!data.value) return;
    data.value.forEach((item) => {
      selected.value[getItemId(item)] = allCheck.value;
    });
  };

  const sortColumn = (column: string) => {
    if (sortBy.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy.value = column;
      sortOrder.value = 'asc';
    }

    if (manualSort && data.value) {
      data.value = [...data.value].sort((a: any, b: any) => {
        const aVal = a[column];
        const bVal = b[column];

        let result = 0;
        if (aVal instanceof Date || bVal instanceof Date) {
          result = new Date(aVal).getTime() - new Date(bVal).getTime();
        } else {
          result = String(aVal ?? '').localeCompare(String(bVal ?? ''));
        }

        return sortOrder.value === 'asc' ? result : -result;
      });
    } else {
      getData();
    }
  };

  // дебаунсер при изменении параметров (сбрасывает страницу и перезагружает)
  const debouncedGetData = useDebounceFn(() => {
    // Сбрасываем на первую страницу и вызываем загрузку через setPage,
    // чтобы логика пагинации осталась централизованной в usePagination.
    setPage(1);
    // note: setPage вызывает getData() внутри usePagination
  }, 500);

  // --- Ранее: отдельные watch для каждого ref в extraParams
  // --- Теперь: единый computed array + один watch, чтобы объединять одновременные изменения
  const extraValues = computed(() =>
    Object.values(extraParams).map((r: any) => (r && typeof r === 'object' && 'value' in r ? r.value : r)),
  );

  // let extrasInitialized = false;
  // watch(
  //   extraValues,
  //   () => {
  //     if (extrasInitialized) {
  //       debouncedGetData();
  //     } else {
  //       extrasInitialized = true;
  //     }
  //   },
  //   { deep: false }
  // );

  onMounted(() => {
    getData();
    // extrasInitialized = true;
  });

  return {
    data,
    isLoading,
    error,
    sortBy,
    sortOrder,
    sortColumn,
    currentPage,
    itemsPerPage,
    totalPages,
    setPage,
    setPerPage,
    allCheck,
    selected,
    getData,
    toggleAllCheck,
  };
}
