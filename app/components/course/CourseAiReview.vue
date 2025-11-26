<script lang="ts" setup>
import { computed, useAttrs } from 'vue';

// проп для контента
const { content } = defineProps<{ content: string }>();

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

// Уникальный id
const toggleId = computed(() => (attrs.id as string) || 'ai-toggle');
const bodyId = computed(() => `${toggleId.value}-body`);
</script>

<template>
  <section class="ai-card">
    <header class="ai-card__header">
      <h2 class="ai-card__title">Обзор от ИИ-ассистента</h2>
    </header>

    <!-- чекбокс с внешним/дефолтным id -->
    <input :id="toggleId" type="checkbox" class="ai-toggle" :aria-controls="bodyId" >

    <div :id="bodyId" class="ai-card__body" role="region">
      <div class="ai-card__inner">
        <!-- Контент -->
        <div class="ai-card__content" v-html="content"/>
        <slot />
      </div>
      <div class="ai-card__fade" aria-hidden="true"/>
    </div>
    <!-- Футер с кнопкой -->
    <footer class="ai-card__footer">
      <label class="ai-card__btn" :for="toggleId" role="button">
        <span class="ai-card__btn-icon" aria-hidden="true"/>
        <span class="label-collapsed">Развернуть анализ ИИ</span>
        <span class="label-opened">Свернуть анализ ИИ</span>
      </label>
      <!-- корпик -->
      <div class="ai-card__korpick">
        <NuxtImg
          src="/img/ai-review/korpik-ai.svg"
          alt="Корпик аи помощник"
          format="webp"
          quality="100"
          loading="lazy"
          sizes="129px"
        />
        <span class="ai-card__korpick-text">...</span>
      </div>
    </footer>
  </section>
</template>
