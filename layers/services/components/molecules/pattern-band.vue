<script setup lang="ts">
const { type } = defineProps<{
  /** Фигура кластеров из общих данных, например hexagonOrange */
  type: string;
}>();
</script>

<template>
  <!-- Полоса из макета: цветной фон и два скопления слоёной фигуры по краям.
       По правкам это два отдельных объекта: каждый появляется послойно,
       правый стартует позже левого (reveal-shift). Обёртка-позиционер
       обязательна — свой transform фигуры затирает gsap-масштаб появления -->
  <div class="pattern-band">
    <div class="pattern-band__cluster pattern-band__cluster_start">
      <services-molecules-layered-shape :type="type" :offset="30" />
    </div>
    <div class="pattern-band__cluster pattern-band__cluster_end">
      <services-molecules-layered-shape
        :type="type"
        :offset="30"
        :reveal-shift="12"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.pattern-band {
  position: relative;

  height: var(--pattern-band-height, 23.0625rem); // 369px
  overflow: hidden;

  background: var(--pattern-band-bg, var(--white));
  border-radius: 16px;

  @include a.mobile {
    height: var(--pattern-band-height-mobile, 11.25rem); // 180px
  }
}

.pattern-band__cluster {
  position: absolute;
  top: 50%;

  width: var(--pattern-band-cluster-size, 17.5rem); // 280px

  @include a.mobile {
    width: var(--pattern-band-cluster-size-mobile, 8.75rem); // 140px
  }

  &_start {
    left: 4%;

    transform: translateY(-54%);
  }

  &_end {
    right: 7%;

    transform: translateY(-42%);
  }
}
</style>
