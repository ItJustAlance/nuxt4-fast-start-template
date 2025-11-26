<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { reactive, ref } from "vue";
import { useModalStore } from "~/stores/modal";

const modalStore = useModalStore();

const isValid = ref(false);

const formData = reactive({
  currentPassword: null,
  cause: null
});

const errors = reactive({
  currentPassword: {
    message: 'Введите текущий пароль',
    status: false,
  },
});

function validateForm() {
  errors.currentPassword.status = !formData.currentPassword;

  isValid.value = Object.values(errors).every((e) => !e.status);
  return isValid.value;
}

function closeModal() {
  document.body.classList.remove('lock');
  document.body.classList.remove(modalStore.modalBodyClass);
  modalStore.toggleModal(false);
}

function submitForm() {
  if (!validateForm()) return;

  closeModal();
}
</script>

<template>
  <div class="modal-data-wrapper">
    <div class="modal-data-header">
      <div class="modal-data-header__title">Заявка на удаление профиля</div>
    </div>
    <div class="modal-data-content">
      <div class="form">
        <div class="form-row">
          <div class="c-md-1">
            <div class="form-item">
              <label for="" class="form-label">
                <span class="text">Текущий пароль</span>
              </label>
              <div class="form-input form-input_width">
                <input v-model="formData.currentPassword" type="password" class="input" >
              </div>
              <div v-if="errors.currentPassword.status" class="error-message">
                {{ errors.currentPassword.message }}
              </div>
            </div>
          </div>
        </div>
              <div class="form-row">
                <div class="c-md-1">
                  <div class="form-item">
              <label for="" class="form-label">
                <span class="text">Укажите причину удаления профиля (необязательно)</span>
              </label>
              <div class="form-input">
                <textarea v-model="formData.cause" type="" class="input" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-data-footer">
      <div class="modal-data-footer__btns">
        <button class="btn btn--square" @click="submitForm">Оставить заявку</button>
        <button class="btn btn--square btn--square-second" @click="closeModal">Отмена</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.form-input {
  &_width {
    max-width: 334px;
  }
}
.btn {
  &--square {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 400;
  }

  &--square-second {
    color: #717985;
    background-color: #FFF;
    border: 1px solid #BCC4CF;
  }
}

</style>
