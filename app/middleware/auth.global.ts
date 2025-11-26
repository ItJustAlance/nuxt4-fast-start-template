import { useAuthUser } from '@/composables/useAuthUser';

export default defineNuxtRouteMiddleware((to) => {
  // глобальная проверка доступа к страницам:
  // - по умолчанию доступны все страницы, кроме ЛК
  // - для разработки можно открыть через доп параметр ?auth=false
  // - для постоянных публичных страниц можно задать через definePageMeta и auth: false

  // разделы ЛК
  const RESTRICTED_LK = new Set(['lk', 'lk-provide', 'lk-accountant', 'lk-okt']);
  // отдельные страницы
  const RESTRICTED_PAGES = new Set(['/menu']);
  // отдельные страницы только для админа
  const ADMIN_PAGES = new Set(['/menu']);

  // доступ только для разных ЛК
  const layout = to?.meta?.layout || 'default';
  let needAuth = RESTRICTED_LK.has(layout) || RESTRICTED_PAGES.has(to.path);
  if (!needAuth) {
    return;
  }

  // отключаем доступ из ЛК для спец страниц или отладки
  needAuth = to.meta?.auth ?? !(to.query.auth === 'false');
  if (!needAuth) {
    return;
  }

  const currentUser = useAuthUser();
  if (!currentUser.value) {
    const loginUrl = `/login?redirect=${encodeURIComponent(to.fullPath)}`;
    return navigateTo(loginUrl, {
      replace: true,
    });
  }

  const roles: string[] = currentUser.value?.roles ?? [];
  // TODO: сюда можно добавить детальную проверку доступа на роли
  //  например, чтобы зная ссылку на кабинет директора, нельзя было его открыть на фронте
  //  внимание, это только для удобства - реальный доступ должен проверяться для конкретных апи на бекенде

  // доступ к админским страницам только для админов
  const isAdmin = currentUser.value?.roles?.some((role) => ['admin', 'superadmin'].includes(role));
  if (ADMIN_PAGES.has(to.path) && !isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен',
      fatal: true,
    });
  }
  // доступ к layout maneg-okt: admin/superadmin или maneg-okt
  if (layout === 'lk-okt' && !(isAdmin || roles.includes('octahedron_manager'))) {
    throw createError({ statusCode: 403, statusMessage: 'Нет прав на раздел «Октаэдр-менеджер»', fatal: true });
  }
});
