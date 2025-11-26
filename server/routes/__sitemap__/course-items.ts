export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig();
  const urls: any[] = [];

  const perPage = 100;
  let page = 1;

  try {
    while (true) {
      const response = await $fetch<any>(`${config.public.realApiUrl}/courses`, {
        method: 'GET',
        params: {
          page,
          perPage,
        },
      });

      const items = response.data.items;
      const pagination = response.data.pagination;

      if (!items.length) break;

      for (const course of items) {
        const id = course?.id ?? course?.courseId ?? course?.course_id;
        if (!id) continue;
        urls.push({
          loc: `${config.public.siteUrl}/courses/${id}`,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: '',
        });
      }

      if (!shouldContinue(page, perPage, pagination, items.length)) {
        break;
      }

      page += 1;
    }
  } catch (error) {
    console.error('[sitemap] failed to build course detail sitemap', error);
  }

  return urls;
});

function shouldContinue(page: number, perPage: number, pagination: any, received: number) {
  if (!pagination) {
    return received === perPage;
  }

  const total = Number(pagination?.total ?? 0);
  const limit = Number(pagination?.perPage ?? perPage);
  if (!total || !limit) return received === perPage;

  const totalPages = Math.ceil(total / limit);
  return page < totalPages;
}
