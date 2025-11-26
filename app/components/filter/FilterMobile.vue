<template>
  <div class="filter-mobile__wrapper">
    <div class="filter-mobile__header">
      <div class="filter-close" @click="onClose(false)">
        <SvgIcon name="menu-close" class="ic42"></SvgIcon>
      </div>
    </div>
    <div class="filter-mobile__body">
      <div class="filter-mobile__title">Фильтры <span v-if="selectedFiltersTotal?.length > 0" class="num">{{ selectedFiltersTotal?.length }}</span></div>
      <ul class="search-list-tags filter-active-list">
        <li v-for="item in selectedFiltersGroups" class="search-tag-item">
          <div class="search-tag-item__wrap">
            <div class="search-tag-item__title">{{ item.title }}<strong v-if="item.count > 1"> ({{ item.count }})</strong> <strong v-else>: {{ item.label }}</strong></div>
            <div @click="onDeleteGroup(item.groupName)" class="search-tag-item__del"><SvgIcon name="xcircle" class="ic12"></SvgIcon></div>
          </div>
        </li>
      </ul>
      <FilterComp :filters-category="filtersCategory"  :selected-filters-category="selectedFiltersCategory" />
    </div>
  </div>
</template>

<script lang="ts" setup>

import { storeToRefs } from 'pinia';
import { useFiltersStore } from '~/stores/filters';

const filtersStore = useFiltersStore();
const { selectedFilters } = storeToRefs(filtersStore);

interface Props {
  filtersCategory?: string;
  selectedFiltersCategory?: string;
}

const props = withDefaults(defineProps<Props>(), {
  filtersCategory: 'courses',
  selectedFiltersCategory: 'courses',
});

const selectedFiltersTotal = computed(() =>  selectedFilters.value?.[props.selectedFiltersCategory] ?? []);


const selectedFiltersGroups = computed(() => {
  console.log('selectedFiltersTotal.val', selectedFiltersTotal.value)
  const grouped = (selectedFiltersTotal.value as any[]).reduce((acc: Record<string, any[]>, it: any) => {
    const key = it.filterTitle || 'Без группы';
    (acc[key] ||= []).push(it);
    return acc;
  }, {});

  return Object.entries(grouped).map(([title, items]) => ({
    title,
    count: items.length,
    groupName: items[0].queryParam, // название группы
    label: items.length === 1 ? (items[0].name ?? String(items[0].id ?? '')) : String(items.length),
    items,
  }));
});

const onDeleteGroup = (groupName) => {
  filtersStore.clearFiltersByQueryParam(props.selectedFiltersCategory, groupName);
}

function onClose(value) {
  filtersStore.onShowFilter(value);
  document.body.classList.toggle('lock', false);
}

</script>
