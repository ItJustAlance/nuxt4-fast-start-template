import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ToastService); // для useToast()
  nuxtApp.vueApp.component("Toast", Toast); // для <Toast />
});
