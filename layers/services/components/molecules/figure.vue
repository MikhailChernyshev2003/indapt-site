<script setup lang="ts">
import { useFigureReveal } from '@l-services/composables/useFigureReveal';
import type { FigurePlacement, FigurePlacements } from '@l-services/types';

const {
  placement,
  animated = true,
  revealShift = 0,
  triggerClosest = '',
} = defineProps<{
  /** Размещение по макету; без него фигура занимает контейнер */
  placement?: FigurePlacements;
  /** Появление по скроллу; выключено — фигура статична */
  animated?: boolean;
  /** Сдвиг начала появления в % высоты экрана */
  revealShift?: number;
  /**
   * Селектор предка-триггера. По умолчанию появление считается от контейнера,
   * в котором фигура размещена: сама она по макету часто начинается далеко
   * за его краями и «входила» бы в экран задолго до того, как её видно.
   * Внутри sticky нужен предок, который скроллится, — сам sticky-блок
   */
  triggerClosest?: string;
}>();

// html font-size тянется от ширины экрана, а px в инлайновом style мимо
// postcss не проходит — переводим в rem сами (см. sticky-kv)
const toRem = (px: number) => `${px / 16}rem`;

// Незаданный проп Vue пропускает, поэтому в CSS остаётся значение по умолчанию
const placementVars = (point: FigurePlacement | null, suffix: string) => {
  if (!point) return { [`--figure-display${suffix}`]: 'none' };

  return {
    [`--figure-x${suffix}`]: toRem(point.x),
    [`--figure-y${suffix}`]: toRem(point.y),
    [`--figure-w${suffix}`]: toRem(point.width),
    [`--figure-h${suffix}`]: point.height === undefined ? 'auto' : toRem(point.height),
    [`--figure-r${suffix}`]: `${point.rotate ?? 0}deg`,
  };
};

const rootStyle = computed(() => {
  if (!placement) return undefined;

  // Планшет по умолчанию повторяет десктоп, мобильный — планшет
  const tablet = placement.tablet === undefined ? placement.desktop : placement.tablet;
  const mobile = placement.mobile === undefined ? tablet : placement.mobile;

  return {
    ...placementVars(placement.desktop, ''),
    ...placementVars(tablet, '-tablet'),
    ...placementVars(mobile, '-mobile'),
  };
});

const rootRef = useTemplateRef<HTMLElement>('rootRef');
const revealRef = useTemplateRef<HTMLElement>('revealRef');

if (animated) {
  useFigureReveal(revealRef, {
    shift: revealShift,
    // Контейнер ищем от обёртки: сама она позиционирована, и для внутреннего
    // слоя контейнером была бы она же
    trigger: () => (triggerClosest
      ? rootRef.value?.closest(triggerClosest)
      : rootRef.value?.offsetParent),
  });
}
</script>

<template>
  <!-- Поворот и позиция лежат на обёртке, а анимация растит внутренний
       слой: так масштаб идёт из центра фигуры и не спорит с поворотом -->
  <div
    ref="rootRef"
    class="figure"
    :class="{ figure_placed: placement }"
    :style="rootStyle"
    aria-hidden="true"
  >
    <div ref="revealRef" class="figure__reveal">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.figure {
  pointer-events: none;

  // Фигура из макета: угол экземпляра до поворота и поворот вокруг него,
  // как считает Figma. Значения по брейкпоинтам приходят из inline style

  &_placed {
    position: absolute;
    top: var(--figure-y);
    left: var(--figure-x);

    display: var(--figure-display, block);
    width: var(--figure-w);
    height: var(--figure-h);

    transform: rotate(var(--figure-r));
    transform-origin: 0 0;

    @include a.tablet {
      top: var(--figure-y-tablet);
      left: var(--figure-x-tablet);

      display: var(--figure-display-tablet, block);
      width: var(--figure-w-tablet);
      height: var(--figure-h-tablet);

      transform: rotate(var(--figure-r-tablet));
    }

    @include a.mobile {
      top: var(--figure-y-mobile);
      left: var(--figure-x-mobile);

      display: var(--figure-display-mobile, block);
      width: var(--figure-w-mobile);
      height: var(--figure-h-mobile);

      transform: rotate(var(--figure-r-mobile));
    }
  }
}

.figure__reveal {
  width: 100%;
  height: 100%;

  :deep(img) {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
