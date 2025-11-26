export type BreadcrumbItemInput = {
  label?: string;
  name?: string;
  route?: string;
  url?: string;
  href?: string;
  to?: string;
  path?: string;
};

function joinWithBase(raw: string | undefined, baseUrl: string): string | undefined {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = raw.startsWith('/') ? raw : `/${raw}`;
  return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath;
}

export function createBreadcrumbsSchema(items: BreadcrumbItemInput[] | null | undefined, baseUrl: string) {
  console.log('createBreadcrumbsSchema items', items);
  if (!items || items.length === 0) return null;

  const list = items
    .map((item) => {
      const name = (item.name || item.label || '').trim();
      const href = item.url || item.href || item.route || item.to || item.path;
      const url = joinWithBase(href, baseUrl);

      if (!name || !url) return null;

      return { name, url };
    })
    .filter(Boolean) as Array<{ name: string; url: string }>;

  if (list.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': item.url,
        name: item.name,
      },
    })),
  };
}
