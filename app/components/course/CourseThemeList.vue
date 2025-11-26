<script setup lang="ts">
import { ref, computed, withDefaults, defineProps, defineEmits } from 'vue';
import CourseThemeItem from './CourseThemeItem.vue';

// Пропсы
const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    disabled?: boolean;
  }>(),
  {
    modelValue: () => [],
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void;
}>();

const themes = computed<string[]>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const nextThemeNumber = computed(() => themes.value.length + 1);
const showAddInput = ref(false);
const newThemeTitle = ref('');

function deleteDocument(i: number) {
  themes.value = themes.value.filter((_, idx) => idx !== i);
}

function addNewTheme() {
  const t = newThemeTitle.value.trim();
  if (!t) return;
  themes.value = [...themes.value, t];
  newThemeTitle.value = '';
  showAddInput.value = false;
}
</script>

<template>
  <div v-if="themes.length > 0 || !props.disabled" class="list-documents">
    <CourseThemeItem
      v-for="(doc, i) in themes"
      :key="i"
      :title="doc"
      :on-delete="!props.disabled ? () => deleteDocument(i) : undefined"
    />
    
    <div v-if="showAddInput && !props.disabled" class="list-documents__row --row-add">
      <div class="document-item__add">
        <div class="document-item__add-title">Тема {{ nextThemeNumber }}</div>
        <div class="document-item__add-field">
          <div class="b-input">
            <input
              v-model="newThemeTitle"
              type="text"
              class="input"
              placeholder="Введите название темы"
            />
          </div>
          <button class="btn-add" @click="addNewTheme">
            <SvgIcon name="check" class="fnone --stroke ic20" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!props.disabled" class="list-documents__bottom">
      <button class="btn btn--link" @click="showAddInput = true">
        <SvgIcon name="plus-circle" class="fnone ic16" />
        <span class="btn-label">Добавить тему</span>
      </button>
    </div>
  </div>
  
  <div v-else>
    <p>Нет тем для отображения</p>
  </div>
</template>
