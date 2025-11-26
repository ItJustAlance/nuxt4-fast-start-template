import type { Course } from '~/types/types';

// Fake users data
const courses = [
  {
    id: 1,
    title: 'Основы программирования на Python',
    duration: '40 часов',
    price: '7 500',
    format: 'Онлайн',
    date: '8.11.2023',
    startDate: '15 февраля',
    code: 'PY-101',
    url: 'python-basics',
    isSignUp: false,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Веб-разработка на JavaScript',
    duration: '60 часов',
    price: '9 900',
    format: 'Очно-заочная с ДОТ',
    date: '8.11.2023',
    startDate: '1 марта',
    code: 'JS-202',
    url: 'web-development-js',
    isSignUp: true,
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Администрирование Linux серверов',
    duration: '50 часов',
    price: '11 000',
    format: 'Онлайн',
    date: '8.11.2023',
    startDate: '10 апреля',
    code: 'LNX-303',
    url: 'linux-admin',
    isSignUp: false,
    isFavorite: false,
  },
  {
    id: 4,
    title: 'Основы тестирования ПО',
    duration: '45 часов',
    price: '8 200',
    format: 'Очное',
    date: '8.11.2023',
    startDate: '20 марта',
    code: 'QA-101',
    url: 'qa-basics',
    isSignUp: false,
    isFavorite: true,
  },
  {
    id: 5,
    title: 'Разработка мобильных приложений',
    duration: '55 часов',
    price: '12 500',
    format: 'Онлайн',
    date: '8.11.2023',
    startDate: '5 мая',
    code: 'MOB-404',
    url: 'mobile-development',
    isSignUp: true,
    isFavorite: false,
  },
  {
    id: 6,
    title: 'Графический дизайн с нуля',
    duration: '30 часов',
    price: '6 300',
    format: 'Очно-заочная с ДОТ',
    date: '8.11.2023',
    startDate: '12 июня',
    code: 'DES-505',
    url: 'graphic-design',
    isSignUp: false,
    isFavorite: true,
  },
  {
    id: 7,
    title: 'Основы кибербезопасности',
    duration: '50 часов',
    price: '10 000',
    format: 'Онлайн',
    date: '8.11.2023',
    startDate: '18 июля',
    code: 'CYB-606',
    url: 'cyber-security',
    isSignUp: false,
    isFavorite: false,
  },
  {
    id: 8,
    title: 'Финансовая грамотность',
    duration: '20 часов',
    price: '5 000',
    format: 'Очное',
    date: '8.11.2023',
    startDate: '25 августа',
    code: 'FIN-707',
    url: 'financial-literacy',
    isSignUp: true,
    isFavorite: true,
  },
  {
    id: 9,
    title: 'Machine Learning для начинающих',
    duration: '70 часов',
    price: '15 000',
    format: 'Онлайн',
    date: '8.11.2023',
    startDate: '1 сентября',
    code: 'ML-808',
    url: 'ml-beginners',
    isSignUp: false,
    isFavorite: false,
  },
  {
    id: 10,
    title: '3D-моделирование и анимация',
    duration: '65 часов',
    price: '13 000',
    format: 'Очно-заочная с ДОТ',
    date: '8.11.2023',
    startDate: '10 октября',
    code: '3D-909',
    url: '3d-modeling',
    isSignUp: false,
    isFavorite: true,
  },
  {
    id: 11,
    title: 'SMM и digital-маркетинг',
    duration: '35 часов',
    price: '7 800',
    format: 'Онлайн',
    date: '8.11.2023',
    startDate: '15 ноября',
    code: 'SMM-1010',
    url: 'smm-digital',
    isSignUp: true,
    isFavorite: false,
  },
  {
    id: 12,
    title: 'Основы работы с AI',
    duration: '50 часов',
    price: '9 500',
    format: 'Очное',
    date: '8.11.2023',
    startDate: '20 декабря',
    code: 'AI-1111',
    url: 'ai-basics',
    isSignUp: false,
    isFavorite: false,
  },
];

const coursesFavorite: Course[] = [
  {
    id: 2,
    title: 'Веб-разработка на JavaScript',
    duration: '60 часов',
    price: '9 900',
    format: 'Очно-заочная с ДОТ',
    date: '8.11.2023',
    startDate: '1 марта',
    code: 'JS-202',
    url: 'web-development-js',
    isSignUp: true,
    isFavorite: true,
  },
  {
    id: 4,
    title: 'Основы тестирования ПО',
    duration: '45 часов',
    price: '8 200',
    format: 'Очное',
    date: '8.11.2023',
    startDate: '20 марта',
    code: 'QA-101',
    url: 'qa-basics',
    isSignUp: false,
    isFavorite: true,
  },
  {
    id: 6,
    title: 'Графический дизайн с нуля',
    duration: '30 часов',
    price: '6 300',
    format: 'Очно-заочная с ДОТ',
    date: '8.11.2023',
    startDate: '12 июня',
    code: 'DES-505',
    url: 'graphic-design',
    isSignUp: false,
    isFavorite: true,
  },
  {
    id: 8,
    title: 'Финансовая грамотность',
    duration: '20 часов',
    price: '5 000',
    format: 'Очное',
    date: '8.11.2023',
    startDate: '25 августа',
    code: 'FIN-707',
    url: 'financial-literacy',
    isSignUp: true,
    isFavorite: true,
  },
  {
    id: 10,
    title: '3D-моделирование и анимация',
    duration: '65 часов',
    price: '13 000',
    format: 'Очно-заочная с ДОТ',
    date: '8.11.2023',
    startDate: '10 октября',
    code: '3D-909',
    url: '3d-modeling',
    isSignUp: false,
    isFavorite: true,
  },
];

const coursesIds = [
  {
    id: 1,
    shifr: '04868-22/23-Б-ЗД',
    name: 'Основы программирования на Python',
    date: '2023-08-01',
  },
  {
    id: 2,
    shifr: '04868-23/23-Б-ЗД',
    name: 'Веб-разработка на JavaScript',
    date: '2023-09-01',
  },
  {
    id: 3,
    shifr: '04868-24/23-Б-ЗД',
    name: 'Программирование на Java',
    date: '2023-10-01',
  },
  {
    id: 4,
    shifr: '04868-25/23-Б-ЗД',
    name: 'Основы машинного обучения',
    date: '2023-11-01',
  },
  {
    id: 5,
    shifr: '04868-26/23-Б-ЗД',
    name: 'Data Science и искусственный интеллект',
    date: '2023-12-01',
  },
  {
    id: 6,
    shifr: '04868-27/23-Б-ЗД',
    name: 'Разработка мобильных приложений',
    date: '2024-01-01',
  },
  {
    id: 7,
    shifr: '04868-28/23-Б-ЗД',
    name: 'Основы кибербезопасности',
    date: '2024-02-01',
  },
  {
    id: 8,
    shifr: '04868-29/23-Б-ЗД',
    name: 'Разработка на C++',
    date: '2024-03-01',
  },
  {
    id: 9,
    shifr: '04868-30/23-Б-ЗД',
    name: 'Базы данных и SQL',
    date: '2024-04-01',
  },
  {
    id: 10,
    shifr: '04868-31/23-Б-ЗД',
    name: 'Моделирование и алгоритмы',
    date: '2024-05-01',
  },
  {
    id: 11,
    shifr: '04868-32/23-Б-ЗД',
    name: 'Основы разработки игр',
    date: '2024-06-01',
  },
  {
    id: 12,
    shifr: '04868-33/23-Б-ЗД',
    name: 'Введение в нейронные сети',
    date: '2024-07-01',
  },
];

const courseReviews = [
  {
    id: 1,
    rating: 5,
    text: 'Отличный курс! Много полезной информации и удобная подача материала.',
    userName: 'Иванов А.С.',
    userPosition: 'Методист ГАОУ ДПО',
    avatar: '/img/ava.png',
  },
  {
    id: 2,
    rating: 4,
    text: 'Хорошо структурировано, но хотелось бы больше практических заданий.',
    userName: 'Петрова Е.В.',
    userPosition: 'Учитель физкультуры, Школа №12',
    avatar: '/img/ava.png',
  },
  {
    id: 3,
    rating: 3,
    text: 'Информация полезная, но местами скучновато. Ожидал большего.',
    userName: 'Кузнецов Д.М.',
    userPosition: 'Тренер спортивной секции',
    avatar: '/img/ava.png',
  },
  {
    id: 4,
    rating: 5,
    text: 'Очень понравилось! Всё чётко, по делу, без "воды". Рекомендую!',
    userName: 'Алексеева Л.Н.',
    userPosition: 'Зам. директора по воспитательной работе',
    avatar: '/img/ava.png',
  },
  {
    id: 5,
    rating: 4,
    text: 'Интересный курс, но в некоторых темах не хватило примеров из практики.',
    userName: 'Морозов И.И.',
    userPosition: 'Преподаватель колледжа',
    avatar: '/img/ava.png',
  },
  {
    id: 6,
    rating: 2,
    text: 'Слишком много теории, мало интерактива. Тяжело удерживать внимание.',
    userName: 'Сидорова М.А.',
    userPosition: 'Учитель начальных классов',
    avatar: '/img/ava.png',
  },
  {
    id: 7,
    rating: 5,
    text: 'Прекрасная подача материала! Узнал много нового, что применю на практике.',
    userName: 'Григорьев С.П.',
    userPosition: 'Инструктор по физподготовке',
    avatar: '/img/ava.png',
  },
  {
    id: 8,
    rating: 4,
    text: 'Курс полезный, но временами были технические проблемы с видео.',
    userName: 'Егорова Т.И.',
    userPosition: 'Куратор образовательной программы',
    avatar: '/img/ava.png',
  },
  {
    id: 9,
    rating: 3,
    text: 'Ожидала большего. Не все темы раскрыты достаточно глубоко.',
    userName: 'Фролов А.Н.',
    userPosition: 'Методист МЦКО',
    avatar: '/img/ava.png',
  },
  {
    id: 10,
    rating: 5,
    text: 'Замечательный курс! Отлично подошёл для подготовки к учебному году.',
    userName: 'Никитина К.О.',
    userPosition: 'Педагог допобразования',
    avatar: '/img/ava.png',
  },
  {
    id: 11,
    rating: 4,
    text: 'Все понравилось, но желательно больше обратной связи от преподавателей.',
    userName: 'Зайцев Р.Б.',
    userPosition: 'Специалист отдела образования',
    avatar: '/img/ava.png',
  },
  {
    id: 12,
    rating: 3,
    text: 'Темы интересные, но подача немного сухая. Не хватило примеров.',
    userName: 'Белова И.Г.',
    userPosition: 'Учитель биологии',
    avatar: '/img/ava.png',
  },
  {
    id: 13,
    rating: 5,
    text: 'Один из лучших курсов на платформе. Всё чётко, доступно и интересно.',
    userName: 'Дмитриев П.А.',
    userPosition: 'Куратор практик',
    avatar: '/img/ava.png',
  },
  {
    id: 14,
    rating: 4,
    text: 'Хорошо, но не хватило дополнительных материалов для скачивания.',
    userName: 'Орлова Е.Р.',
    userPosition: 'Преподаватель института',
    avatar: '/img/ava.png',
  },
  {
    id: 15,
    rating: 2,
    text: 'Не оправдал ожиданий. Много повторов, мало конкретики.',
    userName: 'Семенов Ю.В.',
    userPosition: 'Преподаватель физической культуры',
    avatar: '/img/ava.png',
  },
];

export function getCourses(page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCourses = courses.slice(startIndex, endIndex);

  return {
    data: paginatedCourses,
    total: courses.length,
  };
}

export function getCoursesFavorite(page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  // const paginatedCourses = coursesFavorite.slice(startIndex, endIndex);
  const paginatedCourses = [];

  return {
    data: paginatedCourses,
    total: 0, // coursesFavorite.length,
  };
}

export function getCoursesIds(page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCourses = coursesIds.slice(startIndex, endIndex);

  return {
    data: paginatedCourses,
    total: coursesIds.length,
  };
}
export function getCourseReviews(page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCourses = courseReviews.slice(startIndex, endIndex);

  return {
    data: paginatedCourses,
    total: courseReviews.length,
  };
}
