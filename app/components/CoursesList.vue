<script lang="ts" setup>
import { fetchGet } from '@/utils/fetchUtils';
import appUtils from '~/utils/appUtils';
import type { TCourseItem } from '~/types/public/TCourse';
import type { TCoursesListResponse } from '~/types/api/TCoursesResponse';
/** самые популярные курсы **/

const popularCourses = ref<TCourseItem[]>([]);

// загрузка курсов
const fetchPopularCourses = async (): Promise<TCourseItem[]> => {
  try {
    const params = {
      page: 1,
      perPage: 6,
      sortBy: 'sort',
      sortOrder: 'desc',
    };

    const config = useRuntimeConfig();
    const paramsQuery = appUtils.prepareUrlQueryPath(params);
    console.log('asddddd');
    const response = await fetchGet<TCoursesListResponse>(config.public.realApiUrl, '/courses', paramsQuery);

    if (!response || !response.data || !Array.isArray(response.data.items) || !response.data.pagination) {
      console.error('API вернул некорректные данные', response);
      throw createError({
        statusCode: 404,
        statusMessage: 'Список курсов не найден',
        fatal: true,
      });
    }

    return response.data.items;
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return [];
  }
};
// Получаем данные фильтров при монтировании
onMounted(async () => {
  popularCourses.value = await fetchPopularCourses();
});
</script>

<template>
  <div v-for="(course, index) in popularCourses" :key="index" class="course-item">
    <CourseBox :item="course" />
  </div>
</template>
