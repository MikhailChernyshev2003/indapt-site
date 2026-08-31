<script setup lang="ts">
const {
  color,
  stripWidth = 90,
  rowWidth = 2183,
  rowHeight = 1111,
  left = 164,
  top = -509,
  rotate = 15,
  count = 24,
} = defineProps<{
  /** Цвет полос — акцент кейса */
  color: string;
  /** Ширина полосы по макету, px */
  stripWidth?: number;
  /** Размеры повёрнутого ряда по макету, px */
  rowWidth?: number;
  rowHeight?: number;
  /** Позиция ряда внутри контейнера по макету, px */
  left?: number;
  top?: number;
  /** Наклон ряда в градусах */
  rotate?: number;
  /** Число полос */
  count?: number;
}>();

// html font-size тянется от ширины экрана, px в инлайновом style мимо
// postcss не проходит — переводим в rem сами (см. sticky-kv)
const toRem = (px: number) => `${px / 16}rem`;

const rowStyle = computed(() => ({
  top: toRem(top),
  left: toRem(left),
  width: toRem(rowWidth),
  height: toRem(rowHeight),
  transform: `rotate(${rotate}deg)`,
  '--blinds-strip-width': toRem(stripWidth),
  '--blinds-color': color,
}));
</script>

<template>
  <!-- Жалюзи из макета: наклонный ряд полос с вертикальным градиентом
       акцентного цвета. Блюра подложки нет намеренно: фон под полосами
       и так гладкий градиент, размытие его не меняет -->
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
.blinds {
  position: absolute;
  inset: 0;

  overflow: hidden;

  pointer-events: none;
}

.blinds__row {
  position: absolute;

  display: flex;
  gap: 1px;
}

.blinds__strip {
  flex: none;
  width: var(--blinds-strip-width);
  height: 100%;

  background: linear-gradient(180deg, transparent 0%, var(--blinds-color) 100%);

  opacity: 0.1;
}
</style>
