<script setup lang="ts">
import { RING_SHAPES } from '@l-services/configs';
import type { RingColors, RingShape } from '@l-services/types';

const { shape, colors } = defineProps<{
  /** Фигура паттерна */
  shape: RingShape;
  /** Цвета градиента: по макету у каждой услуги свои */
  colors: RingColors;
}>();

const data = computed(() => RING_SHAPES[shape]);

const uid = useId();
</script>

<template>
  <!-- Кольца лежат в системе координат символа макета и масштабируются
       вместе с контейнером. Порядок от внешнего к ядру: по нему же
       фигура появляется (см. useFigureReveal). Прозрачность кольца задана
       через fill-opacity, чтобы не спорить с opacity, которую ведёт анимация -->
  <svg
    class="ring-pattern"
    :viewBox="`0 0 ${data.viewBox[0]} ${data.viewBox[1]}`"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        :id="`ring-pattern-${uid}`"
        :x1="data.gradient[0]"
        :y1="data.gradient[1]"
        :x2="data.gradient[2]"
        :y2="data.gradient[3]"
      >
        <stop offset="0" :stop-color="colors[0]" />
        <stop offset="1" :stop-color="colors[1]" />
      </linearGradient>
    </defs>
    <path
      v-for="ring in data.rings"
      :key="ring.path"
      data-ring
      :d="ring.path"
      :transform="`translate(${ring.x} ${ring.y})`"
      :fill="`url(#ring-pattern-${uid})`"
      :fill-opacity="data.opacity"
    />
  </svg>
</template>

<style scoped lang="scss">
.ring-pattern {
  display: block;
  width: 100%;
  height: auto;
}
</style>
