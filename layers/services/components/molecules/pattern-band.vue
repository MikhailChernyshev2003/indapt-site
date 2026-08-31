<script setup lang="ts">
const { type } = defineProps<{
  /** Фигура кластеров из общих данных, например hexagonOrange */
  type: string;
}>();
</script>

<template>
  <!-- Полоса из макета: цветной фон и два крупных скопления колец,
       обрезанных краями полосы. Кольца добираются клонами внешнего слоя
       (rings): в макете их десять при шаге 33px и ядре 356px — снято
       попиксельной подгонкой к экспортам всех трёх страниц. Позиции ядер
       на каждой странице свои и задаются переменными. Правый кластер
       появляется позже левого (reveal-shift) -->
  <div class="pattern-band">
    <div class="pattern-band__cluster pattern-band__cluster_start">
      <services-molecules-layered-shape
        :type="type"
        :offset="33"
        :rings="10"
      />
    </div>
    <div class="pattern-band__cluster pattern-band__cluster_end">
      <services-molecules-layered-shape
        :type="type"
        :offset="33"
        :rings="10"
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

// Ширина задаёт ядро; кольца расходятся наружу своими inset.
// Координаты — левый верхний угол ядра, по умолчанию значения аналитики

.pattern-band__cluster {
  position: absolute;

  width: 22.25rem; // 356px

  @include a.mobile {
    width: 8.75rem; // 140px
  }

  &_start {
    top: var(--pattern-band-l-top, -4px);
    left: var(--pattern-band-l-left, -4px);

    @include a.mobile {
      top: -30px;
      left: -30px;
    }
  }

  &_end {
    top: var(--pattern-band-r-top, 35px);
    left: var(--pattern-band-r-left, 966px);

    @include a.mobile {
      top: 20px;
      right: -30px;
      left: auto;
    }
  }
}
</style>
