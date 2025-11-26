<template>
  <div>
    <div
      v-if="modalStore.isOpenState"
      class="just-modal fade"
      :class="[{ open: modalStore.isOpenState, in: isShowAnimate }, modalStore.modalClass]"
    >
      <div class="just-modal__overlay" @click="closeModal"/>
      <div class="just-modal__wrapper">
        <div class="just-modal__container">
          <div class="just-modal__body">
            <!-- Header слот -->
            <div v-if="modalStore.isModalHeaderVisibility" class="modal-search__header">
              <div class="just-modal__header-box">
                <slot name="header"/>
              </div>
            </div>
            <!-- HTML сверху -->
            <div v-if="modalStore.modalContentUpHtml" class="modal-search__header">
              <div
                class="just-modal__header-box"
                v-html="appUtils.decodeAndSanitizeHtml(modalStore.modalContentUpHtml)"
              />
            </div>
            <!-- Слот contentUp -->
            <div v-if="modalStore.isModalContentUp" class="just-modal__content">
              <div class="just-modal__content-wrap">
                <slot name="contentUp"/>
              </div>
            </div>
            <!-- Динамический компонент -->
            <component
              :is="resolvedComponent"
              v-if="resolvedComponent"
              v-bind="componentProps"
              :class="modalStore.modalComponentClass"
            />
            <!-- Слот contentDown -->
            <div v-if="modalStore.isModalContentDown" class="just-modal__content">
              <div class="just-modal__content-wrap">
                <slot name="contentDown"/>
              </div>
            </div>
            <!-- HTML снизу -->
            <div v-if="modalStore.modalContentDownHtml" class="just-modal__content">
              <div
                class="just-modal__content-wrap"
                v-html="appUtils.decodeAndSanitizeHtml(modalStore.modalContentDownHtml)"
              />
            </div>
            <!-- Кнопка закрытия -->
            <div class="just-modal__close-wrapper">
              <button type="button" class="just-modal__close" @click="closeModal">
                <svg width="32" height="32" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.93542 7.47658L11.7167 3.66669L12.3755 4.32554L8.56563 8.10679L12.3755 11.9167L11.7167 12.5755L7.93542 8.76565L4.12553 12.5755L3.46667 11.9167L7.27657 8.10679L3.46667 4.32554L4.12553 3.66669L7.93542 7.47658Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useModalStore } from '~/stores/modal';
import appUtils from '~/utils/appUtils';

const modalStore = useModalStore();
const isShowAnimate = ref(false);

const resolvedComponent = computed(() => {
  const key = modalStore.modalComponentState;
  if (!key || typeof key !== 'string') return null;
  try {
    console.log('key', key);
    return defineAsyncComponent(() => import(`~/components/modal/dialog/${key}.vue`));
  } catch (err) {
    console.warn(`ModalPopup: не удалось загрузить компонент ~/components/modal/dialog/${key}.vue`, err);
    return null;
  }
});

const componentProps = computed(() => {
  return {
    ...(modalStore.componentParamsState || {}),
  };
});

// Анимация открытия/закрытия
watch(
  () => modalStore.isOpenState,
  (open) => {
    if (open) {
      document.body.classList.add('lock');
      if (modalStore.modalBodyClass) {
        document.body.classList.add(modalStore.modalBodyClass);
      }
      setTimeout(() => {
        isShowAnimate.value = true;
      }, 300);
    } else {
      isShowAnimate.value = false;
      document.body.classList.remove('lock');
      if (modalStore.modalBodyClass) {
        document.body.classList.remove(modalStore.modalBodyClass);
      }
    }
  },
);

function closeModal() {
  isShowAnimate.value = false;
  setTimeout(() => {
    modalStore.toggleModal(false);
    modalStore.resetModal();
  }, 200);
  setTimeout(() => {
    document.body.classList.remove('lock');
    if (modalStore.modalBodyClass) {
      document.body.classList.remove(modalStore.modalBodyClass);
    }
  }, 220);
}
</script>
