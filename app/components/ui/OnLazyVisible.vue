<script setup lang="ts">
import { useLazyComponent } from '~/composables/useLazyComponent';

const props = defineProps({
  ssr: { type: Boolean, default: false },
});

const { isVisible, target } = useLazyComponent(props.ssr);
</script>
<template>
  <div ref="target">
    <slot v-if="isVisible" />
  </div>
</template>
