<script setup lang="ts">

</script>

<template>
  <div class="course-item-wrapper">
    <div class="course-item__header">
      <h3>
        Заголовок
      </h3>
    </div>

    <div class="course-item__bottom">
      <div class="course-item__raiting">
        <SvgIcon
          v-for="n in 5"
          :key="`star-${n}`"
          name="star"
          class="ic16 --stroke"
          :class="{ op30: n > 4 }"
        />
      </div>
      <div class="course-item__price">5 000 Р</div>
      
    </div>
    <!--end course-item__content -->
  </div>
</template>

<style lang="scss"></style>
