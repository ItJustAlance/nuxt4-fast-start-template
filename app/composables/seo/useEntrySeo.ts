import { computed, unref, type Ref } from 'vue';
import { useHead, useRoute, useRuntimeConfig, useSeoMeta } from 'nuxt/app';
import { createBreadcrumbsSchema, type BreadcrumbItemInput } from '~/composables/seo/createBreadcrumbsSchema';

/** Универсальный метод для подстановки SEO-мета и schema.org */
type MaybeRef<T> = T | Ref<T>;

export type EntrySeoBreadcrumb = BreadcrumbItemInput;

export type EntrySeoSiteLink = {
  name: string;
  url: string;
};

type EntrySeoOptions = {
  title?: MaybeRef<string | null | undefined>;
  description?: MaybeRef<string | null | undefined>;
  image?: MaybeRef<string | null | undefined>;
  url?: MaybeRef<string | null | undefined>;
  type?: MaybeRef<'website' | 'article' | 'profile' | string | null | undefined>;
  siteName?: MaybeRef<string | null | undefined>;
  keywords?: MaybeRef<string | string[] | null | undefined>;
  articleTags?: MaybeRef<string[] | null | undefined>;
  canonical?: MaybeRef<string | null | undefined>;
  extraMeta?: MaybeRef<Array<Record<string, any>> | null | undefined>;
  extraLink?: MaybeRef<Array<Record<string, any>> | null | undefined>;
  jsonLd?: MaybeRef<unknown | unknown[] | null | undefined>;
  breadcrumbs?: MaybeRef<EntrySeoBreadcrumb[] | null | undefined>;
  siteLinks?: MaybeRef<EntrySeoSiteLink[] | null | undefined>;
};

function toArray(val?: string | string[] | null): string[] {
  if (!val) return [];
  return Array.isArray(val)
    ? val
    : String(val)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

function resolveUrl(raw: string | null | undefined, baseUrl: string): string | undefined {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;

  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = raw.startsWith('/') ? raw : `/${raw}`;

  if (!normalizedBase) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function useEntrySeo(opts: EntrySeoOptions = {}) {
  const route = useRoute();
  const config = useRuntimeConfig();

  const baseUrl = config.public?.siteUrl || '';

  const resolvedTitle = computed(() => unref(opts.title) ?? undefined);
  const resolvedDescription = computed(() => unref(opts.description) ?? undefined);
  const resolvedImage = computed(() => {
    const provided = unref(opts.image);
    if (provided) return resolveUrl(provided, baseUrl);
    return baseUrl ? `${baseUrl.replace(/\/$/, '')}/favicon-96x96.png` : undefined;
  });
  const resolvedType = computed(() => unref(opts.type) || 'website');

  const pageUrl = computed(() => {
    const provided = resolveUrl(unref(opts.url), baseUrl);
    if (provided) return provided;
    const trimmedBase = baseUrl.replace(/\/$/, '');
    return trimmedBase ? `${trimmedBase}${route.path || ''}` : route.path || undefined;
  });

  const canonical = computed(() => resolveUrl(unref(opts.canonical), baseUrl) ?? pageUrl.value);
  const siteName = computed(
    () => unref(opts.siteName) || (config.public?.siteName as string) || 'Портал ДПО педагогов Москвы',
  );

  const keywordsList = computed(() => toArray(unref(opts.keywords)).slice(0, 20));
  const keywordsValue = computed(() => (keywordsList.value.length ? keywordsList.value.join(', ') : undefined));

  const articleTags = computed(() => {
    const items = unref(opts.articleTags);
    return Array.isArray(items) ? items.filter(Boolean).slice(0, 20) : [];
  });

  const extraMeta = computed(() => unref(opts.extraMeta) || []);
  const extraLink = computed(() => unref(opts.extraLink) || []);

  const metaTags = computed(() => {
    const tags: Array<Record<string, any>> = [];

    if (keywordsValue.value) {
      tags.push({ name: 'keywords', content: keywordsValue.value });
    }

    if (resolvedTitle.value) {
      tags.push({ property: 'og:title', content: resolvedTitle.value });
      tags.push({ name: 'twitter:title', content: resolvedTitle.value });
    }

    if (resolvedDescription.value) {
      tags.push({ property: 'og:description', content: resolvedDescription.value });
      tags.push({ name: 'twitter:description', content: resolvedDescription.value });
    }

    if (resolvedImage.value) {
      tags.push({ property: 'og:image', content: resolvedImage.value });
      tags.push({ name: 'twitter:image', content: resolvedImage.value });
      tags.push({ name: 'msapplication-TileImage', content: resolvedImage.value });
    }

    if (pageUrl.value) {
      tags.push({ property: 'og:url', content: pageUrl.value });
    }

    if (resolvedType.value) {
      tags.push({ property: 'og:type', content: resolvedType.value });
    }

    if (siteName.value) {
      tags.push({ property: 'og:site_name', content: siteName.value });
    }

    tags.push({ name: 'twitter:card', content: 'summary_large_image' });

    if (articleTags.value.length) {
      articleTags.value.forEach((tag) => {
        tags.push({ property: 'article:tag', content: tag });
      });
    }

    if (extraMeta.value.length) {
      tags.push(...extraMeta.value);
    }

    return tags;
  });

  const linkTags = computed(() => {
    const links: Array<Record<string, any>> = [];

    if (canonical.value) {
      links.push({ rel: 'canonical', href: canonical.value });
    }

    if (extraLink.value.length) {
      links.push(...extraLink.value);
    }

    return links;
  });

  useSeoMeta({
    title: () => resolvedTitle.value || undefined,
    description: () => resolvedDescription.value || undefined,
    keywords: () => keywordsValue.value,
    meta: () => metaTags.value,
    link: () => linkTags.value,
  });

  /** JSON-LD schema.org */
  const breadcrumbsSchema = computed(() => createBreadcrumbsSchema(unref(opts.breadcrumbs), baseUrl));

  const siteLinksSchema = computed(() => {
    const raw = unref(opts.siteLinks) || [];
    if (!raw.length) return null;

    const items = raw
      .map((item) => {
        const name = item?.name?.trim();
        const url = resolveUrl(item?.url, baseUrl);
        if (!name || !url) return null;
        return { name, url };
      })
      .filter(Boolean) as Array<{ name: string; url: string }>;

    if (!items.length) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'SiteNavigationElement',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    };
  });

  const customSchemas = computed(() => {
    const value = unref(opts.jsonLd);
    if (!value) return [];
    return Array.isArray(value) ? value.filter(Boolean) : [value];
  });

  const jsonSchemas = computed(() => {
    const list: Array<{ key: string; schema: unknown }> = [];

    if (breadcrumbsSchema.value) {
      list.push({ key: 'ld-breadcrumbs', schema: breadcrumbsSchema.value });
    }

    if (siteLinksSchema.value) {
      list.push({ key: 'ld-sitelinks', schema: siteLinksSchema.value });
    }

    customSchemas.value.forEach((schema, index) => {
      list.push({ key: `ld-custom-${index}`, schema });
    });

    return list;
  });

  useHead(() => {
    if (!jsonSchemas.value.length) {
      return { script: [] };
    }

    const scripts = jsonSchemas.value.map(({ key, schema }) => ({
      key,
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema, null, 2),
    }));

    const disableSanitizers = scripts.reduce<Record<string, Array<'innerHTML'>>>((acc, script) => {
      if (script.key) {
        acc[script.key] = ['innerHTML'];
      }
      return acc;
    }, {});

    return {
      script: scripts,
      __dangerouslyDisableSanitizersByTagID: disableSanitizers,
    };
  });
}
