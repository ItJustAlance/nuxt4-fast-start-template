<template>
  <div class="document-item">
    <div class="document-item__body">
      <div class="text">
        <div class="doc-title">{{ title }}</div>
        <div v-if="description" class="doc-desc">{{ description }}</div>
      </div>
    </div>
    <div class="action-box">
      <button class="btn btn--inline btn-delete" @click="onDelete">
        <SvgIcon name="trash" class="fnone ic20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  onDelete: Function, // передаем функцию для удаления
})
</script>
