<script setup lang="ts">
// import { defineAsyncComponent } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});
const className = `svg-icon  svg-icon--${props.name}`;
// const inheritAttrs = false;
</script>

<template>
  <NuxtIcon :class="className" filled :name="`red/${props.name}`" />
</template>
