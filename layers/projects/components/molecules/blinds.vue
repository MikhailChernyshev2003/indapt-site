<script setup lang="ts">
/** Положение ряда на планшете/мобильном: тот же ряд, но в своём масштабе */
interface BlindsAdaptive {
  left: number;
  top: number;
  scale: number;
}

const {
  color,
  stripWidth = 90,
  rowWidth = 2183,
  rowHeight = 1111,
  left = 164,
  top = -509,
  rotate = 15,
  count = 24,
  tablet,
  mobile,
} = defineProps<{
  /** Цвет полос — акцент кейса */
  color: string;
  /** Ширина полосы по макету, px */
  stripWidth?: number;
  /** Размеры ряда до поворота по макету, px */
  rowWidth?: number;
  rowHeight?: number;
  /** Позиция ряда до поворота (поворот — вокруг центра), px */
  left?: number;
  top?: number;
  /** Наклон ряда в градусах */
  rotate?: number;
  /** Число полос */
  count?: number;
  /** Позиция и масштаб ряда на планшете и мобильном, если отличаются */
  tablet?: BlindsAdaptive;
  mobile?: BlindsAdaptive;
}>();

// html font-size тянется от ширины экрана, px в инлайновом style мимо
// postcss не проходит — переводим в rem сами (см. sticky-kv)
const toRem = (px: number) => `${px / 16}rem`;

const adaptiveVars = (name: string, value?: BlindsAdaptive) => (value
  ? {
      [`--blinds-left-${name}`]: toRem(value.left),
      [`--blinds-top-${name}`]: toRem(value.top),
      [`--blinds-scale-${name}`]: String(value.scale),
    }
  : {});

const rowStyle = computed(() => ({
  '--blinds-left': toRem(left),
  '--blinds-top': toRem(top),
  '--blinds-width': toRem(rowWidth),
  '--blinds-height': toRem(rowHeight),
  '--blinds-strip-width': toRem(stripWidth),
  '--blinds-color': color,
  ...adaptiveVars('tablet', tablet),
  ...adaptiveVars('mobile', mobile),
  transform: `rotate(${rotate}deg)`,
}));
</script>

<template>
  <!-- Жалюзи из макета: наклонный ряд «стеклянных» полос, у каждой
       горизонтальный градиент от прозрачного к акценту. Блюра подложки нет
       намеренно: фон под полосами — гладкий градиент, размытие его не меняет -->
  <div class="blinds" aria-hidden="true">
    <div class="blinds__row" :style="rowStyle">
      <span
        v-for="idx in count"
        :key="idx"
        class="blinds__strip"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.blinds {
  position: absolute;
  inset: 0;

  overflow: hidden;

  pointer-events: none;
}

.blinds__row {
  --blinds-scale: 1;

  position: absolute;
  top: var(--blinds-top);
  left: var(--blinds-left);

  display: flex;
  gap: calc(1px * var(--blinds-scale));
  width: calc(var(--blinds-width) * var(--blinds-scale));
  height: calc(var(--blinds-height) * var(--blinds-scale));

  @include a.tablet {
    --blinds-scale: var(--blinds-scale-tablet, 1);

    top: var(--blinds-top-tablet, var(--blinds-top));
    left: var(--blinds-left-tablet, var(--blinds-left));
  }

  @include a.mobile {
    --blinds-scale: var(--blinds-scale-mobile, var(--blinds-scale-tablet, 1));

    top: var(--blinds-top-mobile, var(--blinds-top-tablet, var(--blinds-top)));
    left: var(--blinds-left-mobile, var(--blinds-left-tablet, var(--blinds-left)));
  }
}

.blinds__strip {
  flex: none;
  width: calc(var(--blinds-strip-width) * var(--blinds-scale));
  height: 100%;

  // В макете полоса — от прозрачного к акценту 10% поперёк полосы:
  // светлый край одной полосы встык к тёмному краю соседней и даёт рисунок

  background: linear-gradient(90deg, transparent 0%, var(--blinds-color) 100%);

  opacity: 0.1;
}
</style>
