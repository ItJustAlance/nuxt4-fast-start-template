import type { TUserData } from '~/types/TAuth';

/**
 * Получить доступ к актуальным сведениям о пользователе
 */
export const useAuthUser = () => {
  return useState<TUserData | null>('user', () => null);
};
