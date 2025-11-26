<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useThemeStore } from '~/stores/theme';
import { useAuthStore } from '~/stores/auth';
import { useAuthUser } from '~/composables/useAuthUser';
import { fetchGet } from '@/utils/fetchUtils';
import appUtils from '~/utils/appUtils';
import SimpleSearchBox from '~/components/search/SimpleSearchBox.vue';
import OnLazyVisible from '@/components/ui/OnLazyVisible.vue';
import type { TCourseItem } from '@/types/public/TCourse';

const seoTitle = shallowRef(
  'Тестовый заголвок',
);
useSeoMeta({
  title: seoTitle,
  description: () =>
    'Тестовый description',
});

useHead({
  bodyAttrs: {
    class: `page-main`,
  },
});

const authStore = useAuthStore();
const authUser = useAuthUser();
const themeStore = useThemeStore();
const { themeDir } = storeToRefs(themeStore);

const sliderMain = reactive({
  data: [
    { id: 1, image: '/img/banners/main-45-25.png', target: '_blank', href: 'https://may9.ru/' },
    { id: 2, image: '/img/red/news-banner.png', target: '_blank', href: 'https://br.corp-univer.ru/' },
  ],
});

// TODO: динамически получать топ направлений из базы
const topStudyDirections = reactive([
  { id: '38', name: 'Дополнительное образование и внеурочная деятельность детей', stats: 92 },
  { id: '28', name: 'Предметное обучение', stats: 64 },
  { id: '15', name: 'Совершенствование педагогического мастерства', stats: 117 },
  { id: '37', name: 'Образовательные технологии', stats: 60 },
  { id: '6', name: 'Воспитательная работа', stats: 60 },
  { id: '36', name: 'Дошкольное образование', stats: 59 },
  { id: '12', name: 'Методическая работа', stats: 55 },
  // {"id": "20", "name": "Психолого-педагогическая поддержка образовательного процесса", "stats": 39},
  // {"id": "33", "name": "Коммуникация", "stats": 38},
  // {"id": "22", "name": "Работа с обучающимися с ОВЗ", "stats": 34},
]);

const orgCards = ref([
  {
    id: 118,
    name: 'ГАОУ ДПО «Корпоративный университет»',
    img: '/img/organisation/org-korp.svg',
    link: '/courses?organizationIds=1,118',
  },
  {
    id: 105,
    name: 'АНО «Институт прикладного анализа поведения и психолого-социальных технологий»',
    img: '/img/organisation/org-ipap.png',
    link: '/courses?organizationIds=105',
  },
  {
    id: 6,
    name: 'АО «Издательство «Просвещение»',
    img: '/img/organisation/org-prosveshenie.png',
    link: '/courses?organizationIds=6',
  },
  {
    id: 3,
    name: 'ГАОУ ВО «Московский городской педагогический университет»',
    img: '/img/organisation/org-mgpu.svg',
    link: '/courses?organizationIds=3',
  },
  {
    id: 204,
    name: 'ГБОУ ДПО «Московский центр воспитательных практик»',
    img: '/img/organisation/org-mcvp.svg',
    link: '/courses?organizationIds=204',
  },
  {
    id: 25,
    name: 'НОУ ДПО «Институт новых технологий»',
    img: '/img/organisation/org-new-tech.png',
    link: '/courses?organizationIds=25',
  },
  {
    id: 168,
    name: 'ООО «ДОП ЛИГА»',
    img: '/img/organisation/org-dop-liga.png',
    link: '/courses?organizationIds=168',
  },
  {
    id: 31,
    name: 'ФГАОУ ВО «НИТУ «МИСиС»',
    img: '/img/organisation/org-misis.png',
    link: '/courses?organizationIds=31',
  },
  {
    id: 48,
    name: 'ФГБОУ ВО «МПГУ»',
    img: '/img/organisation/org-mpgu.webp',
    link: '/courses?organizationIds=48',
  },
]);

const responsiveOptions = ref([
  { breakpoint: '1400px', numVisible: 5, numScroll: 1 },
  { breakpoint: '1199px', numVisible: 4, numScroll: 1 },
  { breakpoint: '767px', numVisible: 3, numScroll: 1 },
  { breakpoint: '575px', numVisible: 2, numScroll: 1 },
]);

const totalSlides = computed(() => sliderMain.data?.length || 0);
const currentSlide = ref(1);

function onCurrentSlide(event) {
  currentSlide.value = +event + 1;
}

const searchRun = () => {
  if (filterQuery.value === '') {
    return;
  }
  navigateTo({
    path: '/courses',
    query: {
      query: filterQuery.value,
    },
  });
};

// поиск
const filterQuery = ref('');

/** самые популярные курсы **/

// const popularCourses = ref([]);

// загрузка курсов
const {
  data: popularCourses,
  pending: courseItemPending,
  error: courseItemError,
} = await useAsyncData('main-course-list', async () => {
  const config = useRuntimeConfig();
  const params = {
    page: 1,
    perPage: 6,
    sortBy: 'sort',
    sortOrder: 'desc',
  };
  const paramsQuery = appUtils.prepareUrlQueryPath(params);
  const response = await fetchGet<any>(config.public.realApiUrl, `/courses?${paramsQuery}`, {});

  if (!response || !response.data) {
    // корректно пробрасываем 404 чтобы Nuxt отработал
    throw createError({
      statusCode: 404,
      statusMessage: 'Курс не найден',
      fatal: true,
    });
  }

  return response.data.items as TCourseItem[];
});

// const fetchPopularCourses = async () => {
//   try {
//     const params = {
//       page: 1,
//       perPage: 6,
//       sortBy: 'sort',
//       sortOrder: 'desc',
//     };
//
//     const config = useRuntimeConfig();
//     const paramsQuery = appUtils.prepareUrlQueryPath(params);
//     const response = await fetchGet(config.public.realApiUrl, `/courses?${paramsQuery}`, []);
//     if (!response || !response.data || !Array.isArray(response.data.items) || !response.data.pagination) {
//       console.error('API вернул некорректные данные', response);
//       throw createError({
//         statusCode: 404,
//         statusMessage: 'Список курсов не найден',
//         fatal: true,
//       });
//     }
//
//     return response.data.items;
//   } catch (error) {
//     console.error('Ошибка запроса:', error);
//     return [];
//   }
// };

// Получаем данные фильтров при монтировании
// onMounted(async () => {
//   popularCourses.value = await fetchPopularCourses();
// });
</script>

<template>
  <div class="content">
    <section class="lvl1" aria-labelledby="hero-title">
      <div class="all">
        <div class="lvl1-img">
          <div v-if="authUser" class="img-main">
            <NuxtLink to="/faces/17">
              <div class="img-main__text">
                <div class="title">Елизавета Богатырева</div>
                <div class="text">
                  Воспитатель ГБОУ Школа № 236,<br />
                  победитель Всероссийского профессионального конкурса «Воспитатель года России»
                </div>
              </div>
            </NuxtLink>
            <div class="img-main__img" :class="{ '--auth': authUser }">
              <NuxtImg
                loading="lazy"
                :src="`/img/${themeDir}/elizoveta-romanovna-main2.png`"
                alt="Елизавета Богатырева"
                format="webp"
                quality="80"
                sizes="sm:100vw md:50vw lg:800px"
                :placeholder="[50, 25, 75]"
              />
            </div>
          </div>
          <div v-else class="img-main">
            <NuxtLink to="/faces/17">
              <div class="img-main__text">
                <div class="title">Елизавета Богатырева</div>
                <div class="text">
                  Воспитатель ГБОУ Школа № 236,<br />
                  победитель Всероссийского профессионального конкурса «Воспитатель года России»
                </div>
              </div>
            </NuxtLink>
            <div class="img-main__img">
              <NuxtImg
                loading="lazy"
                :src="`/img/${themeDir}/elizoveta-romanovna-main1.png`"
                alt="Елизавета Богатырева"
                format="webp"
                quality="80"
                sizes="sm:100vw md:50vw lg:800px"
                :placeholder="[50, 25, 75]"
              />
            </div>
          </div>
        </div>
        <div class="lvl1-content">
          <div class="lvl-title">
            <h1 v-if="authStore.authenticated" id="hero-title" class="h1-title">Обучение для вас</h1>
            <h1 v-else id="hero-title" class="h1-title">Достигайте своих <span>целей</span> с помощью портала ДПО</h1>
          </div>
          <SimpleSearchBox
            v-model="filterQuery"
            class="--main"
            placeholder="Расскажите, какие курсы вы хотите найти"
            :show-search-button="true"
            @keyup.enter="searchRun"
            @search-click="searchRun"
          />
          <div class="boxinfo search-tags">
            <ul class="curse-list">
              <li v-for="item in topStudyDirections" :key="item.id">
                <NuxtLink :to="`/courses?studyDirectionIds=${encodeURIComponent(item.id)}`" class="curse-item__link">{{
                  item.name
                }}</NuxtLink>
              </li>
              <li class="curse-item-wrapper">
                <NuxtLink to="/courses" class="curse-item__link tag-active">Все направления</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <!--end lvl1-content -->
      </div>
      <!--end all -->
    </section>
    <!--end lvl1 -->

    <section class="main-section" aria-labelledby="org-section-title">
      <div class="all">
        <div class="main-section__header">
          <div id="org-section-title" class="main-title h2-title">Учитесь у лучших</div>
          <div class="right-col"><NuxtLink class="main-title__link" to="/subjects">Все организации</NuxtLink></div>
        </div>
        <OnLazyVisible>
          <div class="main-organisation-list">
            <div class="card">
              <ClientOnly>
                <Carousel
                  :value="orgCards"
                  :num-visible="4"
                  :num-scroll="1"
                  :responsive-options="responsiveOptions"
                  circular
                  :autoplay-interval="3000"
                  :show-navigators="false"
                  :show-indicators="false"
                >
                  <template #item="slotProps">
                    <div class="org-carousel-item p-2">
                      <NuxtLink :to="slotProps.data.link" class="block text-center">
                        <NuxtImg
                          :src="slotProps.data.img"
                          :alt="slotProps.data.name"
                          class="w-full h-auto mx-auto"
                          format="webp"
                          quality="80"
                          loading="lazy"
                          style="max-height: 100px; object-fit: contain"
                        />
                      </NuxtLink>
                    </div>
                  </template>
                </Carousel>
              </ClientOnly>
            </div>
          </div>
        </OnLazyVisible>
      </div>
    </section>

    <section class="main-section" aria-labelledby="popular-courses-title">
      <div class="all">
        <div class="main-section__header">
          <div id="popular-courses-title" class="main-title h2-title">Популярные курсы</div>
          <div class="right-col"><NuxtLink class="main-title__link" to="/courses">Перейти в каталог</NuxtLink></div>
        </div>
        <ul class="course-list" role="list">
          <li v-for="(course, index) in popularCourses" :key="index" class="course-item">
            <CourseBox :item="course" />
          </li>
        </ul>
      </div>
    </section>
    <section class="main-section" aria-label="Полезные разделы портала">
      <div class="all">
        <div class="main-info-image-menu">
          <div class="main-info-image__item">
            <NuxtLink to="/news" class="main-info-image__item__wrapper">
              <div class="img"><img loading="lazy" :src="`/img/${themeDir}/main-news.png`" alt="Новости портала" /></div>
              <div class="b-bottom">
                <span class="title-link">
                  <div class="title-link__text">Новости</div>
                  <div class="title-link__ic"><SvgIcon name="ic-arrow-circle-right" class="ic24"></SvgIcon></div>
                </span>
              </div>
            </NuxtLink>
          </div>
          <!--end main-info-image__item -->
          <div class="main-info-image__item">
            <NuxtLink
              to="https://www.dpomos.ru/calendar/"
              rel="nofollow"
              target="_blank"
              class="main-info-image__item__wrapper"
            >
              <div class="img"><img loading="lazy" :src="`/img/${themeDir}/main-mer.png`" alt="Мероприятия" /></div>
              <div class="b-bottom">
                <span class="title-link">
                  <div class="title-link__text">Мероприятия</div>
                  <div class="title-link__ic"><SvgIcon name="ic-arrow-circle-right" class="ic24"></SvgIcon></div>
                </span>
              </div>
            </NuxtLink>
          </div>
          <!--end main-info-image__item -->
          <div class="main-info-image__item">
            <NuxtLink
              to="https://www.dpomos.ru/cabinet/trainee/my-competitions.php"
              rel="nofollow"
              target="_blank"
              class="main-info-image__item__wrapper"
            >
              <div class="img"><img loading="lazy" :src="`/img/${themeDir}/main-konkurs.png`" alt="Конкурсы" /></div>
              <div class="b-bottom">
                <span class="title-link">
                  <div class="title-link__text">Конкурсы</div>
                  <div class="title-link__ic"><SvgIcon name="ic-arrow-circle-right" class="ic24"></SvgIcon></div>
                </span>
              </div>
            </NuxtLink>
          </div>
          <!--end main-info-image__item -->
        </div>
      </div>
      <!--end main-info-image-menu -->
    </section>
    <!--    Блок Курсы для вас-->
    <div v-if="0" class="lvl2">
      <div class="all">
        <div class="boxinfo-list">
          <div class="boxinfo box-1">
            <div class="boxinfo-wrapper">
              <div class="title">
                <NuxtLink to="/courses" class="title-link">
                  <div class="title-link__text">Курсы для вас</div>
                  <div class="title-link__ic"><SvgIcon name="ic-arrow-circle-right" class="ic24"></SvgIcon></div>
                </NuxtLink>
              </div>
              <ul class="curse-list">
                <li class="curse-item">
                  <NuxtLink to="/" class="curse-item__link">Воспитательная работа</NuxtLink>
                </li>
                <li class="curse-item">
                  <NuxtLink to="/" class="curse-item__link">Государственная итоговая аттестация (9-11 кл)</NuxtLink>
                </li>
                <li class="curse-item">
                  <NuxtLink to="/" class="curse-item__link">Дошкольное образование</NuxtLink>
                </li>
                <li class="curse-item">
                  <NuxtLink to="/" class="curse-item__link">Духовно-нравственное воспитание, ОРКСЭ</NuxtLink>
                </li>
                <li class="curse-item-wrapper">
                  <NuxtLink to="/courses" class="curse-item__link tag-active">Все направления</NuxtLink>
                </li>
              </ul>
              <div class="boxinfo-img">
                <img :src="`/img/${themeDir}/education.svg`" alt="" />
              </div>
            </div>
          </div>
          <div class="boxs-mini">
            <div class="boxinfo box-2">
              <div class="boxinfo-wrapper">
                <div class="title">
                  <NuxtLink to="https://www.dpomos.ru/calendar/" rel="nofollow" target="_blank" class="title-link">
                    <div class="title-link__text">Мероприятия</div>
                    <div class="title-link__ic"><SvgIcon name="ic-arrow-circle-right" class="ic32"></SvgIcon></div>
                  </NuxtLink>
                </div>
                <div class="boxinfo-img">
                  <img :src="`/img/${themeDir}/events.svg`" alt="" />
                </div>
              </div>
            </div>
            <div class="boxinfo box-3">
              <div class="boxinfo-wrapper">
                <div class="title">
                  <NuxtLink
                    to="https://www.dpomos.ru/cabinet/trainee/my-competitions.php"
                    rel="nofollow"
                    target="_blank"
                    class="title-link"
                  >
                    <div class="title-link__text">Конкурсы</div>
                    <div class="title-link__ic"><SvgIcon name="ic-arrow-circle-right" class="ic32"></SvgIcon></div>
                  </NuxtLink>
                </div>
                <div class="boxinfo-img">
                  <img :src="`/img/${themeDir}/winners.svg`" alt="" />
                </div>
              </div>
            </div>
            <div class="boxinfo box-4">
              <div class="boxinfo-wrapper">
                <div class="title">
                  <NuxtLink to="/news" class="title-link">
                    <div class="title-link__text">Новости</div>
                    <div class="title-link__ic"><SvgIcon name="ic-arrow-circle-right" class="ic32"></SvgIcon></div>
                  </NuxtLink>
                </div>
                <div class="boxinfo-img">
                  <img :src="`/img/${themeDir}/happy_news.svg`" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end all-->
    </div>
    <!--end lvl2 -->
    <OnLazyVisible class="lvl3">
      <div class="all">
        <div class="slider-big-wrapper">
          <ClientOnly>
            <Carousel
              class="slider-big"
              :value="sliderMain.data"
              :num-visible="1"
              :num-scroll="1"
              :show-indicators="false"
              @update:page="onCurrentSlide"
            >
              <template #item="slotProps">
                <div class="banner-big">
                  <a :href="slotProps.data.href" :target="slotProps.data.target">
                    <NuxtImg
                      :src="slotProps.data.image"
                      :alt="slotProps.data.id"
                      class="w-full rounded"
                      format="webp"
                      quality="80"
                      loading="lazy"
                      sizes="sm:100vw xl:1000px"
                      :placeholder="[100, 125, 75]"
                    />
                  </a>
                </div>
              </template>
              <template #previcon>
                <SvgIcon name="ic-arrow-circle-right" class="fnone ic48 arr-left"></SvgIcon>
              </template>
              <template #nexticon>
                <SvgIcon name="ic-arrow-circle-right" class="fnone ic48"></SvgIcon>
              </template>
            </Carousel>
          </ClientOnly>
          <div class="indicator">
            <strong>{{ currentSlide }}</strong> / {{ totalSlides }}
          </div>
        </div>
      </div>
      <!--end all-->
    </OnLazyVisible>
    <!--end lvl3 -->
  </div>
</template>
<style scoped>
.card {
  border: none;
}

.org-carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.org-carousel-item img {
  width: 100%;
  max-width: 180px;
  height: 100px;
  object-fit: contain;
  background-color: #fff;
  border-radius: 8px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.org-carousel-item img:hover {
  transform: scale(1.05);
}
</style>
