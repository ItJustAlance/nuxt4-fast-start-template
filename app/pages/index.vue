<script lang="ts" setup>

import { useEntrySeo } from '~/composables/seo/useEntrySeo';

const route = useRoute();
// const id = route.params.course;

const breadcrumbList = ref([
  { label: 'тестовая', route: '/' },
  {
    label: 'Изучение основ трёхмерного моделирования и печати для использования в образовательном процессе',
    route: route.path,
    isCurrent: true,
  },
]);

useEntrySeo({ breadcrumbs: breadcrumbList });
const sliderTeach = reactive({
  data: [
    {
      id: 1,
      url: '/img/teach1.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 2,
      url: '/img/teach2.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 3,
      url: '/img/teach-default.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 4,
      url: '/img/teach2.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 5,
      url: '/img/teach-default.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
    {
      id: 6,
      url: '/img/teach1.png',
      title: 'Мацаль И.И',
      text: 'гл.инженер ООО Экзамен-Технолаб',
    },
  ],
  options: [
    {
      breakpoint: '1200px',
      numVisible: 4,
      numScroll: 1,
      circular: true,
    },
    {
      breakpoint: '1023px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 2,
      numScroll: 1,
      circular: true,
    },
  ],
});
</script>

<template>
  <div class="all">
    <Breadcrumb :model="breadcrumbList">
      <template #item="{ item, props }">
        <NuxtLink v-if="item.route && !item.isCurrent" v-slot="{ navigate }" :to="item.route" custom>
          <a class="bread-item" :href="item.route" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </NuxtLink>
        <span v-else class="bread-item">
          <span>{{ item.label }}</span>
        </span>
      </template>
      <template #separator> <span class="f-700">/</span> </template>
    </Breadcrumb>
    <div class="b-container">
      <main class="content-body">
        <section class="section section-event-info">
          <div class="event-header">
            <div class="img">
              <NuxtImg
                src="/img/red/big-event.png"
                alt=""
                format="webp"
                quality="80"
                loading="lazy"
                sizes="sm:260px lg:300px"
                :placeholder="[50, 75]"
              />
            </div>
            <div class="event-info">
              <div class="tag-name">
                <div class="mini-info --blue">
                  <div class="mini-info__ico">
                    <SvgIcon name="bookmarks" class="fnone ic16"></SvgIcon>
                  </div>
                  <div class="mini-info__text">Университетская среда для учителей</div>
                </div>
              </div>
              <h1 class="h1-title">
                Образование Древнерусского государства и формирование его территорий в IX - н. XII вв.
              </h1>
              <div class="img --img-mobile">
                <NuxtImg
                  src="/img/red/big-event.png"
                  alt=""
                  format="webp"
                  quality="80"
                  loading="lazy"
                  sizes="sm:100vw md:50vw lg:600px"
                  :placeholder="[50, 25, 75]"
                />
              </div>
              <div class="course-info__about">
                <div class="b-item">
                  <div class="b-label">ДАТА</div>
                  <div class="b-text">
                    <div class="b-icon">
                      <SvgIcon name="calendar-check" class="fnone ic12" />
                    </div>
                    
                    4 октября 2023, 18:00
                  </div>
                </div>
                <div class="b-item">
                  <div class="b-label">ФОРМА</div>
                  <div class="b-text">
                    <div class="b-icon">
                      <SvgIcon name="ic-monitor" class="fnone ic12" />
                    </div>
                    
                    Очно
                  </div>
                </div>
                <div class="b-item">
                  <div class="b-label">АДРЕС</div>
                  <div class="b-text">
                    <div class="b-icon">
                      <img src="/img/red/mapPin.svg" alt="" />
                    </div>
                    пр. Пушкина 27
                  </div>
                </div>
                <div class="b-item">
                  <div class="b-label">МЕСТА</div>
                  <div class="b-text">
                    <div class="b-icon">
                      <img src="/img/red/users.png" alt="" />
                    </div>
                    свободно 26 из 75
                  </div>
                </div>
              </div>
              <!--end course-info__about-->
              <div class="event-info-bottom">
                <div class="price">2300р</div>
                <div class="b-btn"><button class="btn btn--md-full">Записаться</button></div>
              </div>
            </div>
            <!--end event-info -->
          </div>
          <!--end event-header -->
        </section>
        
        <section class="section-big">
          <div class="course-nav-box">
            <article class="course-nav__text article">
              <p>
                Курс направлен на совершенствование профессиональных компетенций обучающихся в области изучения основ
                трёхмерного моделирования и печати для использования в образовательном процессе. В программу входят
                следующие разделы:
              </p>
              <p>
                Курс направлен на совершенствование профессиональных компетенций обучающихся в области изучения основ
                трёхмерного моделирования и печати для использования в образовательном процессе. В программу входят
                следующие разделы:
              </p>
              <p>В программу входят следующие разделы:</p>
              <ol>
                <li>Моделирование конструкций с использованием технологии SnapCad.</li>
                <li>
                  Знакомство с современными научными знаниями по созданию деталей и сборок в среде моделирования
                  Autodesk Inventor
                </li>
                <li>Создание сборки в программе Autodesk Inventor</li>
                <li>Настройка вывода трёхмерных объектов в формат для трёхмерной печати</li>
              </ol>
              <p>
                Итоговая аттестация – зачет на основании совокупности выполненных работ, результатов тестирования и
                итоговой практической работы.
              </p>
            </article>
            <div class="course-nav__menu">
              <div class="course-nav__menu-box">
                <div class="title">Для кого мероприятие</div>
                <ul class="course-nav__list">
                  <li class="course-nav__list-item">
                    <span class="course-nav__list-item-wrap">Учитель физики</span>
                  </li>
                </ul>
              </div>
              <div class="course-nav__menu-box">
                <div class="title">Продолжительность</div>
                <ul class="course-nav__list">
                  <li class="course-nav__list-item">
                    <span class="course-nav__list-item-wrap">2 часа</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--end course-nav -->
        </section>
        <section class="section-big">
          <div class="docs-list --cols3">
            <div class="item-doc">
              <NuxtLink href="#" class="item-doc__wrapper">
                <span class="b-icon"><SvgIcon name="file-pdf" class="fnone ic24"></SvgIcon></span>
                <span class="b-name">Инструкция по размещению программ на Портале ДПО</span>
              </NuxtLink>
            </div>
            <!--end item-doc -->
            <div class="item-doc">
              <NuxtLink href="#" class="item-doc__wrapper">
                <span class="b-icon"><SvgIcon name="file-pdf" class="fnone ic24"></SvgIcon></span>
                <span class="b-name">Инструкция по размещению программ на Портале ДПО</span>
              </NuxtLink>
            </div>
            <!--end item-doc -->
            <div class="item-doc">
              <NuxtLink href="#" class="item-doc__wrapper">
                <span class="b-icon"><SvgIcon name="file-doc" class="fnone ic24"></SvgIcon></span>
                <span class="b-name">Инструкция по размещению программ на Портале ДПО</span>
              </NuxtLink>
            </div>
            <!--end item-doc -->
          </div>
        </section>
        <section class="section-big">
          <h2 class="h2-title section-title">Спикеры</h2>
          <Carousel
            class="slider-teacher"
            :value="sliderTeach.data"
            :num-visible="4"
            :num-scroll="1"
            :show-indicators="false"
            circular
            :responsive-options="sliderTeach.options"
          >
            <template #item="slotProps">
              <div class="slide-teach">
                <div class="img">
                  <img loading="lazy" :src="slotProps.data.url" :alt="slotProps.data.id" class="w-full rounded" />
                </div>
                <div class="title">{{ slotProps.data.title }}</div>
                <div class="text">{{ slotProps.data.text }}</div>
              </div>
            </template>
            <template #previcon>
              <SvgIcon name="ic-arrow-circle-left" class="fnone ic48"></SvgIcon>
            </template>
            <template #nexticon>
              <SvgIcon name="ic-arrow-circle-right" class="fnone ic48"></SvgIcon>
            </template>
          </Carousel>
        </section>
        
        <section class="section-big">
          <h2 class="h2-title section-title">Программа мероприятия</h2>
          <div class="course-program-list">
            <div class="b-item">
              <div class="b-item__wrapper">
                <div class="num">01</div>
                <div class="text">
                  Моделирование конструкций с использованием технологии SnapCad Моделирование конструкций с
                  использованием технологии SnapCad
                </div>
              </div>
            </div>
            <div class="b-item">
              <div class="b-item__wrapper">
                <div class="num">02</div>
                <div class="text">
                  Знакомство с современными научными знаниями по созданию деталей и сборок в среде моделирования
                  Autodesk Inventor
                </div>
              </div>
            </div>
            <div class="b-item">
              <div class="b-item__wrapper">
                <div class="num">03</div>
                <div class="text">Создание сборки в программе Autodesk Inventor</div>
              </div>
            </div>
            <div class="b-item">
              <div class="b-item__wrapper">
                <div class="num">04</div>
                <div class="text">Настройка вывода трёхмерных объектов в формат для трёхмерной печати</div>
              </div>
            </div>
            <div class="b-item">
              <div class="b-item__wrapper">
                <div class="num">05</div>
                <div class="text">Обучение 3 D моделированию и печати</div>
              </div>
            </div>
            <div class="b-item">
              <div class="b-item__wrapper">
                <div class="num">06</div>
                <div class="text">Итоговая аттестация</div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="section-big --last">
          <h2 class="h2-title section-title">Организатор</h2>
          <div class="course-organizator-info">
            <div class="b-info">
              <div class="card-org">
                <div class="img"><img src="/img/red/org-img.png" alt="" /></div>
                <div class="text">ФГАОУ ВО «Национальный исследовательский технологический университет «МИСиС»</div>
              </div>
              <div class="course-info__about">
                <div class="b-item">
                  <div class="b-label">ТАТУНОВ ЮРИЙ ЮРЬЕВИЧ</div>
                  <div class="b-text">
                    <div class="text-row">
                      <div class="col-md-50 col-xs-100">
                        <div class="b-icon">
                          <img src="/img/red/phone.svg" alt="" />
                        </div>
                        +7(495)114-56-28
                      </div>
                      <div class="col-md-50 col-xs-100">
                        <div class="b-icon">
                          <img src="/img/red/email.svg" alt="" />
                        </div>
                        +7(495)114-56-28
                      </div>
                    </div>
                  </div>
                </div>
                <div class="b-item">
                  <div class="b-label">АРБИЕВ РУСЛАН МУСЛИМОВИЧ</div>
                  <div class="b-text">
                    <div class="text-row">
                      <div class="col-md-50 col-xs-100">
                        <div class="b-icon">
                          <img src="/img/red/phone.svg" alt="" />
                        </div>
                        +7(495)114-56-28
                      </div>
                      <div class="col-md-50 col-xs-100">
                        <div class="b-icon">
                          <img src="/img/red/email.svg" alt="" />
                        </div>
                        +7(495)114-56-28
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--end course-info__about-->
            </div>
            <div class="b-img">
              <img src="/img/red/teaching.png" alt="" />
            </div>
          </div>
          <!--end course-organizator-info -->
        </section>
      </main>
    </div>
  </div>
</template>
