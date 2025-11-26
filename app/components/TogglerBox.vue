<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{ open?: boolean }>();

const isOpen = ref(false);

onMounted(() => {
  isOpen.value = !!props.open;
});

watch(
  () => props.open,
  (newVal) => {
    isOpen.value = !!newVal;
  },
);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="toggler-box" :class="{ open: isOpen }">
    <div class="toggler-box__header" @click="toggle">
      <slot name="header">
        <div class="title">Заголовок</div>
      </slot>
      <div class="arr">
        <SvgIcon name="caret-up" class="ic16" />
      </div>
    </div>

    <transition name="fade">
      <div v-if="isOpen" class="toggler-box__body">
        <slot />
      </div>
    </transition>
  </div>
</template>
