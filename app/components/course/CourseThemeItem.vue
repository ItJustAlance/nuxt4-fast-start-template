<template>
  <div class="document-item">
    <div class="document-item__body">
      <div class="text">
        <div class="doc-title">{{ title }}</div>
        <div v-if="description" class="doc-desc">{{ description }}</div>
      </div>
    </div>
    <div class="action-box">
      <button @click="onDelete" class="btn btn--inline btn-delete">
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
