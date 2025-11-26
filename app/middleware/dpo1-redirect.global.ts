/**
 * Автоматическое открытие внешних страниц ДПО 1
 *
 * Если пользователь на фронте переходит по пути /redirectToDpo1 - у него вместо перехода
 * откроется новая страница в браузере. Можно указать, на какой именно раздел перейти.
 *
 * Примеры:
 * - /redirectToDpo1 - откроется главная страница дпомос
 * - /redirectToDpo1?target=lk-personal-docs - откроется страница личного кабинета - мои документы
 */
const targets = [
  { key: null, url: 'https://www.dpomos.ru', comment: 'главная' },
  { key: 'lk', url: 'https://www.dpomos.ru/cabinet', comment: 'лк - главная' },
  { key: 'lk-events', url: 'https://www.dpomos.ru/calendar/my/', comment: 'лк - мои мероприятия' },
  {
    key: 'lk-personal-docs',
    url: 'https://www.dpomos.ru/cabinet/trainee/my-documents.php',
    comment: 'лк - мои документы',
  },
  {
    key: 'lk-competitions',
    url: 'https://www.dpomos.ru/cabinet/trainee/my-competitions.php',
    comment: 'лк - мои соревнования',
  },
  {
    key: 'lk-attestation',
    url: 'https://www.dpomos.ru/attestation/member.php',
    comment: 'лк - заявки на аттестацию руководящих кадров',
  },
  {
    key: 'lk-kreserve',
    url: 'https://www.dpomos.ru/kreserve/member.php',
    comment: 'лк - конкурсный отбор в кадровый резерв',
  },
];

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/redirectToDpo1') {
    const target = targets.find((t) => t.key === (to.query.target || null));
    const url = target?.url || null;
    if (url == null) {
      return;
    }

    if (import.meta.client) {
      window.open(url, '_blank');
      return abortNavigation();
    } else {
      return navigateTo(url, { external: true, redirectCode: 302 });
    }
  }
});
