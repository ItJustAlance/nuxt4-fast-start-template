<template>
  <div class="login --register-verify">
    <div class="login-wrapper">
      <form @submit.prevent="onSubmit">
        <div class="form login-form">
          <div class="login-form__title h4-title">
            Верификация аккаунта
            <div class="text">Введите код, отправленный на ваш почтовый адрес или номер телефона</div>
          </div>
          <div class="form-row">
            <div class="c-md-1">
              <div class="form-item">
                <label for="code" class="form-label">
                  <span class="text">Код</span>
                </label>
              </div>
              <div class="form-input">
                <InputOtp v-model="code" :length="6" class="custom-otp-input-wrapper">
                  <template #default="{ attrs, events, index }">
                    <input type="text" v-bind="attrs" class="custom-otp-input" v-on="events" >
                    <div v-if="index === 3" class="custom-otp-input-tire">-</div>
                  </template>
                </InputOtp>
              </div>
            </div>
          </div>
          <div class="login-form__bottom">
            <div class="form-row pt16">
              <div class="c-md-1">
                <div class="b-btn">
                  <button type="submit" :disabled="code.length !== 6" class="btn btn-login">Проверить</button>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="c-md-1">
                <div class="login-links">
                  Не пришел код?
                  <button type="button" class="link-link" @click="resendCode"><strong>Отправить
                      повторно</strong></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { defineEmits, ref } from 'vue';
import { fetchPost } from "@/utils/fetchUtils";
import { useAuthStore } from "~/stores/auth";

const { authenticateUser } = useAuthStore();

const emit = defineEmits<{
  (event: 'update:currentStep', value: number): void;
}>();

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const toast = useToast();
const code = ref('');

const onSubmit = async () => {
  if (code.value.length !== 6) {
    toast.add({ severity: 'error', summary: 'Введите 6-значный код.', life: 3000 });
    return;
  }
  try {
    const config = useRuntimeConfig();
    const result = await fetchPost(config.public.realApiUrl, '/register/user/verify', { email: props.email, code: code.value }, false);
    
    if (result?.data?.token) {
      console.log("авторизация: вход по коду успешен", result);

      // сохраняем полученного пользователя и токен в свои хранилища
      const token = useCookie('token');
      token.value = result.data.token;
      const authStore = useAuthStore();
      authStore.authenticated = true;
      authStore.userData = result.data;
      authStore.idUser = result.data.id;
      const authUser = useAuthUser();
      authUser.value = authStore.userData;

      toast.add({ severity: 'success', summary: result.message, life: 3000 });
      emit('update:currentStep', 3);
    } else {
      console.error("авторизация: не удалось войти по коду", result);
      toast.add({ severity: 'error', summary: 'Ошибка верификации - проверьте код', life: 3000 });
    }
  } catch (e) {
    console.error("авторизация: неизвестная ошибка", e);
    toast.add({ severity: 'error', summary: 'Ошибка верификации - неизвестная ошибка', life: 3000 });
  }
};

const resendCode = async () => {
  try {
    const config = useRuntimeConfig();
    await fetchPost(config.public.realApiUrl, `/register/user`, { email: props.email }, false);
    toast.add({ severity: 'success', summary: 'Код отправлен повторно.', life: 3000 });
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Ошибка отправки кода.', life: 3000 });
  }
};
</script>
