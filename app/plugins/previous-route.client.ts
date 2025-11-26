/**
 * Плагин для отслеживания и сохранения предыдущего маршрута в приложении.
 * Использует useState для хранения предыдущего пути в памяти приложения
 * и sessionStorage для хранения между перезагрузками страницы.
 * При переходе между маршрутами, сохраняет предыдущий путь,
 * если маршрут действительно изменился и имеет корректное имя.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const previous = useState<string | null>('previous-route', () => null);
  const STORAGE_KEY = 'prev:path';

  if (import.meta.client) {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) previous.value = saved;
  }

  nuxtApp.$router.afterEach((to, from) => {
    if (to.fullPath !== from.fullPath && from.name) {
      previous.value = from.fullPath;
      if (import.meta.client) sessionStorage.setItem(STORAGE_KEY, from.fullPath);
    }
  });
});
