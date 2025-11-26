// ~/stores/modal.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  // state
  const isOpenState = ref(false);
  const modalComponentState = ref<string | null>(null); // строка-ключ или null
  const componentParamsState = ref<any>(null);
  const options = ref<any>(null); // Если нужно хранить доп. Options
  const modalEvent = ref<string | null>(null);

  const modalClass = ref<string>(''); // класс для внешнего .just-modal
  const modalComponentClass = ref<string>(''); // класс для динамического компонента
  const modalBodyClass = ref<string>('just-modal--default'); // класс для <body> при открытой модалке
  const _currentBodyClass = ref<string>('');

  const isModalHeaderVisibility = ref<boolean>(false);
  const isModalContentUp = ref<boolean>(false);
  const isModalContentDown = ref<boolean>(false);
  const modalContentUpHtml = ref<string | null>(null);
  const modalContentDownHtml = ref<string | null>(null);

  function triggerEvent(name: string) {
    modalEvent.value = name;
    // Сбрасываем спустя мгновение, чтобы можно было ловить повторно
    setTimeout(() => (modalEvent.value = null), 0);
  }

  function _applyBodyClass(next: string) {
    // снять предыдущий (если был)
    if (_currentBodyClass.value) {
      document.body.classList.remove(_currentBodyClass.value);
      _currentBodyClass.value = '';
    }
    // поставить новый (если задан)
    if (next) {
      document.body.classList.add(next);
      _currentBodyClass.value = next;
    }
    modalBodyClass.value = next || 'just-modal--default';
  }

  /** Сброс только UI-параметров (без componentKey/params) */
  function resetUi() {
    modalClass.value = '';
    modalComponentClass.value = '';
    isModalHeaderVisibility.value = false;
    isModalContentUp.value = false;
    isModalContentDown.value = false;
    modalContentUpHtml.value = null;
    modalContentDownHtml.value = null;

    // вернуть дефолтный режим и очистить body
    _applyBodyClass(''); // снимет класс с body
    modalBodyClass.value = 'just-modal--default';
  }

  // actions / methods
  function toggleModal(isOpen: boolean) {
    isOpenState.value = isOpen;
  }
  function setComponent(componentKey: string | null) {
    console.log('componentKey', componentKey);
    modalComponentState.value = componentKey;
  }
  function setCurrentParams(params: any) {
    componentParamsState.value = params;
  }
  function setOptions(opts: any) {
    options.value = opts;
  }
  function setModalBodyClassFn(bodyClass: string) {
    _applyBodyClass(bodyClass || 'just-modal--default');
  }
  function setModalComponentClassFn(compClass: string) {
    modalComponentClass.value = compClass || '';
  }
  function setModalClassFn(cls: string) {
    modalClass.value = cls || '';
  }
  function setHeaderVisibility(val: boolean) {
    isModalHeaderVisibility.value = val;
  }
  function setContentUpVisibility(val: boolean) {
    isModalContentUp.value = val;
  }
  function setContentDownVisibility(val: boolean) {
    isModalContentDown.value = val;
  }
  function setContentUpHtml(html: string | null) {
    modalContentUpHtml.value = html;
  }
  function setContentDownHtml(html: string | null) {
    modalContentDownHtml.value = html;
  }
  function resetModal() {
    console.log('resetModal');
    isOpenState.value = false;
    modalComponentState.value = null;
    componentParamsState.value = null;
    options.value = null;
    resetUi();
  }

  return {
    // state
    isOpenState,
    modalComponentState,
    componentParamsState,
    options,
    modalClass,
    modalComponentClass,
    modalBodyClass,
    isModalHeaderVisibility,
    isModalContentUp,
    isModalContentDown,
    modalContentUpHtml,
    modalContentDownHtml,
    // actions
    toggleModal,
    setComponent,
    setCurrentParams,
    setOptions,
    setModalBodyClassFn,
    setModalComponentClassFn,
    setModalClassFn,
    setHeaderVisibility,
    setContentUpVisibility,
    setContentDownVisibility,
    setContentUpHtml,
    setContentDownHtml,
    resetModal,
    // вспомогательный сброс UI
    resetUi,
    modalEvent,
    triggerEvent,
  };
});
