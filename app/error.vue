<template>
  <div class="over">
    <HeaderComp />
    <div class="error-layout all">
      <div class="page-error">
        <div v-if="false" class="page-error__code">
          {{ error?.statusCode }}
        </div>
        <div v-if="error?.statusCode === 404" class="page-error__info">
          <div class="page-error__title h2-title">Упс... страница не найдена</div>
          <div class="page-error__info-block">
            <div v-show="error?.statusCode === 404" class="img">
              <img src="/img/red/error404.svg" alt="" >
            </div>
            <div class="b-btn">
              <NuxtLink class="btn" to="/">На главную</NuxtLink>
            </div>
          </div>
        </div>
        <div v-else-if="error?.statusCode === 500" class="page-error__info">
          <div class="page-error__title h2-title">Упс... Ошибка 500 (Internal Server Error)</div>
          <div class="page-error__info-block">
            <div class="b-btn">
              <NuxtLink class="btn" to="/">На главную</NuxtLink>
            </div>
          </div>
        </div>

        <div v-if="false" v-show="error?.statusCode !== 404" class="page-error__info">
          <div class="page-error__info-message">
            {{ error?.message }}
          </div>
        </div>
        <div class="page-error__bottom-img">
          <img src="/img/red/mountains.svg" alt="" >
        </div>
      </div>
    </div>
    <FooterComp />
  </div>
</template>

<script setup lang="ts">
const error = useError();

// Убеждаемся, что error существует
if (!error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Unknown error',
  });
}
</script>
