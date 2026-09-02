<script setup lang="ts">
import type { FigurePlacements, RingColors, RingShape } from '@l-services/types';

const {
  clusters,
  shape = 'hexagon',
  colors,
  image,
} = defineProps<{
  /** Размещение скоплений колец по макету, обычно два */
  clusters: FigurePlacements[];
  /** Фигура колец */
  shape?: RingShape;
  /** Цвета колец; не нужны, если полоса собрана из картинки */
  colors?: RingColors;
  /** Растр вместо колец: в макете дизайна полоса нарисована картинкой */
  image?: string;
}>();
</script>

<template>
  <!-- Полоса из макета: цветной фон и два скопления колец, обрезанных
       краями полосы. Каждое скопление появляется по скроллу как фигура
       на главной, правое — чуть позже левого -->
  <div class="pattern-band">
    <services-molecules-figure
      v-for="(cluster, idx) in clusters"
      :key="idx"
      :placement="cluster"
      :reveal-shift="idx * 12"
    >
      <img
        v-if="image"
        :src="image"
        alt=""
        loading="lazy"
      />
      <services-molecules-ring-pattern
        v-else-if="colors"
        :shape="shape"
        :colors="colors"
      />
    </services-molecules-figure>
  </div>
</template>

<style scoped lang="scss">
.pattern-band {
  position: relative;

  // Высота полосы по макету одна на всех брейкпоинтах

  height: 369px;
  overflow: hidden;

  background: var(--pattern-band-bg, var(--white));
  border-radius: 16px;
}
</style>
