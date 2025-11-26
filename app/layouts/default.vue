<script setup lang="ts">
import { useBreakpoint } from '~/composables/useMediaQuery';
useBreakpoint();
</script>
<template>
  <div class="over">
    <a class="skip-link" href="#main-content">Перейти к основному содержанию</a>
    <HeaderComp />
    <div id="main-content" class="main" role="main" tabindex="-1">
      <page-loader />
      <slot />
    </div>
    <FooterComp />
    <ModalPopup />
  </div>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: -999px;
  top: 1rem;
  width: 1px;
  height: 1px;
  overflow: hidden;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  color: #111111;
  border-radius: 4px;
  box-shadow: 0 0 0 2px #e31e24;
  font-weight: 600;
  z-index: 1100;
}

.skip-link:focus {
  left: 1rem;
  width: auto;
  height: auto;
  overflow: visible;
}
</style>
