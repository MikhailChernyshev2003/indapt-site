<script setup lang="ts">
import { gsap } from 'gsap';

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tween: gsap.core.Timeline | null = null;

// Столбцы вырастают от пола, стрелка следом «прорисовывается» к наконечнику
useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  tween = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top 85%',
    },
  })
    .from(root.querySelectorAll('.chart-columns__bar'), {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.06,
    })
    .fromTo(root.querySelector('.chart-columns__arrow'), {
      clipPath: 'inset(0% 100% 0% 0%)',
    }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.8,
      ease: 'power1.inOut',
    }, '-=0.4');
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
});

const { heights, solidFrom = 3 } = defineProps<{
  /** Высоты столбцов по макету, px */
  heights: number[];
  /** С какого столбца столбцы становятся насыщеннее (как в макете) */
  solidFrom?: number;
  /** Цвет столбцов */
  color: string;
  /** Цвет восходящей стрелки */
  lineColor: string;
}>();

const uid = useId();

const toRem = (px: number) => `${px / 16}rem`;
</script>

<template>
  <!-- Ряд растущих столбцов с изогнутой восходящей стрелкой над ними -->
  <div ref="rootRef" class="chart-columns">
    <div class="chart-columns__row">
      <span
        v-for="(h, idx) in heights"
        :key="idx"
        class="chart-columns__bar"
        :style="{
          height: toRem(h),
          background: idx >= solidFrom
            ? `linear-gradient(180deg, ${color}80 0%, ${color}0d 100%), ${color}1a`
            : `linear-gradient(180deg, ${color}4d 0%, ${color}08 100%)`,
        }"
      />
    </div>
    <!-- Стрелка из макета (Vector 3212): контур с наконечником, повёрнут на -20.18° -->
    <svg
      class="chart-columns__arrow"
      viewBox="0 0 416.457 58.4758"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          :id="`cc-arrow-${uid}`"
          x1="41.0364"
          y1="8.43015"
          x2="392.749"
          y2="16.759"
          gradientUnits="userSpaceOnUse"
        >
          <stop :stop-color="lineColor" stop-opacity="0" />
          <stop offset="1" :stop-color="lineColor" />
        </linearGradient>
      </defs>
      <path
        d="M1.82788 0.0365243C1.01944 -0.144379 0.217428 0.364335 0.0365243 1.17277C-0.144379 1.9812 0.364335 2.78322 1.17277 2.96412L1.50032 1.50032L1.82788 0.0365243ZM174.299 39.8147L173.987 41.2821L174.299 39.8147ZM280.863 52.5547L280.823 54.0542L280.863 52.5547ZM416.457 47.0248L400.042 41.4961L403.461 58.4758L416.457 47.0248ZM1.50032 1.50032C1.17277 2.96412 1.17331 2.96424 1.1744 2.96449C1.17548 2.96473 1.17711 2.96509 1.17927 2.96558C1.1836 2.96655 1.19009 2.968 1.19872 2.96993C1.21597 2.97379 1.24179 2.97957 1.27606 2.98723C1.34459 3.00257 1.44689 3.02546 1.58199 3.05568C1.85221 3.11614 2.25364 3.20595 2.77854 3.32336C3.82834 3.55819 5.372 3.90344 7.34747 4.34515C11.2984 5.22856 16.9766 6.4978 23.8857 8.0411C37.7039 11.1277 56.4459 15.3106 76.1406 19.6956C115.525 28.4647 158.734 38.0454 173.987 41.2821L174.299 39.8147L174.61 38.3474C159.375 35.1146 116.185 25.5381 76.7926 16.7673C57.0987 12.3825 38.3575 8.19975 24.5397 5.11326C17.6309 3.57001 11.9529 2.30082 8.00209 1.41744C6.02671 0.975755 4.48314 0.630521 3.43342 0.395712C2.90856 0.278307 2.50717 0.188508 2.23699 0.128061C2.10191 0.097838 1.99962 0.0749527 1.93111 0.0596238C1.89686 0.0519594 1.87105 0.0461839 1.8538 0.042325C1.84518 0.0403955 1.8387 0.0389451 1.83437 0.0379771C1.83221 0.0374932 1.83058 0.03713 1.8295 0.0368875C1.82842 0.0366454 1.82788 0.0365243 1.50032 1.50032ZM174.299 39.8147L173.987 41.2821C212.239 49.399 256.833 53.4174 280.823 54.0542L280.863 52.5547L280.903 51.0552C257.065 50.4225 212.655 46.4205 174.61 38.3474L174.299 39.8147ZM280.863 52.5547L280.823 54.0542C306.767 54.7428 373.286 54.7313 403.393 51.1805L403.217 49.6908L403.042 48.2011C373.172 51.7239 306.849 51.7439 280.903 51.0552L280.863 52.5547Z"
        :fill="`url(#cc-arrow-${uid})`"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.chart-columns {
  position: relative;
}

.chart-columns__row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 200px;

  @include a.mobile {
    gap: 4px;
    height: 189px;
  }
}

.chart-columns__bar {
  flex: 1;
  max-height: 100%;

  border-radius: 8px;
}

// Начало стрелки — точка (148; 57) от левого верха ряда столбцов в макете,
// вокруг неё стрелка и повёрнута. Привязка от правого края: наконечник
// в макете у правого края ряда при любой ширине карточки

.chart-columns__arrow {
  position: absolute;
  top: 55.5px;
  left: calc(100% - 433.5px);

  width: 416.5px;
  height: 58.5px;

  transform: rotate(-20.18deg);
  transform-origin: 1.5px 1.5px;

  @include a.tablet {
    left: calc(100% - 409.5px);
  }

  @include a.mobile {
    top: 53px;
    left: calc(100% - 269.5px);

    width: 280px;
    height: 39.3px;

    transform-origin: 1px 1px;
  }
}
</style>
