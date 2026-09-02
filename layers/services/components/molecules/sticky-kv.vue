<script setup lang="ts">
import type { StickyFrame, StickyFrames } from '@l-services/types';

const { frames } = defineProps<{
  /** Кадр картинки по брейкпоинтам, px по макету */
  frames: StickyFrames;
}>();

// html font-size тянется от ширины экрана, px в инлайновом style мимо
// postcss не проходит — переводим в rem сами (см. scatter-cards)
const toRem = (px: number) => `${px / 16}rem`;

const frameVars = (frame: StickyFrame, suffix: string) => ({
  [`--sticky-kv-width${suffix}`]: toRem(frame.width),
  [`--sticky-kv-height${suffix}`]: toRem(frame.height),
  [`--sticky-kv-left${suffix}`]: toRem(frame.left ?? 0),
});

const rootStyle = computed(() => {
  // Планшет по умолчанию повторяет десктоп, мобильный — планшет
  const tablet = frames.tablet ?? frames.desktop;
  const mobile = frames.mobile ?? tablet;

  return {
    ...frameVars(frames.desktop, ''),
    ...frameVars(tablet, '-tablet'),
    ...frameVars(mobile, '-mobile'),
  };
});
</script>

<template>
  <!-- По правкам из макета картинка в блоке статична: пока контент скроллится,
       она стоит на месте. Блок задаёт высоту скролла, а sticky-кадр держит
       картинку по центру экрана и не выходит за границы блока. Сама картинка
       вынута под контент (z-index) и не перехватывает клики -->
  <div class="sticky-kv" :style="rootStyle">
    <div class="sticky-kv__frame">
      <div class="sticky-kv__media">
        <slot name="media" />
      </div>
    </div>
    <div class="sticky-kv__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

// Кадр и контент лежат в одной ячейке сетки: кадр не занимает места в потоке,
// но остаётся в нём с настоящей высотой — поэтому sticky держит его внутри
// блока и в конце уводит вместе с блоком, а не тянет дальше по странице.
// Пока блок на экране, картинка стоит по центру экрана

.sticky-kv {
  display: grid;
}

// Кадр по макету заходит под соседний текст и лежит под ним: отрицательный
// z-index уводит его под весь поток страницы — для этого страница изолирует
// контекст наложения (isolation: isolate на .service-page)

.sticky-kv__frame {
  position: sticky;
  top: calc(50vh - var(--sticky-kv-height) / 2);
  z-index: -1;

  grid-area: 1 / 1;
  align-self: start;
  height: var(--sticky-kv-height);

  pointer-events: none;

  @include a.tablet {
    top: calc(50vh - var(--sticky-kv-height-tablet) / 2);

    height: var(--sticky-kv-height-tablet);
  }

  @include a.mobile {
    top: calc(50vh - var(--sticky-kv-height-mobile) / 2);

    height: var(--sticky-kv-height-mobile);
  }
}

// Кадр режет фигуру по своим границам, как фрейм в макете

.sticky-kv__media {
  position: absolute;
  top: 0;
  left: var(--sticky-kv-left);

  width: var(--sticky-kv-width);
  height: 100%;
  overflow: hidden;

  @include a.tablet {
    left: var(--sticky-kv-left-tablet);

    width: var(--sticky-kv-width-tablet);
  }

  @include a.mobile {
    left: var(--sticky-kv-left-mobile);

    width: var(--sticky-kv-width-mobile);
  }
}

.sticky-kv__content {
  position: relative;
  z-index: 1;

  grid-area: 1 / 1;
}
</style>
