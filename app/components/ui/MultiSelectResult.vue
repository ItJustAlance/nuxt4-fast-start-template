<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: 'name',
  },
  optionValue: {
    type: String,
    default: 'id',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// Получаем список выбранных объектов из всех options
const selectedItems = computed(() => {
  if (props.modelValue) {
    return props.options.filter((option) => props.modelValue.includes(option[props.optionValue]));
  } else {
    return [];
  }
});

// Удаление по значению
const removeItem = (val) => {
  const updated = props.modelValue.filter((v) => v !== val);
  emit('update:modelValue', updated);
};
</script>

<template>
  <div class="just-multiselect-result__wrapper">
    <div v-if="selectedItems.length" class="just-multiselect-result">
      <div v-for="item in selectedItems" :key="item[optionValue]" class="result-item">
        <div class="result-item-wrapper">
          <div class="text">
            {{ item[optionLabel] }}
          </div>
          <div v-if="!disabled" class="result-item__delete" @click="removeItem(item[optionValue])">
            <SvgIcon name="i-x" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
