/**
 * Управление навигацией на предыдущий маршрут.
 * Предоставляет функционал для хранения и навигации на предыдущий маршрут с резервным путем.
 * @returns {Object} Объект, содержащий:
 * - previousRoute: Ref<string | null> - Переменная состояния, хранящая путь предыдущего маршрута,
 * — back: (fallback?: string) => Promise<void> - Функция для навигации на предыдущий маршрут или резервный путь
 */
export function usePreviousRoute() {
  const previousRoute = useState<string | null>('previous-route', () => null);
  const router = useRouter();

  function back(fallback = '/') {
    if (previousRoute.value) return router.push(previousRoute.value);
    return router.push(fallback);
  }

  return { previousRoute, back };
}
