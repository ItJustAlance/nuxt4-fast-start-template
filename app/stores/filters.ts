import { defineStore } from 'pinia';
import type { FiltersList, SelectedFiltersList } from '~/types/types';
import { fetchPost } from '@/utils/fetchUtils';

export const useFiltersStore = defineStore('filters', {
  // фильтры, доступ по ['категория']
  state: () => ({
    filters: {} as FiltersList, // возможные фильтры и их настройки
    selectedFilters: {} as SelectedFiltersList, // выбранные фильтры и значения

    showFilters: false,
    initFilterData: false, // инициализация фильтров
    currentFilterName: '', // выбранный фильтр для мобильной версии, в отдельном окне
  }),

  actions: {
    onShowFilter(isShow: boolean) {
      this.showFilters = isShow;
    },

    onInitFilter(isLoaded: boolean) {
      this.initFilterData = isLoaded;
    },
    
    
    
    async initFilters(force: boolean = false) {      
      console.log("фильтры: инициализация");
      if (!force && this.initFilterData) {
        console.log("фильтры: уже загружены");
        return "success";
      }
      try {
        const params = {};
        const config = useRuntimeConfig();
        const result: any = await fetchPost(config.public.fakeApiUrl, '/filters', params, false);
        this.filters = result.data;
        return result.status;
      } catch (e) {
        console.error('фильтры: данные не загрузились', e);
      }
      console.log("фильтры: загрузка завершена");
    },

    onSelectedFilters(selectedCategory: string, newSelectedFilters: []) {
      this.selectedFilters[selectedCategory] = newSelectedFilters;
    },

    hasActiveFilters(selectedCategory: string) {
      const checkValue = (value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(checkValue);
        }
        return Boolean(value);
      };
      return this.selectedFilters[selectedCategory] ? checkValue(this.selectedFilters[selectedCategory]) : false;
    },

    clearFiltersByQueryParam(selectedCategory: string, queryParam: string): number {
      if (!this.selectedFilters[selectedCategory] || !Array.isArray(this.selectedFilters[selectedCategory])) {
        return 0;
      }

      const before = this.selectedFilters[selectedCategory].length;

      const filtered = this.selectedFilters[selectedCategory].filter((el: any) => {
        const item = el;
        // если элемент не соответствует — оставляем его (return true); если соответствует queryParam — удаляем (return false)
        return !(item && item.queryParam === queryParam);
      });

      // реактивно заменить массив
      this.selectedFilters[selectedCategory] = filtered;

      const after = filtered.length;
      return before - after;
    },
  },
});
