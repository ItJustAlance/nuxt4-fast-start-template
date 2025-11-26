import { ref } from 'vue';

/**
 * Простая заглушка для работы с заявками на курсы.
 * В реальном проекте вы можете заменить её на настоящую реализацию с запросами к API.
 */
export interface ApplicationItem {
  id: number;
  courseId?: number | null;
}

const applications = ref<ApplicationItem[]>([]);

export const useMyApplications = () => {
  /**
   * Загрузка заявок (заглушка)
   */
  const applicationLoadData = async (_force: boolean = false) => {
    // здесь можно подключить реальный API
    return applications.value;
  };

  /**
   * Найти заявку по id курса
   */
  const applicationFindByCourseId = (courseId?: number | null) => {
    if (!courseId) return null;
    return applications.value.find((item) => item.courseId === courseId) ?? null;
  };

  /**
   * Отправить заявку (заглушка)
   */
  const applicationSendApply = (courseId?: number | null) => {
    if (!courseId) return;
    if (!applications.value.find((item) => item.courseId === courseId)) {
      applications.value.push({
        id: Date.now(),
        courseId,
      });
    }
  };

  /**
   * Отменить заявку (заглушка)
   */
  const applicationSendCancel = (courseId?: number | null) => {
    if (!courseId) return;
    applications.value = applications.value.filter((item) => item.courseId !== courseId);
  };

  return {
    applications,
    applicationLoadData,
    applicationSendApply,
    applicationSendCancel,
    applicationFindByCourseId,
  };
};


