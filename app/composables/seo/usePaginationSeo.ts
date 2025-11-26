import { computed, unref, type MaybeRefOrGetter } from 'vue';
import { useHead, useRuntimeConfig } from '#imports';

type MaybeRef<T> = MaybeRefOrGetter<T | null | undefined>;

type QueryValue = string | number | boolean | null | undefined | QueryValue[];

type PaginationSeoOptions = {
  currentPage: MaybeRef<number>;
  totalPages?: MaybeRef<number>;
  totalItems?: MaybeRef<number>;
  perPage?: MaybeRef<number>;
  basePath?: MaybeRef<string>;
  query?: MaybeRef<Record<string, QueryValue>>;
  pageParam?: MaybeRef<string>;
  includeFirstPageParam?: MaybeRef<boolean>;
  siteUrl?: MaybeRef<string>;
};

const DEFAULT_SITE_URL = 'https://new.dpomos.ru';

function normalizeBasePath(path?: string | null): string {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function toQueryString(query: Record<string, QueryValue>) {
  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === '' || value === false) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item != null && item !== '' && item !== false) search.append(key, String(item));
      });
      return;
    }
    search.append(key, String(value));
  });
  return search.toString();
}

export function usePaginationSeo(opts: PaginationSeoOptions) {
  const runtimeConfig = useRuntimeConfig();

  const siteOrigin = computed(() => {
    const provided = unref(opts.siteUrl);
    const runtime =
      (runtimeConfig.public?.siteUrl as string | undefined) ||
      (runtimeConfig.public?.appBaseUrl as string | undefined) ||
      undefined;
    return String(provided || runtime || DEFAULT_SITE_URL).replace(/\/+$/, '');
  });

  const pageParam = computed(() => (unref(opts.pageParam) || 'page').trim());
  const basePath = computed(() => normalizeBasePath(unref(opts.basePath)));

  const currentPage = computed(() => Math.max(1, Math.floor(Number(unref(opts.currentPage)) || 1)));

  const totalPages = computed(() => {
    const explicit = Number(unref(opts.totalPages));
    if (!Number.isNaN(explicit) && explicit > 0) {
      return Math.max(1, Math.floor(explicit));
    }

    const totalItems = Number(unref(opts.totalItems)) || 0;
    const perPage = Math.max(1, Math.floor(Number(unref(opts.perPage)) || 1));

    if (totalItems <= 0) return 1;
    return Math.max(1, Math.ceil(totalItems / perPage));
  });

  function makePageUrl(pageNumber: number) {
    const query = { ...(unref(opts.query) || {}) };

    if (pageNumber > 1 || unref(opts.includeFirstPageParam)) {
      query[pageParam.value] = pageNumber;
    } else {
      delete query[pageParam.value];
    }

    const qs = toQueryString(query);
    return qs ? `${basePath.value}?${qs}` : basePath.value;
  }

  const canonical = computed(() => `${siteOrigin.value}${makePageUrl(currentPage.value)}`);
  const prev = computed(() =>
    currentPage.value > 1 ? `${siteOrigin.value}${makePageUrl(currentPage.value - 1)}` : undefined,
  );
  const next = computed(() =>
    currentPage.value < totalPages.value ? `${siteOrigin.value}${makePageUrl(currentPage.value + 1)}` : undefined,
  );

  useHead(() => {
    const link: Array<Record<string, string>> = [];
    if (canonical.value) link.push({ rel: 'canonical', href: canonical.value });
    if (prev.value) link.push({ rel: 'prev', href: prev.value });
    if (next.value) link.push({ rel: 'next', href: next.value });
    return { link };
  });

  return {
    canonical,
    prev,
    next,
    totalPages,
    makePageUrl,
  };
}