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
      <div class="chart-compare__bar chart-compare__bar_before" :style="{ background: color }">
        <span class="chart-compare__value">{{ beforeValue }}</span>
      </div>
      <div class="chart-compare__bar chart-compare__bar_after" :style="{ background: color }">
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

    opacity: 0.2;
  }

  &_after {
    height: 214px;

    border-radius: 8px 8px 8px 0;

    opacity: 0.8;
  }
}

// Значения из макета: Involve 42px

.chart-compare__value {
  position: absolute;
  top: 35px;
  left: 50%;

  color: var(--dark-blue);
  font-weight: 500;
  font-size: 42px;

  font-family: v.$font-involve;
  line-height: 1.1;
  letter-spacing: -0.01em;

  transform: translateX(-50%);

  @include a.mobile {
    top: 20px;

    font-size: 28px;
  }
}

// Тёмная плашка с хвостиком над правым столбцом

.chart-compare__badge {
  position: absolute;
  top: -91px;
  left: 98px;

  padding: 14px 15px;

  color: var(--white);

  white-space: nowrap;

  background-color: var(--dark-blue);
  border-radius: 8px;

  @include t.lead-s-medium;

  @include a.mobile {
    top: -70px;
    left: 40px;

    padding: 10px 12px;

    @include t.body-s-medium;
  }

  &::after {
    position: absolute;
    bottom: -11px;
    left: 79px;

    border-color: var(--dark-blue) transparent transparent;
    border-style: solid;
    border-width: 12px 17px 0;

    content: '';

    @include a.mobile {
      left: 46px;
    }
  }
}

.chart-compare__labels {
  display: flex;
}

.chart-compare__label {
  flex: 1;

  color: var(--dark-blue-80);
  text-align: center;

  @include t.body-s-medium;

  @include a.mobile {
    @include t.body-xs-medium;
  }
}
</style>
