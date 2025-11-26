<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '~/stores/auth';
import { useAuthUser } from '~/composables/useAuthUser';
import { type TCourseItem, getCourseItemPriceView } from '~/types/public/TCourse';
import type { Application } from '~/types/types';
import { useMyApplications } from '~/composables/useMyApplications';
import { useMyFavoriteCourses } from '~/composables/useMyFavoriteCourses';
import ButtonModal from '~/components/modal/ButtonModal.vue';
import appUtils from '~/utils/appUtils';
import { fetchPost } from '@/utils/fetchUtils';
import type { TPaymentResponse } from '@/types/TResponsePays';

const toast = useToast();

const universityId = 118; // 118 = Корпоративный университет

const props = withDefaults(
  defineProps<{ item: TCourseItem; showPayButton?: boolean; showConfirmedButton?: boolean, onlyPayable?: boolean }>(),
  {
    showPayButton: false, // показать кнопку оплаты
    showConfirmedButton: false, // запись подтверждена
    onlyPayable: false, // блок курсов находится в вкладке "ждут оплаты"
  },
);

const emit = defineEmits<{
  (e: 'pay', item: TCourseItem): void;
}>();

const checkSoglasie = ref(true);

// watchEffect(() => {
//   isPaid.value = Boolean((props.item)?.isPaid === true);
// });

const onPay = async () => {
  if (!checkSoglasie.value) {
    toast.add({
      severity: 'warn',
      summary: 'Необходимо согласие',
      detail: 'Пожалуйста, подтвердите согласие с условиями договора оферты',
      life: 3000,
    });
    return;
  }

  if (!props.item?.applicationId) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не найдена заявка для оплаты',
      life: 3000,
    });
    return;
  }

  try {
    const params = { applicationId: props.item.applicationId, consentServices: true };
    const config = useRuntimeConfig();
    const result = await fetchPost<TPaymentResponse>(config.public.realApiUrl, '/payments/register', params, true);

    if (!result) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось получить ответ от сервера',
        life: 3000,
      });
      return;
    }

    if (result.success && result.applicationStatus === 'rejected') {
      toast.add({
        severity: 'error',
        summary: 'Заявка отклонена',
        detail: result?.message || 'Заявка была отклонена',
        life: 3000,
      });
      return;
    }

    if (
      result.success &&
      result.applicationId === props.item.applicationId &&
      result.applicationStatus !== 'rejected' &&
      result.payment?.formUrl
    ) {
      window.open(result.payment.formUrl, '_blank');
      emit('pay', props.item);
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Внимание',
        detail: 'Не удалось получить ссылку на оплату. Попробуйте позже.',
        life: 3000,
      });
    }
  } catch (e: any) {
    let errorMessage = 'Неизвестная ошибка';
    let errorCode: number | null = null;

    try {
      // fetchPost бросает ошибку как JSON.stringify(error.data)
      const errorStr = e?.message || String(e);
      const parsed = JSON.parse(errorStr);

      if (parsed?.data) {
        errorCode = parsed.data.code || parsed.statusCode || null;
        errorMessage = parsed.data.message || parsed.message || errorMessage;
      } else if (parsed?.message) {
        errorMessage = parsed.message;
        errorCode = parsed.code || parsed.statusCode || null;
      }
    } catch {
      // Если не удалось распарсить, используем исходное сообщение
      errorMessage = e?.message || String(e) || errorMessage;
    }

    // Специальная обработка для ошибки 422
    if (errorCode === 422) {
      toast.add({
        severity: 'warn',
        summary: 'Оплата недоступна',
        detail: errorMessage || 'Оплата по заявке не требуется или уже обработана',
        life: 5000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Ошибка оплаты',
        detail: errorMessage,
        life: 5000,
      });
    }
  }
};

const authStore = useAuthStore();
const currentUser = useAuthUser();
const { isVisibleInProfile } = storeToRefs(authStore);

const { applicationSendApply, applicationSendCancel, applicationFindByCourseId } = useMyApplications();
const { favoriteCoursesSendAdd, favoriteCoursesSendDelete, favoriteCoursesFindById, favoriteCoursesLoadData } =
  useMyFavoriteCourses();

const myAppToCourse = computed<Application>(() => applicationFindByCourseId(props.item?.id));
const isAddedToFavorite = computed<boolean>(() => favoriteCoursesFindById(props.item?.id));

const onSendCancel = () => {
  applicationSendCancel(props.item.id);
};

const onSendApply = () => {
  applicationSendApply(props.item.id);
};

const onFavoriteDelete = () => {
  favoriteCoursesSendDelete(props.item.id);
};

const onFavoriteAdd = () => {
  favoriteCoursesSendAdd(props.item.id);
};

const organizationId = computed(() => props.item?.organization?.id || null);
const isConsentModal = computed(() => organizationId.value === universityId);
const isAuthorized = computed(() => currentUser?.value);
const isOpen = computed(() => props.item?.open ?? true);

onMounted(() => {
  favoriteCoursesLoadData();
});
</script>

<template>
  <div class="course-item-wrapper">
    <div class="course-item__header">
      <NuxtLink :to="`/courses/${props.item?.id}`" class="course-item__org">{{
        props.item?.organization?.name
      }}</NuxtLink>
      <div class="course-item__code">
        <SvgIcon name="barcode" class="fnone ic16"/>
        {{ props.item?.code ? props.item?.code : 'без кода' }}
      </div>
      <h3>
        <NuxtLink :to="`/courses/${props.item?.id}`" class="course-item__title">{{
          appUtils.decodeAndSanitizeHtml(props.item?.educationalProgram?.name)
        }}</NuxtLink>
      </h3>
    </div>

    <div class="course-item__bottom">
      <div class="course-item__raiting">
        <SvgIcon
          v-for="n in 5"
          :key="`star-${props.item.id}-${n}`"
          name="star"
          class="ic16 --stroke"
          :class="{ op30: n > 4 }"
        />
      </div>
      <div class="course-item__price">{{ getCourseItemPriceView(props.item) }}</div>
      <div v-if="isVisibleInProfile" class="course-panel">
        <div
          v-if="!showConfirmedButton && showPayButton && item.paymentStatus !== 'completed'"
          class="course-panel-soglasie"
        >
          <div class="box-checkbox">
            <label class="fwb">
              <Checkbox v-model="checkSoglasie" binary />
              Я согласен с
              <a href="/files/public_offer_Corporate_University.pdf" target="_blank">Условиями договора оферты</a>
            </label>
          </div>
        </div>
        <div class="course-panel-bottom">
          <!-- После оплаты -->
          <button
            v-if="!showConfirmedButton && myAppToCourse && !showPayButton"
            class="btn btn--white2 btn--auto"
            @click="onSendCancel"
          >
            Отменить заявку
          </button>
          <button v-else-if="item.paymentStatus === 'completed'" class="btn btn--disabled-success btn--auto" disabled>
            Курс оплачен
          </button>
          <button
            v-else-if="!showConfirmedButton && showPayButton"
            :disabled="!checkSoglasie"
            class="btn btn--auto"
            data-tour="showTheApplication"
            @click="onPay"
          >
            Оплатить курс
          </button>

          <ButtonModal
            v-else-if="!showConfirmedButton && isOpen && isAuthorized"
            class="btn btn--auto --modal-reset"
            :modal-local-component="isConsentModal ? 'consentCertificateModal' : 'enrollmentConfirmationModal'"
            :comp-params="
              isConsentModal
                ? {
                    component: 'consentCertificateModal',
                    modalClass: '--consentCertificateModal',
                    bodyClass: 'just-modal--default',
                    componentClass: 'modal-consentCertificate-wrapper',
                  }
                : {
                    component: 'enrollmentConfirmationModal',
                    modalClass: '--confirmModal',
                    bodyClass: 'just-modal--default',
                    componentClass: 'modal-confirm-wrapper',
                  }
            "
            :modal-local-component-params="{
              courseTitle: props.item?.educationalProgram?.name || '',
              courseId: props.item?.id,
            }"
          >
            <button class="btn btn--border btn--auto" data-tour="showTheApplication">Подать заявку</button>
          </ButtonModal>

          <button
            v-else-if="!showConfirmedButton && isOpen"
            class="btn btn--border btn--auto"
            data-tour="showTheApplication"
            @click="onSendApply"
          >
            Подать заявку
          </button>
          <button v-else-if="showConfirmedButton" class="btn btn--disabled">Запись подтверждена</button>
          <button v-else class="btn btn--disabled">Запись закрыта</button>
          <button
            v-if="isAddedToFavorite"
            class="btn btn--border --btn-favorite --active"
            title="Убрать из избранного"
            @click="onFavoriteDelete"
          >
            <SvgIcon name="heart-straight" class="fnone ic24"/>
          </button>
          <button v-else class="btn btn--border --btn-favorite" title="Добавить в избранное" @click="onFavoriteAdd">
            <SvgIcon name="heart-straight" class="fnone ic24"/>
          </button>
        </div>
        <!-- если не находитс в вкладке "ждут оплаты" -->
        <div v-if="!showConfirmedButton && item.paymentStatus !== 'completed' && !props.onlyPayable" class="course-panel-payment">
          <button v-if="myAppToCourse && showPayButton" class="btn btn--white2 btn--auto" @click="onSendCancel">
            Отменить заявку
          </button>
          <ButtonModal
            v-else-if="isOpen && showPayButton"
            class="btn btn--auto --modal-reset"
            :modal-local-component="isConsentModal ? 'consentCertificateModal' : 'enrollmentConfirmationModal'"
            :comp-params="
              isConsentModal
                ? {
                    component: 'consentCertificateModal',
                    modalClass: '--consentCertificateModal',
                    bodyClass: 'just-modal--default',
                    componentClass: 'modal-consentCertificate-wrapper',
                  }
                : {
                    component: 'enrollmentConfirmationModal',
                    modalClass: '--confirmModal',
                    bodyClass: 'just-modal--default',
                    componentClass: 'modal-confirm-wrapper',
                  }
            "
            :modal-local-component-params="{
              courseTitle: props.item?.educationalProgram?.name || '',
              courseId: props.item?.id,
            }"
          >
            <button class="btn btn--border btn--auto" data-tour="showTheApplication">Подать заявку</button>
          </ButtonModal>
        </div>
      </div>
    </div>
    <!--end course-item__content -->
  </div>
</template>

<style lang="scss"></style>
