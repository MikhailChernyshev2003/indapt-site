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
  [`--sticky-kv-top${suffix}`]: toRem(frame.top ?? 0),
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
       она стоит на месте. Сцена задаёт высоту скролла, а sticky-обёртка
       держит картинку в кадре. Сама картинка вынута под контент (z-index)
       и не перехватывает клики -->
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

.sticky-kv {
  position: relative;
}

// В покое кадр стоит там, где нарисован в макете (top), а когда блок
// уезжает вверх — прилипает так, чтобы картинка оказалась по центру экрана.
// Смещение покоя вычитается из порога прилипания, иначе картинка
// прилипала бы на своё смещение ниже центра.
// Кадр по макету заходит на следующую секцию и лежит под её текстом:
// отрицательный z-index уводит его под весь поток страницы — для этого
// страница изолирует контекст наложения (isolation: isolate на .service-page)

.sticky-kv__frame {
  position: sticky;
  top: calc(50vh - var(--sticky-kv-height) / 2 - var(--sticky-kv-top));
  z-index: -1;

  height: 0;

  pointer-events: none;

  @include a.tablet {
    top: calc(50vh - var(--sticky-kv-height-tablet) / 2 - var(--sticky-kv-top-tablet));
  }

  @include a.mobile {
    top: calc(50vh - var(--sticky-kv-height-mobile) / 2 - var(--sticky-kv-top-mobile));
  }
}

// Кадр режет фигуру по своим границам, как фрейм в макете

.sticky-kv__media {
  position: absolute;
  top: var(--sticky-kv-top);
  left: var(--sticky-kv-left);

  width: var(--sticky-kv-width);
  height: var(--sticky-kv-height);
  overflow: hidden;

  @include a.tablet {
    top: var(--sticky-kv-top-tablet);
    left: var(--sticky-kv-left-tablet);

    width: var(--sticky-kv-width-tablet);
    height: var(--sticky-kv-height-tablet);
  }

  @include a.mobile {
    top: var(--sticky-kv-top-mobile);
    left: var(--sticky-kv-left-mobile);

    width: var(--sticky-kv-width-mobile);
    height: var(--sticky-kv-height-mobile);
  }
}

.sticky-kv__content {
  position: relative;
  z-index: 1;
}
</style>
