<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import clickOutSide from '@mahdikhashan/vue3-click-outside';
import { useAuthUser } from '@/composables/useAuthUser';
import { useMyApplications } from '~/composables/useMyApplications';
import { useAuthStore } from '~/stores/auth';

const vClickOutSide = clickOutSide;

const ready = ref(false);
const show = ref(false);
const user = ref({ pending: false });

const hide = () => {
  show.value = false;
};

const { logout } = useAuth();
const authUser = useAuthUser();
const authStore = useAuthStore();
const { getPersonalMenu, getRoleDescription } = storeToRefs(authStore);
const { applications, applicationLoadData } = useMyApplications();

const userData = computed(() => ({
  auth: authUser.value || null,
  applications: applications.value,
  personalMenu: getPersonalMenu.value ?? [],
}));

const personalMenu = computed(() => {
  const data = userData.value;
  if (!data?.personalMenu) return [];

  return (
    data.personalMenu
      .map((group) => {
        const items = (group.items || []).map((item) => {
          /** УСЛОВИЯ с ручным вводом для меню */
          if (group.groupCode === 'lkUser' && item.name === 'lkUserCourses') {
            return { ...item, quantity: data.applications?.length ?? 0 };
          }
          return item;
        });
        return { ...group, items };
      })
      // фильтруем группы, которые включены
      .filter((group) => group.items && group.items.find((el) => el.enabled))
  );
});

// Синхронизируем store, если есть данные из SSR
onMounted(() => {
  console.log('onMount auth');
  applicationLoadData(true);
  ready.value = true;
});

// TODO: сделать общий код с меню для мобильным
const onLogoutClick = async () => {
  try {
    user.value.pending = true;
    await logout();
    await navigateTo('/');
    document.querySelectorAll('header.header').forEach((item) => {
      item.classList.remove('--lk-open');
    });
    document.querySelectorAll('.mobile-menu.open').forEach((item) => {
      item.classList.remove('open');
    });
  } catch (error) {
    console.error(error);
  } finally {
    user.value.pending = false;
  }
};
</script>

<template>
  <div v-if="ready" class="auth-info-wrapper">
    <div v-click-out-side="hide" class="auth-info" :class="{ show: show }">
      <div class="auth-info__label" @click="show = !show">
        <div class="auth-info__label-ico">
          <img loading="lazy" :src="'/img/red/avatar.svg'" alt="ava" >
        </div>
        <!-- div class="auth-info__label-name">Администратор</div -->
        <div class="auth-info__label-name">{{ userData.auth.firstName }}</div>

        <div class="auth-info__label-arr">
          <SvgIcon name="menu-arr" class="ic16"/>
        </div>
      </div>
      <div class="auth-info__dropdown">
        <div class="auth-info__user-info">
          <div class="ava"><img loading="lazy" :src="'/img/red/avatar.svg'" alt="" ></div>
          <div class="right">
            <NuxtLink class="name" to="/" @click="hide">
              {{ userData.auth.firstName }} {{ userData.auth.lastName }}
            </NuxtLink>
            <div class="office">{{ getRoleDescription }}</div>
          </div>
        </div>
        <ul class="auth-info__list">
          <li>
            <NuxtLink class="link-box" to="/" @click="hide">
              <span class="link-box__icon">
                <SvgIcon name="chat-circle" class="fnone ic20"/>
              </span>
              <span class="link-box__label">Уведомления</span>
              <span class="num">0</span>
            </NuxtLink>
          </li>
        </ul>
        <div v-for="item in personalMenu" :key="item.id">
          <div class="auth-info__title">
            <NuxtLink v-if="item.defaultLink" :to="item.defaultLink">
              <span class="auth-info__title__link">{{ item.groupTitle }}</span>
            </NuxtLink>
            <span v-else class="auth-info__title__link">{{ item.groupTitle }}</span>
          </div>
          <ul class="auth-info__list">
            <li v-for="(menuItem, i) in item.items" v-show="menuItem.enabled" :key="menuItem.id">
              <NuxtLink v-if="menuItem.enabled" class="link-box" :to="menuItem.link" @click="hide">
                <span class="link-box__label">{{ menuItem.title }}</span>
                <span v-if="menuItem.quantity" class="num">{{ menuItem.quantity }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="auth-info__bottom">
          <button class="link-box link--red" @click="onLogoutClick">
            <span class="link-box__icon">
              <SvgIcon name="sign-out" class="fnone ic20"/>
            </span>
            <div class="link-box__label">Выйти</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
