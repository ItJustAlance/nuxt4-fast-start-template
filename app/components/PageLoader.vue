<template>
  <transition name="fade">
    <div v-show="visible" class="page-loader">
      <loader-korpik />
    </div>
  </transition>
</template>

<script setup lang="ts">
const loading = ref(false);
const visible = ref(false);

const nuxtApp = useNuxtApp();
let timer: ReturnType<typeof setTimeout> | null = null;

nuxtApp.hook('page:start', () => {
  console.log('page:start');
  loading.value = true;
  // visible.value = true
  // показываем, если дольше 200мс
  timer = setTimeout(() => {
    if (loading.value) visible.value = true;
  }, 200);
});

nuxtApp.hook('page:finish', () => {
  loading.value = false;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  setTimeout(() => {
    if (!loading.value) visible.value = false;
  }, 1000);
});
</script>

<style>
.page-loader {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  z-index: 99;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
