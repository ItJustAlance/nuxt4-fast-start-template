import { fetchPost, fetchGet } from '@/utils/fetchUtils';
import { useAuthStore } from '@/stores/auth';
import { useAuthUser } from './useAuthUser';

export const useAuth = () => {
  const authUser = useAuthUser();
  const authStore = useAuthStore();

  const setUser = (user: any, token?: string) => {
    authUser.value = user ?? null;
    if (token) {
      const tokenCookie = authStore.getTokenCookie();
      tokenCookie.value = token;
    }
  };

  const config = useRuntimeConfig();

  /**
   * Авторизация через логин/пароль
   */
  const login = async (email: string, password: string, rememberMe: boolean) => {
    const config = useRuntimeConfig();
    const res = await fetchPost(config.public.realApiUrl, '/auth', { email, password, rememberMe });
    if (res?.data?.id && res?.data?.token) {
      console.log('запрос авторизации: успех', res);
      setUser(res.data, res.data.token);
    } else {
      console.log('запрос авторизации: провал', res);
    }

    return authUser;
  };

  /**
   * Запрос на выход, отправляет запрос на выход на сервере и удаляют всю информацию из стора на клиенте
   */
  const logout = async () => {
    const config = useRuntimeConfig();

    try {
      await fetchPost(config.public.realApiUrl, '/logout', {});
    } catch (error) {
      console.warn('Logout failed on server (ignored):', error?.message);
      // Не выбрасываем ошибку — UI не ломается
    }

    // Очищаем локальное состояние независимо от результата запроса
    setUser(null);
    const tokenCookie = authStore.getTokenCookie();
    tokenCookie.value = null;
  };

  /**
   * Получает актуальную информацию о себе со стороны сервера (если авторизован)
   *
   * @force принудительно загрузить данные о себе, например, после смены токена на новый (при авторизации через другой сайт)
   */
  const me = async (force: boolean = false) => {
    if (force || !authUser.value) {
      try {
        const tokenCookie = authStore.getTokenCookie();
        if (!tokenCookie.value) {
          setUser(null);
          return authUser;
        }

        const res = await fetchGet(config.public.realApiUrl, '/profile');
        if (res?.data?.id) {
          console.log('me(): успех, данные о пользователе получены');
          setUser(res.data);
          // токен ставить не надо, т.к. он уже записан
        } else {
          console.log('me(): провал, пользователь не авторизован');
          setUser(null);
        }
      } catch (error) {
        console.error('me(): провал, внутренняя ошибка', error);
        setUser(null);
      }
    }
    return authUser;
  };

  return {
    login,
    logout,
    me,
    setUser,
  };
};
