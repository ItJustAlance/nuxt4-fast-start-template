<!-- ~/components/buttonModal.vue -->
<template>
  <div class="button-modal" @click="openModal">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useModalStore } from '~/stores/modal';

const props = defineProps({
  // Ключ (string) — имя компонента из modalComponentsMap
  modalLocalComponent: {
    type: String,
    default: null,
  },
  // Параметры, которые передадутся в динамический компонент
  modalLocalComponentParams: {
    type: [Object, Array],
    default: () => ({}),
  },
  // Доп. параметры для оформления модалки:
  compParams: {
    type: Object,
    default: () => ({}),
  },
});

const modalStore = useModalStore();

function openModal() {
  console.log('openModal');
  // Сбрасываем визуальное состояние, чтобы не наследовать правый режим
  modalStore.resetUi();
  // Открыть
  modalStore.toggleModal(true);
  // Установить компонент по ключу
  if (props.modalLocalComponent) {
    modalStore.setComponent(props.modalLocalComponent);
  }
  // Параметры компонента
  modalStore.setCurrentParams(props.modalLocalComponentParams);
  // Body-класс
  modalStore.setModalBodyClassFn(props.compParams.modalBodyClass || '');
  // Класс модалки
  modalStore.setModalClassFn(props.compParams.modalClass || '');
  // Класс компонента внутри модалки
  modalStore.setModalComponentClassFn(props.compParams.modalComponentClass || '');
  // Если нужно устанавливать видимость header/contentUp/contentDown, тоже:
  if (props.compParams.isModalHeaderVisibility !== undefined) {
    modalStore.setHeaderVisibility(!!props.compParams.isModalHeaderVisibility);
  }
  if (props.compParams.isModalContentUp !== undefined) {
    modalStore.setContentUpVisibility(!!props.compParams.isModalContentUp);
  }
  if (props.compParams.isModalContentDown !== undefined) {
    modalStore.setContentDownVisibility(!!props.compParams.isModalContentDown);
  }
  if (props.compParams.modalContentUpHtml !== undefined) {
    modalStore.setContentUpHtml(props.compParams.modalContentUpHtml);
  }
  if (props.compParams.modalContentDownHtml !== undefined) {
    modalStore.setContentDownHtml(props.compParams.modalContentDownHtml);
  }
}
</script>

<style scoped>
.button-modal {
  display: inline-flex;
  cursor: pointer;
  border: none;
  box-shadow: none;
  background: none;
  padding: 0;
}
</style>
