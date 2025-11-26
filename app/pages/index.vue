<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useFiltersStore } from '~/stores/filters';
import { useEntrySeo } from '~/composables/seo/useEntrySeo';
import {fetchGet} from "@/utils/fetchUtils";


const route = useRoute();
// const id = route.params.course;

const breadcrumbList = ref([
  { label: 'тестовая', route: '/' },
  {
    label: 'Изучение основ трёхмерного моделирования и печати для использования в образовательном процессе',
    route: route.path,
    isCurrent: true,
  },
]);

useEntrySeo({ breadcrumbs: breadcrumbList });
const sliderTeach = reactive({
  data: [
    {
      id: 1,
      url: '/img/teach1.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 2,
      url: '/img/teach2.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 3,
      url: '/img/teach-default.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 4,
      url: '/img/teach2.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 5,
      url: '/img/teach-default.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 6,
      url: '/img/teach1.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
  ],
  options: [
    {
      breakpoint: '1200px',
      numVisible: 4,
      numScroll: 1,
      circular: true,
    },
    {
      breakpoint: '1023px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 2,
      numScroll: 1,
      circular: true,
    },
  ],
});



const selectedCity = ref(null);
const courseList = ref([]);
const filterPopular = ref(false);
const filterNew = ref(false);

const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);

// Пагинация
const currentPage = ref(1);
const itemsPerPage = ref(6); // Начальный лимит, но можно переопределить из ответа сервера
const totalCourses = ref(0); // Будет обновляться при первом запросе

// Стор фильтров
const filtersStore = useFiltersStore();
const { initFilterData, showFilters } = storeToRefs(filtersStore);

// Функция запроса мероприятий
const fetchEvents = async (page = 1, limit = itemsPerPage.value) => {
  try {
    const config = useRuntimeConfig();
    const response = await fetchGet(config.public.fakeApiUrl, '/courses', {page: 1, limit: 100}, false);

    if (!response || !Array.isArray(response.data)) {
      throw new Error('API вернул некорректные данные');
    }

    // Обновляем общее количество мероприятий и лимит, если они приходят в ответе
    totalCourses.value = response.total || totalCourses.value;
    itemsPerPage.value = response.limit || itemsPerPage.value;

    console.log(`Загружена страница ${response.page} из ${Math.ceil(totalCourses.value / itemsPerPage.value)}`);

    return response.data;
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return [];
  }
};

onMounted(async () => {
  courseList.value = await fetchEvents();
  await onFilterData();
});

// Инициализация фильтров
const onFilterData = async () => {
  const result = await filtersStore.initFilters();
  console.log('onFilterData', result);

  if (result === 'success') {
    filtersStore.onInitFilter(true);
  }
};

// Переключение видимости фильтров
const onFilterShow = (value: boolean) => {
  filtersStore.onShowFilter(value);
};

// Функция подгрузки дополнительных мероприятий
const onCoursesMore = async () => {
  if (!hasMoreCourses.value) return; // Если данных больше нет, не загружаем

  currentPage.value += 1;
  const moreCourses = await fetchEvents(currentPage.value);

  courseList.value = [...courseList.value, ...moreCourses];
};

// Проверяем, есть ли еще мероприятия для загрузки
const hasMoreCourses = computed(() => {
  return courseList.value.length < totalCourses.value;
});

</script>


<template>
  <div class="all">
    <Breadcrumb :model="breadcrumbList">
      <template #item="{ item, props }">
        <NuxtLink v-if="item.route && !item.isCurrent" v-slot="{ navigate }" :to="item.route" custom>
          <a class="bread-item" :href="item.route" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </NuxtLink>
        <span v-else class="bread-item">
          <span>{{ item.label }}</span>
        </span>
      </template>
      <template #separator> <span class="f-700">/</span> </template>
    </Breadcrumb>
    <div class="page-title h2-title">Курсы для вас </div>
    <pre>{{ initFilterData }}</pre>
    <div class="b-container">
      <aside class="aside hidden-lg">
        <FilterComp v-if="initFilterData" />
      </aside>
      <main class="content-body">
        
        
        <section class="section">
          <ul class="search-list-tags filter-active-list">
            <li class="search-tag-item" v-for="(tag, index) in ['Воспитатель', 'Стоимость: 120р –120 000р', 'Длительность: 168-320 часов']" :key="index">
              <div class="search-tag-item__wrap">
                <div class="search-tag-item__title">{{ tag }}</div>
                <div class="search-tag-item__del">
                  <SvgIcon name="xcircle" class="ic12"></SvgIcon>
                </div>
              </div>
            </li>
          </ul>
        </section>
        
        <section class="section">
          <div class="b-row-center --align-center">
            <button class="btn btn--second">
              <span class="btn-label">Сбросить все фильтры</span>
              <SvgIcon name="xcircle" class="fnone ic24"></SvgIcon>
            </button>
          </div>
        </section>
        
        <section class="section">
          <div v-if="courseList.length === 0" class="search-no-result">
            <div class="img">
              <img src="/img/red/file_searching.svg" alt="Поиск" />
            </div>
            <div class="text h5-title">
              По вашим параметрам поиска курсов не найдено. Попробуйте изменить фильтры
            </div>
          </div>
        </section>
        
        <div v-if="courseList.length > 0" class="result-content">
          <div class="result-content__header">
            <div class="result-filters">
              <div class="result-filters__item --select">
                <Select
                  v-model="selectedCity"
                  :options="cities"
                  option-label="name"
                  placeholder="Выберите город"
                  class="select-filter-sort"
                >
                  <template #dropdownicon>
                    <SvgIcon name="caret-down" class="fnone ic24"></SvgIcon>
                  </template>
                </Select>
              </div>
              
              <div class="result-filters__item visible-lg">
                <button class="btn-filter btn-filter-show" @click="onFilterShow(true)">
                  <SvgIcon name="faders-horizontal" class="fnone ic24"></SvgIcon>
                </button>
              </div>
            </div>
            
            <div class="filter-list-first">
              <div class="b-checkbox">
                <Checkbox v-model="filterPopular" :binary="true" input-id="popular" />
                <label for="popular">Популярные</label>
              </div>
              <div class="b-checkbox">
                <Checkbox v-model="filterNew" :binary="true" input-id="filterNew" />
                <label for="filterNew">Новые</label>
              </div>
            </div>
          </div>
          
          <div class="result-content__body">
            <div class="popular-list">
              <div class="popular-item" v-for="(course, index) in courseList" :key="index">
                <CourseBox :item="course" />
              </div>
            </div>
            
            <div  v-if="hasMoreCourses" class="more-load --align-center">
              <button @click="onCoursesMore" class="btn btn--second">
                <span class="btn-label">Еще 6 курсов из {{ totalCourses }}</span>
                <SvgIcon name="caret-circle-down" class="fnone ic24"></SvgIcon>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <div v-if="showFilters" class="filter-mobile">
      <FilterMobile v-if="initFilterData" />
    </div>
    
    <div class="filter-mobile --single">
      <!-- FilterMobileFull v-if="initFilterData" / -->
    </div>
  </div>
</template>
