<script lang="ts" setup>
import appUtils from '~/utils/appUtils';

const props = defineProps({
  title: { type: String, default: '' },
  filterName: { type: String, default: '' },
  filters: { type: Array, default: () => [] },
  searchable: { type: Boolean, default: false },
  showAll: { type: Boolean, default: false },
  showToggle: { type: Boolean, default: false },
  sliderData: { type: Boolean, default: false },
  filterResultData: { type: Array, default: () => [] }, // выбранные фильтры из store
  showFull: { type: Array, default: () => [] },
});

const emit = defineEmits(['update-filter-data', 'init-filter-update']);

const isShow = ref(false);
const searchQuery = ref('');
const showAllFilters = ref(false);
const sliderDataResult = ref([2, 400]);
const localValues = reactive({});

/** Нормализует элементы, приходящие из store/parent
 * Поддерживает {_custom: { value: {...} }} и плоский формат {id, value, ...}
 */
function normalizeIncoming(arr: any[]): Array<Record<string, any>> {
  if (!Array.isArray(arr)) return [];
  return arr.map((it) => {
    if (it && it._custom && it._custom.value) return { ...it._custom.value };
    return { ...it };
  });
}

// Сбрасывает localValues в дефолты из props.filters
function resetLocalValues() {
  // очистим объект reactive
  Object.keys(localValues).forEach((k) => {
    delete (localValues as any)[k];
  });

  // выставим дефолты из props.filters
  props.filters.forEach((f: any) => {
    (localValues as any)[f.id] = f.hasOwnProperty('value') ? f.value : false;
  });

  // сброс/инициализация слайдера
  if (props.sliderData) {
    const sliderTo = props.filters.find((el: any) => el.pos === 'to' || el.type === 'to');
    const sliderFrom = props.filters.find((el: any) => el.pos === 'from' || el.type === 'from');
    const toVal = sliderTo?.value ?? sliderTo?.default ?? 0;
    const fromVal = sliderFrom?.value ?? sliderFrom?.default ?? 0;
    sliderDataResult.value = [toVal, fromVal];
  }
}

const initFilterResultData = () => {
  // загрузка ранее выбранных значений
  props.filters.forEach((f: any) => {
    if (!(f.id in localValues)) {
      // если filter.value задан — используем его как дефолт, иначе false
      localValues[f.id] = f.value ?? false;
    }
  });

  const normalized = normalizeIncoming(props.filterResultData || []);
  normalized.forEach((f) => {
    if (f?.id !== undefined) {
      localValues[f.id] = f.value;
    }
  });

  // раскрыты всегда все значения
  showAllFilters.value = !!props.showAll;

  // передача данных слайдеру
  if (props.sliderData) {
    const sliderTo = props.filters.find((el: any) => el.pos === 'to' || el.type === 'to');
    const sliderFrom = props.filters.find((el: any) => el.pos === 'from' || el.type === 'from');

    const toVal = sliderTo?.value ?? sliderTo?.default ?? 0;
    const fromVal = sliderFrom?.value ?? sliderFrom?.default ?? 0;

    sliderDataResult.value = [toVal, fromVal];
  }
};

const filteredFilters = computed(() => {
  return props.filters.filter((filter) => filter.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const displayedFilters = computed(() => {
  if (showAllFilters.value) {
    return filteredFilters.value;
  } else {
    return filteredFilters.value.slice(0, 4);
  }
});

onMounted(() => {
  initFilterResultData();
});

const updateFilterData = (id, value) => {
  localValues[id] = value;
  const filter = props.filters.find((filter) => filter.id === id) ?? { id, name: String(id) };
  const payload = {
    ...filter,
    filterTitle: props.title,
    value,
  };

  emit('update-filter-data', payload, props.filterName, id, value);
};

const onShow = () => {
  // console.log('onShow');
  isShow.value = !isShow.value;
};

watch(
  () => props.filters,
  (newFilters) => {
    newFilters.forEach((filter) => {
      if (!(filter.id in localValues)) {
        localValues[filter.id] = filter.value ?? false;
      }
    });
  },
  { deep: true, immediate: true },
);

watch(
  sliderDataResult,
  (newVal) => {
    if (!props.sliderData) return;
    const sliderTo = props.filters.find((el: any) => el.pos === 'to' || el.type === 'to');
    const sliderFrom = props.filters.find((el: any) => el.pos === 'from' || el.type === 'from');

    if (sliderTo && sliderTo.id !== undefined) {
      updateFilterData(sliderTo.id, newVal[0]);
    }
    if (sliderFrom && sliderFrom.id !== undefined) {
      updateFilterData(sliderFrom.id, newVal[1]);
    }
  },
  { deep: true },
);

watch(
  () => props.filterResultData,
  (newVal) => {
    // нормализуем входящие выбранные значения
    const normalized = normalizeIncoming(newVal || []);
    // создаём Map id -> value для удобства
    const selectedMap = new Map<string, any>();
    normalized.forEach((f) => {
      if (f?.id !== undefined) selectedMap.set(String(f.id), f.value);
    });

    // Обновляем localValues для всех известных фильтров:
    // - если id есть в selectedMap => ставим его значение
    // - иначе => ставим дефолт из props.filters (или false)
    props.filters.forEach((f: any) => {
      const key = String(f.id);
      if (selectedMap.has(key)) {
        localValues[key] = selectedMap.get(key);
      } else {
        localValues[key] = f.hasOwnProperty('value') ? f.value : false;
      }
    });

    // если нет ни одного выбранного элемента — можно дополнительно очистить те ключи,
    // которые больше не присутствуют в props.filters (чтобы не оставалось "мусора")
    if (!Array.isArray(normalized) || normalized.length === 0) {
      // удалить лишние ключи (если у localValues есть ключи, которых нет в props.filters)
      const allowedKeys = new Set(props.filters.map((f: any) => String(f.id)));
      Object.keys(localValues).forEach((k) => {
        if (!allowedKeys.has(k)) {
          delete (localValues as any)[k];
        }
      });
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div data-tour="showEventFilter" class="box-filter">
    <div class="title">
      {{ title }}
    </div>
    <div class="title --mobile" @click="onShow">
      {{ title }}
      <SvgIcon name="menu-arr" class="ic16"></SvgIcon>
    </div>
    <div class="box-filter-body" :class="{ active: isShow }">
      <div v-if="searchable" class="box-filter__search">
        <div v-if="filters.length > 4" class="b-input">
          <input v-model="searchQuery" type="text" placeholder="Поиск" class="b-input__input" />
        </div>
      </div>
      <div class="filter-list" :class="{ '--open': showAllFilters }">
        <div v-for="filter in displayedFilters" :key="filter.id" class="filter-item">
          <div v-if="filter.type !== 'slider'" class="b-checkbox">
            <Checkbox
              :model-value="localValues[filter.id]"
              :binary="true"
              :input-id="filter.id"
              :name="filter.name"
              @update:model-value="(val) => updateFilterData(filter.id, val)"
            />
            <label :for="filter.id">{{ appUtils.decodeAndSanitizeHtml(filter.name) }}</label>
          </div>
        </div>
      </div>
      <div v-if="showToggle && filters.length > 4 && searchQuery === ''" class="row-toggle">
        <button
          class="btn btn--inline btn-toggle"
          :class="{ '--active': showAllFilters }"
          @click="showAllFilters = !showAllFilters"
        >
          <span class="btn-label">{{ showAllFilters ? 'Скрыть' : `Показать еще ${filters.length - 4}` }}</span>
          <SvgIcon name="caret-circle-down" class="fnone ic24"></SvgIcon>
        </button>
      </div>
      <div v-if="sliderData" class="filter-slider">
        <div class="filter-row">
          <div class="filter-col1">
            <div class="slider__slider">
              <Slider v-model="sliderDataResult" :min="0" :max="250" range />
            </div>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-col2">
            <div class="title-inp">От</div>
            <InputText v-model.number="sliderDataResult[0]" />
          </div>
          <div class="filter-col2">
            <div class="title-inp">До</div>
            <InputText v-model.number="sliderDataResult[1]" />
          </div>
        </div>
      </div>
    </div>

    <!--end filter-slider-->
  </div>
</template>
