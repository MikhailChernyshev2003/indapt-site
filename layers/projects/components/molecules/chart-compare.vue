<script setup lang="ts">
import { gsap } from 'gsap';

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tween: gsap.core.Timeline | null = null;

// Столбцы вырастают от пола, плашка выпрыгивает следом
useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  tween = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top 85%',
    },
  })
    .from(root.querySelectorAll('.chart-compare__bar'), {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 0.9,
      ease: 'power2.out',
      stagger: 0.18,
    })
    .from(root.querySelector('.chart-compare__badge'), {
      scale: 0.6,
      autoAlpha: 0,
      duration: 0.4,
      ease: 'back.out(2)',
    }, '-=0.3');
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
});

defineProps<{
  /** Значения столбцов «до» и «после» */
  beforeValue: string;
  afterValue: string;
  /** Плашка над правым столбцом, например «в 5 раз» */
  badge?: string;
  /** Цвет столбцов */
  color: string;
}>();
</script>

<template>
  <!-- Сравнение «до/после»: два столбца с подписями и тёмная плашка -->
  <div ref="rootRef" class="chart-compare">
    <div class="chart-compare__bars">
      <!-- Прозрачность только у заливки, чтобы цифры и плашка оставались плотными -->
      <div class="chart-compare__bar chart-compare__bar_before" :style="{ background: `${color}33` }">
        <span class="chart-compare__value">{{ beforeValue }}</span>
      </div>
      <div class="chart-compare__bar chart-compare__bar_after" :style="{ background: `${color}cc` }">
        <span class="chart-compare__value">{{ afterValue }}</span>
        <span v-if="badge" class="chart-compare__badge">{{ badge }}</span>
      </div>
    </div>
    <div class="chart-compare__labels">
      <span class="chart-compare__label">{{ $t('projects.general.chart.before') }}</span>
      <span class="chart-compare__label">{{ $t('projects.general.chart.after') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.chart-compare {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-compare__bars {
  display: flex;
  align-items: flex-end;
  height: 262px;

  @include a.mobile {
    height: 239px;
  }
}

.chart-compare__bar {
  position: relative;

  flex: 1;

  &_before {
    height: 100px;

    border-radius: 8px 0 0 8px;
  }

  &_after {
    height: 214px;

    border-radius: 8px 8px 8px 0;
  }
}

// Значения из макета: Involve 42px по центру столбца

.chart-compare__value {
  position: absolute;
  top: 50%;
  left: 50%;

  color: var(--dark-blue);
  font-weight: 500;
  font-size: 42px;

  font-family: v.$font-involve;
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;

  transform: translate(-50%, -50%);
}

// Тёмная плашка с хвостиком по центру над правым столбцом

.chart-compare__badge {
  position: absolute;
  right: 0;
  bottom: calc(100% + 19px);
  left: 0;

  width: max-content;
  margin: 0 auto;
  padding: 14.5px 18px;

  color: var(--white);
  white-space: nowrap;
  text-align: center;

  background-color: var(--dark-blue);
  border-radius: 8px;

  @include t.h5;

  @include a.mobile {
    bottom: calc(100% + 17px);

    min-width: 100%;
    padding: 11px 12px;

    @include t.h6;
  }

  &::after {
    position: absolute;
    top: 100%;
    left: 50%;

    border-color: var(--dark-blue) transparent transparent;
    border-style: solid;
    border-width: 11.5px 18px 0;

    transform: translateX(-50%);

    content: '';
  }
}

.chart-compare__labels {
  display: flex;
}

.chart-compare__label {
  flex: 1;

  color: var(--dark-blue-80);
  text-align: center;

  @include t.caption-m-medium;
}
</style>
