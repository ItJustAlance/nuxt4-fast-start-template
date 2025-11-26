import { getCourses } from '#server/models/courses';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Получаем тело запроса
  console.log('getCourses body', body)
  const page = body.page ? parseInt(body.page) : 1;
  const perPage = body.perPage ? parseInt(body.perPage) : 5;

  const { data, total } = getCourses(page, perPage);

  return {
    data,
    total,  // общее количество курсов
    page,   // текущая страница
    perPage,  // количество на странице
    status: 'success',
  };
});
