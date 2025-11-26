// import router from '@//router';
// import { useNuxtApp } from '#app';
// import router from "#app";

export const generateErrors = (error, page = '') => {
  const {
    response: {
      data: { errors, id },
      status,
    },
  } = error;
  let lastError = {};
  if (errors) {
    lastError = errors[errors.length - 1];
  }

  if (status === 502 || status === 504) {
    throw new Error('Время ожидания истекло. Попробуйте позже.');
  }

  if (status === 500) {
    throw new Error('Внутренняя ошибка сервера. Попробуйте позже.');
  }

  /** только для формы Логина */
  if (page === 'login' && (status === 404 || status === 401) && lastError.title) {
    if (lastError.title) {
      if (lastError.title === 'Пароль просрочен.') {
        router.push({ name: 'passwordChange' }).catch(() => {});
        return;
      } else {
        throw new Error('Неверный логин или пароль.');
      }
    } else {
      throw new Error(`В настоящее время сервис недоступен.<br/>Ведутся работы по исправлению.`);
    }
  }
  if (status === 404) {
    router.push({ name: 'notFound' }).catch(() => {});
    return;
  }
  if (status === 401) {
    throw new Error('');
  }
  if (status === 400) {
    throw new Error(lastError.title);
  }

  const fieldName = lastError.meta.propertyPath ? `Поле ${lastError.meta.propertyPath}` : '';
  const errorMessage = `${fieldName} ${lastError.title} ${lastError.detail} Код ошибки: ${id}`;
  throw new Error(errorMessage);
};

export const searchFirstRoute = (routes, userPermissionsObject) => {
  let result;
  for (const route of routes) {
    const { permissionAccess, isMain } = route.meta || {};
    if (
      isMain &&
      (!permissionAccess || !permissionAccess.length || permissionAccess.some((p) => userPermissionsObject[p]))
    ) {
      return route;
    }
    if (route.children && route.children.length) {
      result = searchFirstRoute(route.children, userPermissionsObject);
      if (result) return result;
    }
  }
  return result;
};

/**
 * Безопасно вызывает ym или инжект $ym.
 * goalOrArgs может быть строкой (goal) или массивом аргументов для ym(...)
 * Примеры:
 *  reachGoal('my_goal')
 *  reachGoal(['reachGoal', 'my_goal', { foo: 1 }])
 *  список целей:
 *  reachGoal, unic-curse - уникальная цель записи на курс
 */
export function reachGoal(goalOrArgs, params = {}) {
  try {
    const runtime = typeof useRuntimeConfig === 'function' ? useRuntimeConfig() : { public: {} };
    const ymId = runtime?.public?.ymId;

    // Проверяем наличие Yandex.Metrika
    const ym = typeof window !== 'undefined' && typeof window.ym === 'function' ? window.ym : null;

    if (!ym || !ymId) {
      console.warn('Yandex.Metrika is not available — goal skipped', goalOrArgs);
      return;
    }

    // Если аргументы переданы в виде массива, просто разворачиваем
    if (Array.isArray(goalOrArgs)) {
      // Пример: ['reachGoal', 'unic-curse', { courseId: 123 }]
      return ym(ymId, ...goalOrArgs);
    }

    // Иначе — обычный вариант: reachGoal('unic-curse', { courseId: 123 })
    return ym(ymId, 'reachGoal', goalOrArgs, params || {});
  } catch (e) {
    console.error('reachGoal error', e);
  }
}
