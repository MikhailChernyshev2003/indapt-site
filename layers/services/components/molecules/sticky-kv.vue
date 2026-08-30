<script setup lang="ts">
const {
  src,
  width,
  height,
  left = 0,
} = defineProps<{
  /** Путь к картинке */
  src: string;
  /** Размеры по макету @1x */
  width: number;
  height: number;
  /** Смещение от левого края экрана по макету */
  left?: number;
}>();

// html font-size тянется от ширины экрана, px в инлайновом style мимо
// postcss не проходит — переводим в rem сами (см. scatter-cards)
const toRem = (px: number) => `${px / 16}rem`;

const rootStyle = computed(() => ({
  '--sticky-kv-width': toRem(width),
  '--sticky-kv-height': toRem(height),
  '--sticky-kv-left': toRem(left),
}));
</script>

<template>
  <!-- По правкам из макета картинка в блоке статична: пока контент скроллится,
       она стоит на месте. Сцена задаёт высоту скролла, а sticky-обёртка
       держит картинку в кадре. Сама картинка вынута под контент (z-index)
       и не перехватывает клики -->
  <div class="sticky-kv" :style="rootStyle">
    <div class="sticky-kv__frame">
      <img
        class="sticky-kv__img"
        :src="src"
        :width="width"
        :height="height"
        alt=""
        loading="lazy"
      />
    </div>
    <div class="sticky-kv__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.sticky-kv {
  position: relative;
}

.sticky-kv__frame {
  position: sticky;

  // Картинка встаёт по центру экрана и остаётся там на всю прокрутку сцены

  top: calc(50vh - var(--sticky-kv-height) / 2);

  height: 0;

  pointer-events: none;

  @include a.tablet {
    display: none;
  }
}

.sticky-kv__img {
  position: absolute;
  top: 0;
  left: var(--sticky-kv-left, 0);

  width: var(--sticky-kv-width);
  max-width: none;
  height: auto;
}

.sticky-kv__content {
  position: relative;
  z-index: 1;
}
</style>
