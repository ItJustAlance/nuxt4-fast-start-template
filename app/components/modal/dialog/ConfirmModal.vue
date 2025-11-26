<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { useModalStore } from '~/stores/modal';
import { useDirectorStore } from '~/stores/directorStore';
const modalStore = useModalStore();
const directorStore = useDirectorStore();
interface PopupProps {
  teacherName: string;
  userUuid: string;
  orgDirUuid: string;
}

const props = defineProps<PopupProps>();

const toast = useToast();

// закрываем через метод в store для управления модальным окном
const close = () => {
  modalStore.toggleModal(false);
  modalStore.resetModal();
};

const handleReadMore = async () => {
  try {
    const result = await directorStore.onDeleteEmployee(props.orgDirUuid, props.userUuid);
    if (result.status) {
      toast.add({ severity: 'success', summary: result.message, life: 3000 });
      close();
    } else {
      toast.add({ severity: 'error', summary: result.message, life: 3000 });
    }
  } catch (e) {
    console.log('e');
  }
};
</script>
<template>
  <div class="confirm-modal">
    <div class="confirm-modal-content">
      <div class="confirm-modal-content__img">
        <img src="/img/red/lamp.svg" alt="attention" >
      </div>

      <h2 class="confirm-modal-content__title">Вы уверены?</h2>
      <p class="confirm-modal-content__text">Вы собираетесь открепить преподавателя</p>
      <p class="confirm-modal-content__text_strong">{{ props.teacherName }}я</p>
      <p class="confirm-modal-content__text">
        от школы. <span class="confirm-modal-content__text_red">Это действие невозможно отменить. </span>
      </p>
    </div>
    <div class="confirm-modal-actions">
      <button class="btn btn--square" @click="handleReadMore">Да, убрать из сотрудников</button>
      <button class="btn--square btn--square-second" @click="close">Отмена</button>
    </div>
  </div>
</template>

<style lang="scss">
.modal-confirm-wrapper {
  display: flex;
  flex-direction: column;
}

.just-modal.--confirmModal {
  .just-modal {
    &__body {
      padding: 0;
    }
  }
}

.confirm-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 560px;
  width: 100%;
  overflow: visible;
}

.confirm-modal-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 62px 20px 20px 20px;
  line-height: 1.5;
  color: #333;
  flex: 1 1 auto;

  @media (max-width: 430px) {
    padding: 62px 12px 20px 12px;
    gap: 16px;
  }

  &__img {
    display: flex;
    justify-content: center;
  }

  &__title {
    display: flex;
    justify-content: center;
    padding: 0;
    font-size: 22px;
    font-weight: 500;
    line-height: 36px;
    color: #000000;
    @media (max-width: 430px) {
      font-size: 16px;
      line-height: 1.1;
    }
  }

  &__text {
    text-align: center;
    position: relative;
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 18px;
    z-index: 1;

    @media (max-width: 430px) {
      font-size: 14px;
    }
    &_strong {
      margin: 0;
      padding: 0;
      font-size: 20px;
      text-align: center;
      font-weight: 700;
    }
    &_red {
      color: #e51740;
    }
  }
}

.confirm-modal-actions {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 16px 40px;
  gap: 15px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.12);

  @media (max-width: 430px) {
    padding: 10px 20px;
    flex-direction: column;
  }
}

.btn {
  &--square {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
  }

  &--square-second {
    color: #717985;
    background-color: #fff;
    border: 1px solid #bcc4cf;
  }
}

// Анимации
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
</style>
