export default defineSitemapEventHandler(async () => {
  // карта сайта - каталог курсов
  const config = useRuntimeConfig();
  const urls: any[] = [];
  try {
    // минимальный запрос для получения total и генерации списка страниц
    const apiUrl = `${config.public.realApiUrl}/courses`;
    const coursesResponse = await $fetch<any>(apiUrl, {
      method: 'GET',
      params: { page: 1, perPage: 1 },
    });

    // TODO: добавить апи для получения даты последнего изменения курсов в базе и вставлять в lastmod

    if (coursesResponse?.data?.pagination?.total) {
      const totalCourses = coursesResponse.data.pagination.total;
      const perPage = 6; // соответствует limit в courses/index.vue
      const totalPages = Math.ceil(totalCourses / perPage);
      for (let page = 1; page <= totalPages; page++) {
        urls.push({
          loc: page === 1 ? `${config.public.siteUrl}/courses` : `${config.public.siteUrl}/courses?page=${page}`,
          changefreq: 'daily',
          priority: page === 1 ? 0.8 : 0.6, // Первая страница важнее
          lastmod: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error('Ошибка в генерации карты сайта для курсов', error);
    // В случае ошибки добавляем хотя бы первую страницу
    urls.push({
      loc: '/courses',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });
  }

  return urls;
});
