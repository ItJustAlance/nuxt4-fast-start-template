<script setup lang="ts">
import { computed } from 'vue';

type Option = { label: string; value: string | number };

const props = defineProps<{
  /** v-model */
  modelValue: string | number | null;
  /** список пунктов */
  options: Option[];
  /** имя радиогруппы (для форм и доступности) */
  name?: string;
  /** отключить всю группу */
  disabled?: boolean;
  /** класс-обёртка при необходимости достилизовать снаружи */
  class?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [string | number | null] }>();

const groupName = computed(() => props.name || `crg-${Math.random().toString(36).slice(2, 8)}`);

const onChange = (val: string | number) => emit('update:modelValue', val);
</script>

<template>
  <div class="crg" :class="[$attrs.class]">
    <label v-for="opt in options" :key="String(opt.value)" class="crg__item" :class="{ 'is-disabled': disabled }">
      <input
        class="crg__input"
        type="radio"
        :name="groupName"
        :value="opt.value"
        :checked="modelValue === opt.value"
        :disabled="disabled"
        @change="onChange(opt.value)"
      >
      <span class="crg__control" aria-hidden="true"/>
      <span class="crg__label">{{ opt.label }}</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.crg {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.crg__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.crg__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.crg__control {
  --size: 22px;
  --ring: 2px;
  --color: #e51740;

  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  box-sizing: border-box;
  border: var(--ring) solid var(--color);
  display: inline-grid;
  place-items: center;
  transition: box-shadow 0.2s ease;

  &::after {
    content: '';
    width: calc(var(--size) - 8px);
    height: calc(var(--size) - 8px);
    border-radius: 50%;
    background: transparent;
    transition: background 0.15s ease;
  }
}

.crg__input:checked + .crg__control::after {
  background: var(--color);
}

.crg__input:focus-visible + .crg__control {
  box-shadow: 0 0 0 3px rgba(229, 23, 64, 0.25);
}

.crg__label {
  font-size: 14px;
  line-height: 1.2;
  color: #383d45;
}
</style>
