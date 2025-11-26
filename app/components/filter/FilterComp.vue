<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFiltersStore } from '~/stores/filters';
import type { TFilterData } from '~/types/ui/TFilter';

// универсальный фильтр, возможности:
// - сохраняет данные между переходами по страницам
// - строится и рисуется из json-настроек

interface Props {
  filtersCategory?: string;
  selectedFiltersCategory?: string;
}
const props = withDefaults(defineProps<Props>(), {
  filtersCategory: 'courses',
  selectedFiltersCategory: 'courses',
});

const filtersStore = useFiltersStore();
const { selectedFilters, filters } = storeToRefs(filtersStore);

const filterResultData = ref<TFilterData[]>([]);

const isLoadData = ref(false);

// фильтры для показа
const categoryFilters = computed(() => {
  return filters.value[props.filtersCategory];
});

onMounted(async () => {  
  forceSyncFilters();
});

const initFilterUpdate = (newFilter: TFilterData) => {
  const filterData = filterResultData.value.find((filter) => filter.id === newFilter.id);
  if (!filterData) {
    filterResultData.value = [...filterResultData.value, newFilter];
  }
};

function updateFilterData(filterFull: TFilterData, filterName: string, filterId: string | number, newValue: unknown) {
  // к этому моменту фильтр уже есть в filterResultData
  // теперь она подчистить список и убрать из него все незначимые значения
  console.log('фильтр: обновление результатов', filterFull, filterName, filterId, 'newVal2', newValue);
  console.log('фильтр: filterResultData до подчистки', filterResultData);
  isLoadData.value = true;
  const filterData = filterResultData.value.find((filter) => filter.id === filterId);
  console.log('фильтр: текущие значения фильтра', filterData);
  if (filterData) {
    if (!newValue) {
      console.log('ФИЛЬТР, надо удалить', filterFull, newValue);
      const index = filterResultData.value.indexOf(filterData);
      if (index !== -1) {
        console.log('фильтр: пустое значение можно убрать', filterName, filterId);
        filterResultData.value.splice(index, 1);
        filterResultData.value = [...filterResultData.value];
      }
    }
  } else {
    if (newValue) {
      console.log('ФИЛЬТР, надо добавить', filterFull, newValue);
      const updatedFilter = {
        ...filterFull,
        value: newValue
      };
      filterResultData.value = [...filterResultData.value, updatedFilter];
    }
  }
  console.log('фильтр: filterResultData после подсчистки', filterResultData);

  // сообщить компонентам об изменении
  filtersStore.onSelectedFilters(props.selectedFiltersCategory, filterResultData.value);
  isLoadData.value = false;
}

watch(
  () => selectedFilters.value[props.selectedFiltersCategory],
  () => {
    forceSyncFilters();
  },
  { deep: true }
);

function forceSyncFilters() {
  // принудительно обновляем значения фильтров данными из хранилища, 
  // например, при массовом сбросе через кнопку или повторной загрузки страницы
  const currentSelected = selectedFilters.value[props.selectedFiltersCategory] || [];
  filterResultData.value = currentSelected;
}

const clearFilters = () => {
  filtersStore.onSelectedFilters(props.selectedFiltersCategory, []);
}

const closeFilter = () => {
  filtersStore.onShowFilter(false);
  document.body.classList.toggle('lock', false);
}
</script>

<template>
  <div class="filters">
    <!-- pre v-if="!isLoadData" class="ffdf">{{ selectedFilters }}</pre -->
    <div v-if="categoryFilters.length > 0" class="filters-body">
      <FilterGroup
        v-for="filter in categoryFilters"
        :key="filter.title"
        :title="filter.title"
        :filter-name="filter.name"
        :filters="filter.filters"
        :searchable="filter.searchable"
        :show-toggle="filter.showToggle"
        :filterResultData="filterResultData"
        :slider-data="filter.sliderData"
        :show-all="filter.showAll"
        :show-full="['directionFilters', 'formatFilters']"
        @init-filter-update="initFilterUpdate"
        @update-filter-data="updateFilterData"
      />
    </div>
    <!-- end filters-body -->
    <div class="filters-bottom --mobile">
      <div class="col-2">
        <button @click="clearFilters()" class="btn btn--second btn--full">Очистить</button>
      </div>
      <div class="col-2">
        <button @click="closeFilter()" class="btn btn--full">Применить</button>
      </div>
    </div>
  </div>
</template>
