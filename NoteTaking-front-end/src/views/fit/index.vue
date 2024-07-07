<script lang="ts" setup>
import Calendar from './components/Calendar.vue'
</script>

<template>
  <div class="fit">
    <div class="fit-list">
      <Calendar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fit {
  width: 100%;
  .fit-list {
    width: 100%;
    display: flex;
  }
}
</style>
