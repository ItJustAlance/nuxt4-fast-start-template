import { getCourses } from '#server/models/courses';

export default defineEventHandler(async (event) => {
  const query = getQuery(event); // Получаем query параметры для GET запроса
  console.log('getCourses query', query);
  const page = query.page ? parseInt(query.page as string) : 1;
  const limit = query.limit ? parseInt(query.limit as string) : 100;
  const perPage = query.perPage ? parseInt(query.perPage as string) : limit;

  const { data, total } = getCourses(page, perPage);

  return {
    data,
    total,  // общее количество курсов
    page,   // текущая страница
    perPage,  // количество на странице
    status: 'success',
  };
});
