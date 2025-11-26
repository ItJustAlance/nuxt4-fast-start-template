<script lang="ts" setup>
import clickOutSide from '@mahdikhashan/vue3-click-outside';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '~/stores/theme';
import { useBreakpoint } from '@/composables/useMediaQuery';

const { current, isMobile } = useBreakpoint();
const currentUser = useAuthUser();

// const isAdmin = useAdmin();
// const { logout } = useAuth();

const vClickOutSide = clickOutSide;

const themeStore = useThemeStore();
const { themeDir } = storeToRefs(themeStore);

const form = reactive({
  pending: false,
});

const isMenuOpen = ref(false);
const dopMenuOpen = ref(false);

function onMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  isLkOpen.value = false;
  document.body.classList.toggle('lock', isMenuOpen.value);
}

const isLkOpen = ref(false);

function onLk() {
  isLkOpen.value = !isLkOpen.value;
  isMenuOpen.value = false;
  document.body.classList.toggle('lock', isLkOpen.value);
}
function onClose() {
  isLkOpen.value = false;
  isMenuOpen.value = false;
  document.body.classList.toggle('lock', false);
}

function onSubmenuLinkClose() {
  document.body.classList.add('menu-no-hover');
  // и через 200ms вернём hover
  setTimeout(() => document.body.classList.remove('menu-no-hover'), 200);
}

const hideDopMenu = () => {
  console.log('hideDopMenu');
  dopMenuOpen.value = false;
};

// Закрывать меню при смене маршрута
const route = useRoute();
watch(
  () => route.fullPath,
  () => onClose(),
);
</script>

<template>
  <header class="header" :class="{ '--lk-open': isLkOpen, '--menu-open': isMenuOpen }">
    <div class="all">
      <div class="header__lk">
        <div class="header__lk-ico" @click="onLk">
          <SvgIcon name="user" class="ic42 fnone"/>
        </div>
      </div>
      <!--end header__lk -->
      <div class="header__logo">
        <NuxtLink to="/" class="logo-link">
          <img :src="`/img/${themeDir}/logo-new.svg`" alt="" >
        </NuxtLink>
      </div>
      <nav v-click-out-side="hideDopMenu" class="header__nav">
        <div class="header__nav-ico">
          <SvgIcon v-show="!(isMenuOpen || isLkOpen)" name="ic-menu" class="ic42" @click="onMenu"/>
          <SvgIcon v-show="isMenuOpen || isLkOpen" name="menu-close" class="ic42" @click="onClose"/>
        </div>
        <ul role="navigation" class="header__nav-menu">
          <li class="nav-menu-item">
            <NuxtLink data-tour="showCourses" to="/" class="nav-menu-item__link"> Курсы </NuxtLink>
          </li>

          <!-- временно: ссылка на дпомос -->
          <li class="nav-menu-item">
            <NuxtLink
              to="https://www.dpomos.ru/calendar/"
              rel="nofollow"
              target="_blank"
              data-tour="showEventButton"
              class="nav-menu-item__link"
            >
              Мероприятия
            </NuxtLink>
          </li>
          <li class="nav-menu-item">
            <NuxtLink
              to="https://www.dpomos.ru/cabinet/trainee/my-competitions.php"
              rel="nofollow"
              target="_blank"
              class="nav-menu-item__link"
            >
              Конкурсы
            </NuxtLink>
          </li>
          <li v-if="false" class="nav-menu-item">
            <NuxtLink data-tour="showEventButton" to="#" class="nav-menu-item__link">
              Мероприятия
            </NuxtLink>
          </li>
          <li v-if="false" class="nav-menu-item">
            <NuxtLink to="#" class="nav-menu-item__link"> Конкурсы </NuxtLink>
          </li>

          <li class="nav-menu-item">
            <NuxtLink to="#" class="nav-menu-item__link"> Новости </NuxtLink>
          </li>
          <li class="nav-menu-item nav-menu-item__submenu" :class="{ '--open': dopMenuOpen }">
            <div class="nav-menu-item__link --arr" @click="dopMenuOpen = !dopMenuOpen">
              Дополнительно
              <SvgIcon name="menu-arr" class="ic16"/>
            </div>
            <div class="submenu">
              <div class="all">
                <div class="submenu__wrapper">
                  <div class="submenu__box">
                    <div class="submenu__title">НА ПОРТАЛЕ</div>
                    <div class="submenu__items">
                      <div class="submenu__item">
                        <NuxtLink to="#" class="submenu__item-up" @click="onSubmenuLinkClose()">
                          <span class="submenu__icon"><img src="/img/red/menu-books.svg" alt="" ></span>
                          <span class="submenu__item-label">Реестр программ</span>
                        </NuxtLink>
                        <div class="submenu__item-bottom">Все актуальные программы ДПО прошедшие экспертизу</div>
                      </div>
                      <!--end submenu__item -->
                      <div class="submenu__item">
                        <NuxtLink to="#" class="submenu__item-up" @click="onSubmenuLinkClose()">
                          <span class="submenu__icon"><img src="/img/red/menu-chalkboardTeacher.svg" alt="" ></span>
                          <span class="submenu__item-label">Организации-субъекты ДПО</span>
                        </NuxtLink>
                        <div class="submenu__item-bottom">Организации ДПО размещающие программы на портале ДПО</div>
                      </div>
                      <!--end submenu__item -->
                      <div class="submenu__item">
                        <div class="submenu__item-up">
                          <div class="submenu__icon"><img src="/img/red/menu-and.svg" alt="" ></div>
                          <NuxtLink to="/" class="submenu__item-label" @click="onSubmenuLinkClose()"
                            >Знакомство с порталом</NuxtLink
                          >
                        </div>
                        <div class="submenu__item-bottom">
                          <ul class="list-submenu3">
                            <li>Гид по порталу</li>
                            <li>
                              <NuxtLink to="/" @click="onSubmenuLinkClose()">
                                Лица портала
                              </NuxtLink>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!--end submenu__item -->
                      <div class="submenu__item">
                        <a href="/" class="submenu__item-up logo-link">
                          <div class="submenu__icon"><img src="/img/red/menu-ear.svg" alt="" ></div>
                          <div class="submenu__item-label">Экспертиза ДПП</div>
                        </a>
                        <div class="submenu__item-bottom">
                          Нормативно-правовые акты для проведения экспертизы программ ДПП
                        </div>
                      </div>
                      <!--end submenu__item -->
                      <div class="submenu__item">
                        <a href="/" class="submenu__item-up">
                          <div class="submenu__icon"><img src="/img/red/menu-briefcase.svg" alt="" ></div>
                          <div class="submenu__item-label">Правовая информация</div>
                        </a>
                        <div class="submenu__item-bottom">
                          <ul class="list-submenu3">
                            <li>
                              <a href="https://www.dpomos.ru/legal/2272899/" rel="nofollow" target="_blank">
                                Обработка персональных данных
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!--end submenu__item -->
                      <div class="submenu__item">
                        <a href="https://www.dpomos.ru/support/" rel="nofollow" target="_blank" class="submenu__item-up">
                          <div class="submenu__icon"><img src="/img/red/menu-userList.svg" alt="" ></div>
                          <div class="submenu__item-label">Поддержка</div>
                        </a>
                        <div class="submenu__item-bottom">Форма связи с технической поддержкой</div>
                      </div>
                      <!--end submenu__item -->
                    </div>
                  </div>
                  <!--end submenu__box -->
                  <div class="submenu__box">
                    <div class="submenu__title">ВНЕШНИЕ РЕСУРСЫ</div>
                    <div class="submenu__items">
                      <div class="submenu__item">
                        <a href="https://br.corp-univer.ru/" target="_blank" class="submenu__item-up">
                          <div class="submenu__icon"><img src="/img/red/menu-books.svg" alt="" ></div>
                          <div class="submenu__item-label">Банк резюме</div>
                        </a>
                        <div class="submenu__item-bottom">
                          Сервис поиска сотрудников и вакансий в сфере Московского образования
                        </div>
                      </div>
                      <!--end submenu__item -->
                      <div class="submenu__item">
                        <div class="submenu__item-up">
                          <div class="submenu__icon"><img src="/img/red/menu-ear.svg" alt="" ></div>
                          <div class="submenu__item-label">Аттестация</div>
                        </div>
                        <div class="submenu__item-bottom">
                          <ul class="list-submenu3">
                            <li>
                              <a href="https://corp-univer.ru/аттестация-руководящих-кадров/" target="_blank">
                                Руководящих кадров
                              </a>
                            </li>
                            <li>
                              <a href="https://corp-univer.ru/аттестация-педагогических-работников/" target="_blank">
                                Педагогических работников
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!--end submenu__item -->
                    </div>
                  </div>
                  <!--end submenu__box -->
                </div>
              </div>
            </div>
            <!--end submenu -->
          </li>
        </ul>
      </nav>
      <div class="header__right">
        <div v-if="currentUser" class="b-links-logins">
          <LazyAuthInfo />
        </div>
        <div v-else class="b-links-logins">
          <!-- регистрация пока через dpomos -->
          <!-- <a href="/registration" class="btn btn--inline">Регистрация</a> -->
          <NuxtLink to="/" class="btn">Войти</NuxtLink>
        </div>
        <!-- TODO: сделать версию для слабовидящих -->
        <div v-if="false" class="b-view-low-vision">
          <button color="btn-inline">
            <SvgIcon name="eye" class="ic32"/>
          </button>
        </div>
      </div>
      <!--end header__right -->
    </div>
    <!--end all -->
    <LazyHeaderMenuMobile v-if="isMobile || current == 'lg'" :class="{ open: isMenuOpen }" />
    <LazyHeaderLkMobile v-if="current == 'lg' || isMobile" :class="{ open: isLkOpen }" />
  </header>
</template>
