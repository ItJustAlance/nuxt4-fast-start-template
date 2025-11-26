<script setup lang="ts">


</script>

<template>
  <div class="progress-filled">
    <div class="progress-filled-progress">
      <div class="progress-filled-progress__bar" style="width: 30%"></div>
    </div>
    <div class="progress-filled__proc">33%</div>
  </div><!--end progress-filled -->
</template>


<style lang="scss">

.progress-filled {
  display: flex;
  align-items: center;
  min-width: 120px;
  width: 100%;
  position: relative;
  gap: 4px;
  &-progress {
    flex: 1 1 auto;
    background: #BCC4CF;
    border-radius: 2px;
    &__bar {
      height: 6px;
      border-radius: 2px;
      background: #0C6BF2;
    }
  }
  &__proc {
    
  }
}
</style>
