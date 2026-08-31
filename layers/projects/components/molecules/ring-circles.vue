<script setup lang="ts">
const { color, double = false } = defineProps<{
  /** Цвет колец */
  color: string;
  /** В макете часть колец продублирована — вдвое плотнее */
  double?: boolean;
}>();

// Диаметры колец из макета (сцена 518): каждое кольцо лежит поверх
// предыдущего с той же прозрачностью — к центру плотность растёт сама
const RINGS = [518, 448, 378.5, 308.5, 238.5, 168.5, 98];
</script>

<template>
  <svg
    class="ring-circles"
    viewBox="0 0 518 518"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      v-for="d in RINGS"
      :key="d"
      cx="259"
      cy="259"
      :r="d / 2"
      :fill="color"
      :opacity="double ? 0.2 : 0.1"
    />
  </svg>
</template>

<style scoped lang="scss">
.ring-circles {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
