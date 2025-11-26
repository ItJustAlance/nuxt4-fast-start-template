<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { ref, reactive, defineProps, defineEmits, watchEffect } from 'vue';
import { fetchPost } from '@/utils/fetchUtils';
import { useAuthStore } from '~/stores/auth';
import { useAuthUser } from '~/composables/useAuthUser';

const { authenticateUser } = useAuthStore();
const props = defineProps(['formUser', 'currentStep']);
const emit = defineEmits(['update:formUser', 'update:currentStep']);

const toast = useToast();

const isValidForm = ref(false);

const form = reactive({
  data: { ...props.formUser },
  errors: {},
});

// Автоматическая валидация при изменении любого поля
watchEffect(() => {
  form.errors = {};

  if (!form.data.email) {
    form.errors.email = 'Введите email.';
  } else if (!/^\S+@\S+\.\S+$/.test(form.data.email)) {
    form.errors.email = 'Введите корректный email.';
  }

  if (!form.data.lastName) form.errors.lastName = 'Введите фамилию.';
  if (!form.data.firstName) form.errors.firstName = 'Введите имя.';
  if (!form.data.middleName) form.errors.middleName = 'Введите отчество.';
  if (!form.data.password || form.data.password.length < 6) {
    form.errors.password = 'Пароль должен содержать минимум 6 символов.';
  }
  if (!form.data.soglasie) {
    // form.errors.soglasie = "Вы должны дать согласие.";
  } else {
    // delete form.errors.soglasie;
  }

  isValidForm.value = Object.keys(form.errors).length === 0;
});

// Сохраняем данные в `registration.vue`
watchEffect(() => {
  emit('update:formUser', { ...form.data });
});

const onSubmit = async () => {
  if (!isValidForm.value) {
    toast.add({ severity: 'error', summary: 'Исправьте ошибки в форме.', life: 3000 });
    return;
  }

  try {
    const config = useRuntimeConfig();
    const router = useRouter();
    const route = useRoute();
    const result: any = await fetchPost(config.public.realApiUrl, '/profile', form.data, false);
    console.log('result auth', result);

    if (result) {
      const authStore = useAuthStore();

      // TODO: сделать код общим
      authStore.authenticated = true;
      authStore.userData = result.data;
      authStore.idUser = result.data.id;
      const authUser = useAuthUser();
      authUser.value = authStore.userData;

      toast.add({ severity: 'success', summary: result.message || 'Успешная регистрация', life: 3000 });
      // зарегистрировались, можно вернуться назад
      if (route.query.redirect) {
        router.push(decodeURIComponent(route.query.redirect as string));
      } else {
        router.push('/');
      }
      // emit("update:currentStep", 4); // переход на следующий шаг, если нужно
    } else {
      toast.add({
        severity: 'warn',
        summary: result.message || 'Не удалось авторизоваться после регистрации',
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: error.message || 'Ошибка регистрации. Попробуйте снова.', life: 3000 });
    console.error('Registration error', error);
  }
};
</script>

<template>
  <div class="login --register-form">
    <div class="login-wrapper">
      <form @submit.prevent="onSubmit">
        <div class="form login-form">
          <div class="login-form__title h4-title">
            Мы хотим узнать вас получше
            <div class="text">Заполните поля ниже</div>
          </div>

          <!-- Email -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="form-item">
                <label for="email" class="form-label">Электронная почта</label>
              </div>
              <div class="form-input">
                <InputText id="email" v-model="form.data.email" name="email" placeholder="Введите email" />
                <!-- Message v-if="form.errors.email" severity="error" size="small">{{ form.errors.email }}</Message -->
              </div>
            </div>
          </div>

          <!-- Фамилия -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="form-item">
                <label for="lastName" class="form-label">Фамилия</label>
              </div>
              <div class="form-input">
                <InputText id="lastName" v-model="form.data.lastName" placeholder="Введите фамилию" />
                <!-- Message v-if="form.errors.lastName" severity="error" size="small">{{ form.errors.lastName }}</Message !-->
              </div>
            </div>
          </div>

          <!-- Имя -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="form-item">
                <label for="firstName" class="form-label">Имя</label>
              </div>
              <div class="form-input">
                <InputText id="firstName" v-model="form.data.firstName" placeholder="Введите имя" />
                <!-- Message v-if="form.errors.firstName" severity="error" size="small">{{ form.errors.firstName }}</Message -->
              </div>
            </div>
          </div>

          <!-- Отчество -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="form-item">
                <label for="middleName" class="form-label">Отчество</label>
              </div>
              <div class="form-input">
                <InputText id="middleName" v-model="form.data.middleName" placeholder="Введите отчество" />
                <!-- Message v-if="form.errors.middleName" severity="error" size="small">{{ form.errors.middleName }}</Message -->
              </div>
            </div>
          </div>

          <!-- Пароль -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="form-item">
                <label for="password" class="form-label">Пароль</label>
              </div>
              <div class="form-input">
                <Password
                  v-model="form.data.password"
                  toggle-mask
                  prompt-label="Введите пароль"
                  weak-label="Слишком простой"
                  medium-label="Средняя сложность"
                  strong-label="Хороший пароль"
                />

                <!-- Message v-if="form.errors.password" severity="error" size="small">{{ form.errors.password }}</Message -->
              </div>
            </div>
          </div>

          <!-- Согласие на обработку данных -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="box-checkbox">
                <Checkbox v-model="form.data.soglasie" input-id="checkSoglasie" binary />
                <label class="fwb" for="checkSoglasie">
                  Даю согласие на обработку <a href="#" target="_blank">Персональных данных</a> и соглашаюсь с
                  <a href="#" target="_blank">Политикой конфиденциальности</a>
                </label>
              </div>
              <Message v-if="form.errors.soglasie" severity="error" size="small">{{ form.errors.soglasie }}</Message>
            </div>
          </div>

          <!-- Подписка на рассылку -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="box-checkbox">
                <Checkbox v-model="form.data.subscribe" input-id="checkSubscribe" binary />
                <label class="fwb" for="checkSubscribe">Подписаться на рассылку</label>
              </div>
            </div>
          </div>

          <!-- Кнопка "Создать личный кабинет" -->
          <div class="form-row pt16">
            <div class="c-md-1">
              <div class="b-btn">
                <button type="submit" :disabled="!isValidForm" class="btn btn-login">Создать личный кабинет</button>
              </div>
            </div>
          </div>

          <!-- Кнопка "Назад" -->
          <div class="form-row">
            <div class="c-md-1">
              <div class="login-links">
                <button class="btn btn--second" @click="$emit('update:currentStep', 2)">Назад</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
