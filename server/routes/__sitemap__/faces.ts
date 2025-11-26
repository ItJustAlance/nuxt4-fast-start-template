export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig();
  const urls: any[] = [];

  const perPage = 100;
  let page = 1;

  try {
    while (true) {
      const response = await $fetch<any>(`${config.public.realApiUrl}/teachers`, {
        method: 'GET',
        params: {
          page,
          perPage,
          sortBy: 'updated_at',
          sortOrder: 'desc',
        },
      });

      const items = response.data;
      const pagination = response.data.pagination;
      if (!items.length) break;

      for (const teacher of items) {
        const id = teacher?.id;
        if (!id) continue;

        urls.push({
          loc: `${config.public.siteUrl}/faces/${id}`,
          changefreq: 'weekly',
          priority: 0.5,
          lastmod: '',
        });
      }

      if (!shouldContinue(page, perPage, pagination, items.length)) {
        break;
      }

      page += 1;
    }
  } catch (error) {
    console.error('[sitemap] failed to build faces sitemap', error);
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
