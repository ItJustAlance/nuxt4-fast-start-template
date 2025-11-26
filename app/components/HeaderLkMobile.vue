<script lang="ts" setup>
import { useAuthUser } from '@/composables/useAuthUser';

const currentUser = useAuthUser();
// const { logout } = useAuth();

// const hide = () => {
//   // TODO: жесткий костыль, чтобы скрыть мобильное меню при клике - заменить на норм решение через события?
//   // TODO: убрал, но есть проблема при закрытии если уже находишься на этой странице и нажимаешь еще раз на кнопку войти
//   // <header class="header --lk-open">
//   // <div class="mobile-menu open">
//   // document.querySelectorAll('header.header').forEach((item) => {
//   //   item.classList.remove('--lk-open');
//   // });
//   document.querySelectorAll('.mobile-menu.open').forEach((item) => {
//     item.classList.remove('open');
//   });
// };

// const onLogoutClick = async () => {
//   try {
//     currentUser.value.pending = true;
//     await logout();
//     await navigateTo('/');
//   } catch (error) {
//     console.error(error);
//   } finally {
//     currentUser.value.pending = false;
//   }
// };
</script>

<template>
  <div class="mobile-menu">
    <div v-if="currentUser"><LazyAuthInfo /></div>
    <div v-else class="submenu__item">
      <div class="submenu__item-up">
        <div class="submenu__icon"><img src="/img/red/menu-books.svg" alt="" /></div>
        <NuxtLink to="/login" class="submenu__item-label">Войти</NuxtLink>
      </div>
      <div class="submenu__item-bottom">Для зарегистрированных пользователей</div>
    </div>
    <!-- <ul class="header__nav-menu">
      <li class="nav-menu-item nav-menu-item__submenu --open">
        <div class="submenu open">
          <div class="all">
            <div class="submenu__wrapper">
              <div class="submenu__box">
                <div class="submenu__items">
                  <div v-if="!currentUser" class="submenu__item">
                    <div class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-books.svg" alt="" /></div>
                      <NuxtLink to="/login" class="submenu__item-label" @click="hide">Войти</NuxtLink>
                    </div>
                    <div class="submenu__item-bottom">Для зарегистрированных пользователей</div>
                  </div>
                  <div v-if="!currentUser && false" class="submenu__item">
                    <div class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-chalkboardTeacher.svg" alt="" /></div>
                      <NuxtLink to="/registration" class="submenu__item-label" @click="hide">Регистрация</NuxtLink>
                    </div>
                    <div class="submenu__item-bottom">Для пользователей, у которых нет аккаунта в системе</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul> -->
  </div>
</template>

