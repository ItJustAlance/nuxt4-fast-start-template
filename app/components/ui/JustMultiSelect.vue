<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import clickOutSide from '@mahdikhashan/vue3-click-outside';

const props = defineProps({
  disabled: Boolean,
  list: {
    type: [Array, Object],
    default: () => [],
  },
  modelValue: {
    type: [Array, Object, String],
    default: () => [],
  },
  options: {
    type: [Array, Object],
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: 'Выберите один или несколько вариантов',
  },
  showResult: {
    type: Boolean,
    default: true,
  },
  valueName: {
    type: String,
    default: 'value',
  },
  titleName: {
    type: String,
    default: 'title',
  },
  titleNameFilter: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const vClickOutSide = clickOutSide;

const listResult = ref<any[]>([]);
const isOpen = ref(false);
const positionDropDown = ref('down');
const search = ref('');
const isInit = ref(false);
const select = ref<HTMLElement | null>(null);

const titleLabel = computed(() => (props.titleNameFilter.length > 0 ? props.titleNameFilter : props.titleName));

const filteredListResult = computed(() => {
  return props.list?.length
    ? props.list.filter((item) => item[props.titleName]?.toLowerCase().includes(search.value.toLowerCase()))
    : [];
});

watch(
  () => props.modelValue,
  (value) => {
    // listResult.value = value;
    listResult.value = Array.isArray(value) ? [...value] : [];
  },
  { immediate: true },
);

onMounted(() => {
  if (props.modelValue && Array.isArray(props.modelValue)) {
    props.modelValue.forEach((el) => check(el[props.valueName]));
  }
  isInit.value = true;
});

function check(val: any) {
  console.log('check', val);
  const index = listResult.value.findIndex((el) => el[props.valueName] === val);
  if (index !== -1) {
    listResult.value.splice(index, 1);
  } else {
    const found = props.list.find((el) => el[props.valueName] === val);
    if (found) listResult.value.push(found);
  }
  emit('update:modelValue', [...listResult.value]);
  emit('change', [...listResult.value]);
}

function checkSingle(val: any) {
  console.log('checkSingle');
  const found = props.list.find((el) => el[props.valueName] == val);
  listResult.value = found ? [found] : [];
  emit('update:modelValue', listResult.value);
  emit('change', listResult.value);
  close();
}

function isActive(item: any) {
  if (typeof listResult.value === 'object' && !Array.isArray(listResult.value)) {
    const tmp = listResult.value;
    listResult.value = [tmp];
  }
  return listResult.value.some((el) => el[props.valueName] === item[props.valueName]);
}

function open() {
  if (!props.disabled) {
    isOpen.value = true;
    isPosition();
  }
}

function close() {
  isOpen.value = false;
}

function clear() {
  isOpen.value = false;
  listResult.value = [];
  emit('update:modelValue', []);
  emit('change', []);
}

function isPosition() {
  const target = select.value;
  if (!target) return;
  const targetPosition = target.getBoundingClientRect();
  const windowBottom = window.scrollY + document.documentElement.clientHeight;
  if (window.scrollY + targetPosition.bottom > windowBottom - 300) {
    positionDropDown.value = 'top';
  } else {
    positionDropDown.value = 'down';
  }
}
</script>

<template>
  <div
    v-if="isInit"
    ref="select"
    v-click-out-side="close"
    class="just-multiselect"
    :class="[positionDropDown, { open: isOpen, '--disabled': disabled, '--single': options.single }]"
  >
    <div class="just-multiselect-wrapper">
      <div class="just-multiselect__label" @click="open">
        <div v-if="options?.icon" class="icon">
          <SvgIcon name="i-magnifyingGlass" title="" class="ic24" />
        </div>
        <div class="text">
          {{ placeholder }}
          <input v-model="search" type="text" class="input__search" >
        </div>
        <span class="search-clear" @click="search = ''">
          <SvgIcon name="i-x" title="" />
        </span>
        <div class="arr">
          <SvgIcon name="chevron-down" title="" />
        </div>
      </div>
      <div v-show="isOpen" class="just-multiselect__dropdown">
        <ul v-if="options?.single" class="just-multiselect__list">
          <li
            v-for="item in filteredListResult"
            :key="item.id"
            :class="{ active: isActive(item) }"
            class="just-multiselect__item"
            @clickto="checkSingle(item[valueName])"
          >
            <div class="text">{{ item[titleLabel] }}</div>
          </li>
        </ul>
        <ul v-else class="just-multiselect__list">
          <li
            v-for="item in filteredListResult"
            :key="item.id"
            :class="{ active: isActive(item) }"
            class="just-multiselect__item"
            @click.stop="check(item[valueName])"
          >
            <Checkbox
              v-model="listResult"
              style="pointer-events: none"
              click.stop
              :input-id="String(item.id)"
              :name="item.name"
              :value="item"
            />
            <label class="text" click.stop>{{ item[titleLabel] }}</label>
          </li>
        </ul>
        <div class="just-multiselect__dropdown-bottom">
          <button class="btn btn--second" @click="clear">Отмена</button>
          <button class="btn" @click="() => (isOpen = false)">ОК</button>
        </div>
      </div>
    </div>
    <div v-if="showResult" class="just-multiselect-result">
      <div v-for="item in listResult" :key="item[valueName]" class="result-item">
        <div class="result-item-wrapper">
          <div class="text">{{ item[titleLabel] }}</div>
          <div class="result-item__delete" @click="check(item[valueName])">
            <SvgIcon name="i-x" title="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Добавьте ваши стили здесь */
</style>
