import { defineStore } from 'pinia';
import type { UnwrapNestedRefs } from 'vue';
import type { TUserData } from '@/types/TAuth';
import { useOctahedron } from '@/composables/useOctahedron';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    idUser: null as number | null,
    authenticated: false,
    loading: false,
    userData: null as TUserData | null,
  }),
  actions: {
    /**
     * Доступ к токену
     */
    getTokenCookie() {
      return useCookie('token', {
        maxAge: 60 * 60 * 24 * 7, // 1 неделя
        secure: true,
        sameSite: 'lax', // lax - при переходе с внешних сайтов типа банка авторизация сохранится, strict - без куки первый запрос будет
      });
    },

    /**
     * Авторизация пользователя на сайте
     */
    async authenticateUser(
      payload: UnwrapNestedRefs<{
        data: { email: string; password: string; rememberMe: boolean };
        pending: boolean;
        error: string;
      }> & {},
    ) {
      // авторизует пользователя и переключается на него
      const { login } = useAuth();
      const tokenCookie = this.getTokenCookie();
      console.log('авторизация: попытка входа', payload);
      const result: any = await login(payload.data.email, payload.data.password, payload.data.rememberMe);
      if (result.value?.token) {
        console.log('авторизация: успех', result.value);

        // TODO: сделать код общим
        tokenCookie.value = result.value.token;
        this.authenticated = true;
        this.userData = result.value as TUserData;
        this.idUser = result.value.id;
        return true;
      } else {
        console.log('авторизация: провал', result.value);
        return false;
      }
    },

    /**
     * Авторизация через токен, например, полученный от входа на dpomos
     * Внимание, токен должен быть валидным
     */
    async authenticateUserByNewToken(newToken: string) {
      const { logout, me } = useAuth();
      const tokenCookie = this.getTokenCookie();

      // убираем старый вход и ставим новый
      await logout();
      tokenCookie.value = newToken;
      await nextTick(); // синхронизировать клиент и сервер для новых кук

      // проверяем данные через me()
      // если успешно, то они уже выставятся в me
      const currentUser = await me(true);
      if (currentUser.value) {
        this.authenticated = true;
        this.userData = currentUser.value as TUserData;
        this.idUser = this.userData.id;
        console.log('авторизация по токену: успех');
        return true;
      } else {
        console.warn('авторизация по токену: провал');
        this.clearAuth();
        return false;
      }
    },

    /**
     * Очистка авторизации
     */
    clearAuth() {
      const tokenCookie = this.getTokenCookie();
      tokenCookie.value = null;
      this.authenticated = false;
      this.userData = null;
      this.idUser = null;
      this.$reset(); // сброс состояние стора (всех пользовательских данных)
    },
  },

  getters: {
    // Геттер для проверки авторизации и нахождения на странице профиля
    isVisibleInProfile() {
      const currentUser = useAuthUser();
      return !!currentUser;
    },

    /**
     * Есть ли доступ к функциям директора
     */
    hasRoleDirector() {
      // внимание, это только фронт, все ограничения должны дублироваться на апи бекенда тоже
      const currentUser = useAuthUser();
      return currentUser.value?.roles?.some((role) => ['admin', 'superadmin', 'director'].includes(role));
    },

    /**
     * Название роли для ЛК, временное решение
     * TODO: сделать в бекенде поле, где писать ручками название роли (альтернатива заметкам, только публичное)
     */
    getRoleDescription() {
      const currentUser = useAuthUser();
      let name;
      if (currentUser.value?.roles?.some((role) => ['admin', 'superadmin'].includes(role))) {
        name = 'Администратор';
      } else if (currentUser.value?.roles?.some((role) => ['director'].includes(role))) {
        name = 'Директор';
      } else if (currentUser.value?.roles?.some((role) => ['supplier'].includes(role))) {
        name = 'Поставщик';
      } else if (currentUser.value?.roles?.some((role) => ['accountant'].includes(role))) {
        name = 'Бухгалтер';
      } else if (currentUser.value?.roles?.some((role) => ['expert'].includes(role))) {
        name = 'Эксперт';
      } else if (currentUser.value?.roles?.some((role) => ['octahedron_manager'].includes(role))) {
        name = 'Октаэдр-менеджер';
      } else {
        name = 'Слушатель';
      }
      return name;
    },

    /**
     * Доступ к личному кабинету и его разделу в зависимости от ролей пользователя,
     * Вручную можно включать отключать пункты меню
     *
     * item.isHidden - можно скрыть незавершенный раздел из публичного доступа (будет виден только для админов)
     */
    getPersonalMenu() {
      // внимание, это только фронт, все ограничения должны дублироваться на апи бекенда тоже
      const currentUser = useAuthUser();
      const menu = [];

      const isAdmin = currentUser.value?.roles?.some((role) => ['admin', 'superadmin'].includes(role));

      const orgDirId = (currentUser.value as any)?.orgDirId ?? null;
      const { items: octaItems, isLoading: octIsLoading, loadOctahedron } = useOctahedron();
      let hasOctaForOrg = false;
      if (orgDirId) {
        if (process.client && !octaItems.value.length && !octIsLoading.value) {
          loadOctahedron();
        }
        hasOctaForOrg = octaItems.value.some((it) => Number(it.organization?.id) === Number(orgDirId));
      }

      // кабинет слушателя
      if (isAdmin || currentUser.value?.roles?.some((role) => ['user'].includes(role))) {
        menu.push({
          groupCode: 'lkUser',
          groupTitle: 'Кабинет слушателя',
          defaultLink: '/personal/profile',
          items: [
            {
              id: 10,
              enabled: false,
              name: 'lkUserProfile',
              title: 'Персональные данные',
              iconName: 'books',
              link: '/personal/profile',
            },
            {
              id: 20,
              enabled: true,
              name: 'lkUserCourses',
              title: 'Мои курсы',
              iconName: 'books',
              link: '/personal/courses',
            },
            {
              id: 30,
              enabled: true,
              name: 'lkUserEduDocs',
              title: 'Зачетная книжка',
              iconName: 'books',
              link: '/personal/eduDocs',
            },
            {
              id: 40,
              enabled: false,
              name: 'lkUserDocs',
              title: 'Мои документы',
              iconName: 'link',
              link: '/redirectToDpo1?target=lk-personal-docs',
            }, // дпо 1
            // { id: 41, name: 'events2', title: 'Мои мероприятия', iconName: 'calendar', link: '' }, // дпо 2
            {
              id: 42,
              enabled: false,
              name: 'lkUserEvents',
              title: 'Мои мероприятия',
              iconName: 'link',
              link: '/redirectToDpo1?target=lk-events',
            }, // дпо 1
            {
              id: 50,
              enabled: false,
              name: 'lkUserCompetitions',
              title: 'Мои конкурсы',
              iconName: 'link',
              link: '/redirectToDpo1?target=lk-competitions',
            }, // дпо 1
            {
              id: 60,
              enabled: false,
              name: 'lkUserAttestation',
              title: 'Заявки на аттестацию руководящих кадров',
              iconName: 'link',
              link: '/redirectToDpo1?target=lk-attestation',
            }, // дпо 1
            {
              id: 70,
              enabled: false,
              name: 'lkUserKreserve',
              title: 'Конкурсный отбор в кадровый резерв',
              iconName: 'link',
              link: '/redirectToDpo1?target=lk-kreserve',
            }, // дпо 1
          ],
        });
      }

      // кабинет поставщика услуг
      if (isAdmin || currentUser.value?.roles?.some((role) => ['supplier'].includes(role))) {
        menu.push({
          groupCode: 'lkProvide',
          groupTitle: 'Кабинет поставщика',
          defaultLink: '/provide',
          items: [
            { id: 4, enabled: false, title: 'Профиль организации', iconName: 'briefcase', link: '/provide' },
            {
              id: 5,
              enabled: false,
              title: 'Статистика организации',
              iconName: 'chart-bar',
              link: '/provide/courseEdit/34',
            },
            { id: 6, enabled: true, title: 'Курсы', iconName: 'books', link: '/provide/courses' },
            { id: 7, enabled: false, title: 'Программы', iconName: 'file', link: '/provide/programm' },
            { id: 8, enabled: false, title: 'Группы', iconName: 'users-four', link: '' },
          ],
        });
      }

      // кабинет бухгалтера
      if (isAdmin || currentUser.value?.roles?.some((role) => ['accountant'].includes(role))) {
        menu.push({
          groupCode: 'lkAccountant',
          groupTitle: 'Кабинет бухгалтера',
          defaultLink: '/accountant',
          items: [
            { id: 9, enabled: false, title: 'Профиль бухгалтера', iconName: 'briefcase', link: '/accountant' },
            { id: 10, enabled: false, title: 'Договоры', iconName: 'contract', link: '/accountant/contract' },
            { id: 11, enabled: false, title: 'Группы', iconName: 'users-four', link: '/provide/groups' },
            {
              id: 12,
              enabled: false,
              title: 'Импорт платежей',
              iconName: 'wallet',
              link: '/accountant/importPayments',
            },
          ],
        });
      }

      // кабинет директора
      const isRealDirector = currentUser.value?.organization?.headId === currentUser.value?.id;
      const isDirectorOcta = hasOctaForOrg;

      if (isAdmin || (isRealDirector && currentUser.value?.roles?.some((role) => ['director'].includes(role)))) {
        menu.push({
          groupCode: 'lkDirector',
          groupTitle: 'Кабинет директора',
          defaultLink: '/director/employees',
          items: [
            { id: 13, enabled: true, title: 'Сотрудники', iconName: 'briefcase', link: '/director/employees' },
            {
              id: 14,
              enabled: true,
              title: 'Согласование заявок',
              iconName: 'contract',
              link: '/director/educations',
            },
            {
              id: 15,
              enabled: true,
              title: 'Назначения',
              iconName: 'contract',
              link: '/director/appointments',
              isHidden: true,
            },
            {
              id: 16,
              enabled: true,
              title: 'Управленческий октаэдр',
              iconName: 'contract',
              link: '/director/octahedron',
              isHidden: !isDirectorOcta,
            },
          ],
        });
      }

      // кабинет эксперта
      if (isAdmin || currentUser.value?.roles?.some((role) => ['expert'].includes(role))) {
        menu.push({
          groupCode: 'lkExpert',
          groupTitle: 'Кабинет эксперта',
          defaultLink: '/expert',
          items: [
            { id: 17, enabled: false, title: 'Управление программами', iconName: 'briefcase', link: '/expert' },
            { id: 18, enabled: false, title: 'Организации', iconName: 'contract', link: '/expert/organizations' },
          ],
        });
      }
      // Октаэдр-менеджер
      if (isAdmin || currentUser.value?.roles?.some((role) => ['octahedron_manager'].includes(role))) {
        menu.push({
          groupCode: 'lkOkt',
          groupTitle: 'Октаэдр-менеджер',
          defaultLink: '/octahedron',
          items: [
            { id: 19, enabled: false, title: 'Управление октаэдрами', iconName: 'briefcase', link: '/octahedron' },
          ],
        });
      }

      // разные функции, общие для всех
      if (currentUser.value) {
        // с авторизацией
        menu.push({
          groupCode: 'lkOther',
          groupTitle: 'Другое',
          defaultLink: '',
          items: [
            {
              id: 1,
              enabled: true,
              title: 'Перейти на dpomos.ru',
              iconName: 'link',
              link: '/redirectToDpo1?target=lk',
            },
          ],
        });
      } else {
        // без авторизации
        menu.push({
          groupCode: 'lkOther',
          groupTitle: 'Нет доступа',
          defaultLink: '',
          items: [{ id: 1, enabled: true, title: 'Войти в личный кабинет', iconName: '', link: '/login' }],
        });
      }

      // финальный фильтр, чтобы скрыть временно недоступные меню
      if (!isAdmin) {
        menu.forEach((menuGroup) => {
          if (menuGroup.items && menuGroup.items.length > 0) {
            menuGroup.items = menuGroup.items.filter((item) => !item.isHidden);
          }
        });
      }

      return menu;
    },
  },
});
