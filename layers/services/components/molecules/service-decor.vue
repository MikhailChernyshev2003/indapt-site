<script setup lang="ts">
// Геометрию берём из общих данных фигур (src/data/shapes), где ими же
// пользуется морфинг на главной. Цвет из данных не нужен: фигуру красит
// услуга через currentColor
import shapes from '@/data/shapes/index';
import type { ServiceDecorLayer, ServiceDecorShape } from '@l-services/types';

const { shape = 'circle', layers = 7, offset = 12 } = defineProps<{
  /** Фигура из общих данных */
  shape?: ServiceDecorShape;
  /** Сколько слоёв рисовать, максимум — все семь из данных */
  layers?: number;
  /** На сколько процентов каждый следующий слой меньше предыдущего */
  offset?: number;
}>();

// Все фигуры в данных нарисованы в квадрате 174×174
const SHAPE_SIZE = 174;
const CENTER = SHAPE_SIZE / 2;

const round = (value: number) => Number(value.toFixed(3));

const shapeLayers = computed<ServiceDecorLayer[]>(() => Object.values(shapes[shape]));

const shapePath = computed(() => shapeLayers.value[0]?.path ?? '');

const decorLayers = computed(() => {
  const count = Math.min(Math.max(Math.trunc(layers), 0), shapeLayers.value.length);
  const step = 1 - Math.min(Math.max(offset, 0), 100) / 100;

  // В данных layer_1 самый плотный, и по макету он лежит в центре,
  // поэтому идём от внешнего слоя к внутреннему: внутренние рисуются позже
  // и накладываются поверх
  return shapeLayers.value
    .slice(0, count)
    .reverse()
    .map((layer, idx) => {
      // Уменьшаем относительно центра: сначала сдвиг, потом масштаб
      const scale = step ** idx;
      const shift = round(CENTER * (1 - scale));

      return {
        key: `layer_${count - idx}`,
        opacity: layer.opacity,
        transform: `translate(${shift} ${shift}) scale(${round(scale)})`,
      };
    });
});
</script>

<template>
  <svg
    class="service-decor"
    viewBox="0 0 174 174"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-for="layer in decorLayers"
      :key="layer.key"
      :d="shapePath"
      :opacity="layer.opacity"
      :transform="layer.transform"
      fill="currentColor"
    />
  </svg>
</template>

<style scoped lang="scss">
.service-decor {
  display: block;
  width: var(--service-decor-size, 100%);
  height: auto;

  color: var(--service-decor-shape, var(--service-accent));
}
</style>
