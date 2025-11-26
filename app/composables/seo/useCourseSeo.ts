import { computed, type Ref } from 'vue';
import { useRoute, useRuntimeConfig } from 'nuxt/app';
import appUtils from '~/utils/appUtils';
import type { TCourseItem } from '~/types/public/TCourse';
import { useEntrySeo, type EntrySeoBreadcrumb } from '~/composables/seo/useEntrySeo';

type MaybeRef<T> = T | Ref<T>;

type UseCourseSeoOptions = {
  breadcrumbs?: MaybeRef<EntrySeoBreadcrumb[] | null | undefined>;
};

export function useCourseSeo(courseItem: Ref<TCourseItem | null | undefined>, options: UseCourseSeoOptions = {}) {
  const config = useRuntimeConfig();
  const route = useRoute();

  const courseName = computed(() => courseItem.value?.name?.trim() ?? '');
  const courseShort = computed(() => {
    const s = appUtils.decodeAndSanitizeHtml(courseItem.value?.annotation) || '';
    return s && s.length > 200 ? `${s.slice(0, 195).trim()}...` : s || '';
  });
  const courseImage = computed(() => {
    return (
      courseItem.value?.cover ||
      courseItem.value?.image ||
      `${config.public.siteUrl || ''}/img/study-directions/0-neutral.svg`
    );
  });
  const pageUrl = computed(() => {
    const base = String(config.public.siteUrl || '').replace(/\/$/, '');
    return base + (route.path || '');
  });

  const seoTitle = computed(() =>
    courseName.value
      ? `Курс «${courseName.value}» — Повышение квалификации педагогов Москвы`
      : 'Курсы — Повышение квалификации педагогов Москвы',
  );
  const seoDescription = computed(
    () =>
      courseShort.value ||
      'Выберите курс дополнительного профессионального образования для педагогов. Повышение квалификации, переподготовка, актуальные программы по ФГОС.',
  );

  const seoKeywordsArray = computed(() => {
    const kws = new Set<string>();
    ['курсы', 'повышение квалификации', 'переподготовка', 'ДПО', 'педагоги'].forEach((k) => kws.add(k));
    if (courseName.value)
      courseName.value
        .split(/\s+/)
        .slice(0, 8)
        .forEach((w) => kws.add(w.replace(/[^\wа-яёА-ЯЁ\-]/g, '')));
    const directions = courseItem.value?.studyDirections?.map((d: any) => d.name).filter(Boolean) ?? [];
    directions.slice(0, 5).forEach((d: string) => kws.add(d));
    if (courseItem.value?.organization?.name) kws.add(courseItem.value.organization.name);
    return Array.from(kws).filter(Boolean).slice(0, 20);
  });

  useEntrySeo({
    title: seoTitle,
    description: seoDescription,
    image: courseImage,
    url: pageUrl,
    type: 'article',
    keywords: computed(() => seoKeywordsArray.value),
    articleTags: computed(() => seoKeywordsArray.value),
    breadcrumbs: options.breadcrumbs,
  });
}
