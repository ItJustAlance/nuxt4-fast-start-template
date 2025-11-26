<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { fetchPost } from '@/utils/fetchUtils';

// Определяем интерфейсы формы
interface FormData {
  email: string;
}

interface FormState {
  data: FormData;
  error: string;
}

const formUser = defineModel<FormData>('formUser');
const emit = defineEmits<{
  (event: 'update:formUser', value: FormData): void;
  (event: 'update:currentStep', value: number): void;
  (event: 'update:isCodeSend', value: boolean): void;
}>();

const toast = useToast();
const isValidForm = ref<boolean>(false);

// Создаем реактивную форму
const form = reactive<FormState>({
  data: {
    email: '',
    ...formUser?.value,
  },
  error: '',
});

// Самописный debounce-функция
// TODO: заменить на стандартную, см. новости
const debounce = <T extends (...args: any[]) => any>(fn: T, delay = 700) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Валидация email с debounce
const validateEmail = () => {
  if (!form.data.email) {
    form.error = 'Введите email.';
    isValidForm.value = false;
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(form.data.email)) {
    form.error = 'Введите корректный email.';
    isValidForm.value = false;
    return;
  }
  form.error = '';
  isValidForm.value = true;
};

// Обернутая в debounce функция
const onEmailInput = debounce(validateEmail);

// Функция отправки формы
const onSubmit = async (): Promise<void> => {
  try {
    form.error = ''; // Сбрасываем старую ошибку

    if (!isValidForm.value) return;

    const config = useRuntimeConfig();
    const result = await fetchPost(config.public.realApiUrl, `/register/user`, form.data, false);

    console.log('регистрация пользователя: ответ', result);
    if (result?.data?.id) {
      toast.add({ severity: 'success', summary: result.message || 'Регистрация начата, дождитесь кода', life: 3000 });
      emit('update:isCodeSend', true);
      emit('update:formUser', form.data);
      emit('update:currentStep', 2);
    } else {
      toast.add({ severity: 'error', summary: result?.message || 'Ошибка при регистрации', life: 3000 });
    }
  } catch (e: any) {
    console.error('Ошибка при регистрации', e);
    form.error = e?.message || 'Неизвестная ошибка';
    toast.add({ severity: 'error', summary: form.error, life: 3000 });
  }
};
</script>

<template>
  <div class="login --register">
    <div class="login-wrapper">
      <form @submit.prevent="onSubmit">
        <div class="form login-form">
          <!-- заголовок -->
          <div class="login-form__title h4-title">Создать аккаунт</div>

          <!-- регистрация через внешние сервисы типа dpomos -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="login__using">
                <div class="login__using-title">Зарегистрироваться через старый портал</div>
                <div class="login__using-btns">
                  <!-- регистрация через портал просто перебрасывает на вход через портал -->
                  <NuxtLink to="/login" class="btn btn--border link-dpomos">
                    <SvgIcon name="ic-dpomos" class="ic32"></SvgIcon>
                    <span class="btn-label">dpomos.ru</span>
                  </NuxtLink>
                  <!--
                  <NuxtLink to="#" class="btn btn--border link-mos">
                    <SvgIcon name="ic-mos" class="ic32"></SvgIcon>
                    <span class="btn-label">mos.ru</span>
                  </NuxtLink>
                  <NuxtLink to="#" class="btn btn--border link-myak">
                    <SvgIcon name="ic-myak" class="ic32"></SvgIcon>
                    <span class="btn-label">Маяк</span>
                  </NuxtLink>
                  -->
                </div>
              </div>
            </div>
          </div>

          <!-- почта -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="login__using">
                <div class="login__using-title">Зарегистрироваться через ДПО 2.0</div>
              </div>
              <div class="form-item">
                <label for="email" class="form-label">
                  <span class="text">Email</span>
                </label>
              </div>
              <div class="form-input">
                <InputText
                  id="email"
                  v-model="form.data.email"
                  placeholder="Введите email"
                  @input="onEmailInput"
                  @blur="validateEmail"
                />
                <Message v-if="form.error" severity="error" size="small" variant="simple">
                  {{ form.error }}
                </Message>
              </div>
            </div>
          </div>

          <div class="form-row pt16">
            <div class="c-md-1">
              <div class="b-btn">
                <button type="submit" :disabled="!isValidForm" class="btn btn-login">Отправить код с проверкой</button>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="c-md-1">
              <div class="login-links">
                Уже есть аккаунт?
                <NuxtLink class="bold" to="/login">Авторизоваться</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
