<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAdaptiveGsap } from '@l-expertise/composables/useAdaptiveGsap';
import { useRealPointerMove } from '@l-expertise/composables/useRealPointerMove';

import kv1 from '@l-expertise/assets/images/tabs/transport/kv-1.png?url';
import kv1webp from '@l-expertise/assets/images/tabs/transport/kv-1.webp?url';

import kv2 from '@l-expertise/assets/images/tabs/transport/kv-2.png?url';
import kv2webp from '@l-expertise/assets/images/tabs/transport/kv-2.webp?url';

import kv3 from '@l-expertise/assets/images/tabs/transport/kv-3.png?url';
import kv3webp from '@l-expertise/assets/images/tabs/transport/kv-3.webp?url';

const { isDesktop } = useDevice();

// Длительность раскрытия пункта — синхронизирована с transition в стилях ниже
const ACCORDION_MS = 500;

const activeTab = shallowRef<number>(0);
const prevActiveTab = usePrevious(activeTab, activeTab.value);

const imagesRef = ref<{ target: HTMLElement }[]>();
const imagesContainerRef = useTemplateRef('imagesContainerRef');
const itemsRef = ref<HTMLElement[]>([]);

const { t } = useI18n();

useAdaptiveGsap({
  desktop: () => {
    if (!imagesRef.value || !imagesContainerRef.value) return;

    const images = imagesRef.value.map(item => item.target);

    gsap.set(images, {
      y: -45,
    });

    gsap.to(images, {
      y: 0,
      scrollTrigger: {
        scrub: 2,
        trigger: imagesContainerRef.value,
        start: 'top bottom',
        end: 'bottom top',
      },
    });
  },
});

interface Tab {
  label: string;
  text: string;
  image: {
    src: string;
    webp: string;
    ratio: string;
  };
}

const tabs: ComputedRef<Tab[]> = computed(() => [
  {
    label: t('expertise.transport.tab1.label'),
    text: t('expertise.transport.tab1.text'),
    image: {
      src: kv1,
      webp: kv1webp,
      ratio: '860 / 644',
    },
  },
  {
    label: t('expertise.transport.tab2.label'),
    text: t('expertise.transport.tab2.text'),
    image: {
      src: kv2,
      webp: kv2webp,
      ratio: '906 / 726',
    },
  },
  {
    label: t('expertise.transport.tab3.label'),
    text: t('expertise.transport.tab3.text'),
    image: {
      src: kv3,
      webp: kv3webp,
      ratio: '880 / 720',
    },
  },
]);

// Раньше пункт выбирался по mouseover: он прилетает и когда курсор стоит, а пункты сами проезжают под ним
// (скролл колесом, сворачивание соседнего пункта) — пункты переключались сами, и 2-й «проскакивал» к 3-му.
const isRealPointerMove = useRealPointerMove();

let anchorFrameId = 0;
let stopAnchoring: VoidFunction | null = null;
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

const getStickyBottom = (): number => {
  const tabs = document.querySelector('.expertise__tabs');
  return tabs ? Math.max(0, tabs.getBoundingClientRect().bottom) : 0;
};

// Тач: когда сворачивается пункт выше выбранного, список уезжает вверх из-под пальца (Safari не умеет scroll anchoring).
// Пока идёт анимация, держим заголовок выбранного пункта на месте, а в конце, если раскрытый пункт не влез,
// аккуратно докручиваем ровно настолько, чтобы он стал виден. Любое касание или колесо прерывает докрутку.
const keepItemInView = (item: HTMLElement) => {
  stopAnchoring?.();

  const root = document.documentElement;
  const startTop = item.getBoundingClientRect().top;
  const finishAt = performance.now() + ACCORDION_MS + 50;
  let interrupted = false;

  const interrupt = () => {
    interrupted = true;
  };

  const cleanup = () => {
    cancelAnimationFrame(anchorFrameId);
    root.style.removeProperty('overflow-anchor');
    window.removeEventListener('touchstart', interrupt);
    window.removeEventListener('wheel', interrupt);
    stopAnchoring = null;
  };

  stopAnchoring = cleanup;

  root.style.setProperty('overflow-anchor', 'none');
  window.addEventListener('touchstart', interrupt, { passive: true });
  window.addEventListener('wheel', interrupt, { passive: true });

  const step = () => {
    if (interrupted) {
      cleanup();
      return;
    }

    const rect = item.getBoundingClientRect();

    if (performance.now() < finishAt) {
      const shift = rect.top - startTop;

      if (Math.abs(shift) >= 1) {
        window.scrollBy(0, shift);
      }

      anchorFrameId = requestAnimationFrame(step);
      return;
    }

    cleanup();

    const overflow = rect.bottom + 16 - window.innerHeight;
    const room = rect.top - getStickyBottom() - 16;
    const delta = Math.min(overflow, room);

    if (delta > 1) {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  anchorFrameId = requestAnimationFrame(step);
};

const selectTab = (idx: number, keepInView = false) => {
  if (idx === activeTab.value) return;

  const item = itemsRef.value[idx];
  if (keepInView && item) {
    keepItemInView(item);
  }

  activeTab.value = idx;
};

const onItemPointerMove = (event: PointerEvent, idx: number) => {
  if (!isDesktop.value || !isRealPointerMove(event)) return;

  selectTab(idx);
};

// Тап (в том числе на планшете с десктопной шириной) выбирает пункт и держит его на месте; клик мышью — просто выбирает
let lastPointerType = 'mouse';

const onItemPointerDown = (event: PointerEvent) => {
  lastPointerType = event.pointerType;
};

const onItemClick = (idx: number) => {
  selectTab(idx, lastPointerType !== 'mouse');
};

// Высота списка меняется — триггеры ниже по странице пересчитываем один раз, когда анимация закончилась
watch(activeTab, () => {
  if (refreshTimeoutId !== null) {
    clearTimeout(refreshTimeoutId);
  }

  refreshTimeoutId = setTimeout(() => {
    refreshTimeoutId = null;
    ScrollTrigger.refresh();
  }, ACCORDION_MS + 50);
});

onBeforeUnmount(() => {
  stopAnchoring?.();

  if (refreshTimeoutId !== null) {
    clearTimeout(refreshTimeoutId);
  }
});
</script>

<template>
  <section class="transport">
    <p class="transport__text" v-html="t('expertise.transport.title')" />

    <div class="transport__body">
      <div
        ref="imagesContainerRef"
        class="transport__images"
        :class="`transport__images_active-${activeTab}`"
      >
        <!-- Колонка скрывается на мобильном стилями: JS-брейкпоинт (<576) и CSS (≤576) расходятся на 576px -->
        <template v-for="(tab, idx) in tabs" :key="idx">
          <transition :name="prevActiveTab > activeTab ? 'swap' : 'swap-inverse'" mode="out-in">
            <div v-show="activeTab === idx" class="transport__images-item">
              <atoms-picture
                ref="imagesRef"
                class="transport__images-item-image"
                :src="tab.image.src"
                :webp="tab.image.webp"
              />
            </div>
          </transition>
        </template>
      </div>

      <div class="transport__content">
        <div
          v-for="(tab, idx) in tabs"
          ref="itemsRef"
          :key="tab.label"
          class="transport__tab"
          :class="{ transport__tab_active: idx === activeTab }"
          @click="onItemClick(idx)"
          @pointerdown="onItemPointerDown"
          @pointermove="onItemPointerMove($event, idx)"
        >
          <div class="transport__tab-header">
            <span>({{ String(idx+1).padStart(2, '0') }})</span>
            <h4 class="transport__tab-label">{{ tab.label }}</h4>
          </div>

          <div class="transport__tab-content">
            <div class="transport__tab-content-inner">
              <h4 aria-hidden="true" class="transport__tab-label">{{ tab.label }}</h4>
              <hr />
              <p class="transport__tab-text">{{ tab.text }}</p>

              <!-- Картинка мобильной версии внутри сворачиваемого блока: раньше её показывал v-show,
                   и высота пункта менялась скачком поверх плавного раскрытия -->
              <div class="transport__tab-image" :style="{ aspectRatio: tab.image.ratio }">
                <atoms-picture
                  :src="tab.image.src"
                  :webp="tab.image.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;

// Соседние пункты сдвигаются из-за изменения высоты — ease-in-out без резкого рывка в начале
$accordion-easing: cubic-bezier(0.4, 0, 0.2, 1);

.transport__text {
  padding: 40px;

  color: var(--dark-blue);

  background: linear-gradient(108deg, #F4F7FF -99.97%, #FFFFFF 212.34%);

  border-radius: 16px;

  @include t.h2;

  @include a.mobile {
    padding: 20px;

    @include t.h5;
  }
}

.transport__body {
  display: grid;
  grid-gap: 73px;
  grid-template-columns: 482px 1fr;
  margin-top: 36px;

  @include a.tablet {
    grid-gap: 60px;
    grid-template-columns: 1fr;
    margin-top: 20px;
  }

  @include a.mobile {
    grid-gap: 24px;
    margin-top: 24px;
  }
}

.transport__images {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 572px;

  background: url("@l-expertise/assets/images/tabs/transport/stars.svg") repeat 16%;

  transition: .4s ease;

  @include a.tablet {
    order: 2;
    height: 418px;

    background: url("@l-expertise/assets/images/tabs/transport/stars.svg") repeat center;
  }

  @include a.mobile {
    display: none;
  }

  &-item {
    position: absolute;

    width: 479px;
    height: auto;

    filter: drop-shadow(0 0 20px white);

    img {
      width: 100%;
    }

    &:nth-child(1) {
      top: 47px;
      left: 46px;

      width: 440px;

      @include a.tablet {
        left: unset;
      }
    }

    &:nth-child(3) {
      bottom: 0;
    }
  }

  &_active {
    @for $i from 1 through 3 {
      &-#{$i - 1} {
        background-position-y: #{$i * 10}px;
      }
    }
  }
}

.transport__content {
  @include a.tablet {
    margin-inline-start: 40px;
  }

  @include a.mobile {
    margin-left: 0;
  }
}

.transport__tab {
  position: relative;
  z-index: 1;

  padding: 32px;

  background: linear-gradient(110deg, #F4F7FF -58.83%, #FFFFFF 132.72%);
  border-radius: 16px;

  @include a.tablet {
    padding: 32px;
  }

  @include a.mobile {
    padding: 20px;
  }

  &:not(:last-child) {
    margin-bottom: 36px;

    @include a.tablet {
      margin-bottom: 20px;
    };

    @include a.mobile {
      margin-bottom: 8px;
    }
  }

  &::before {
    position: absolute;
    top: 50%;
    inset-inline-end: calc(100% + 30px);

    width: 8px;
    height: 8px;

    background-color: var(--dark-blue);
    border-radius: 50%;
    transform: translateY(-50%);

    content: '';

    @include a.tablet {
      inset-inline-end: calc(100% + 32px);
    }

    @include a.mobile {
      display: none;
    }
  }

  &_active {
    .transport__tab {
      &-header {
        @include a.mobile {
          align-items: flex-start;
        }

        .transport__tab-label {
          transform: translateY(8px);
          opacity: 0;

          // На мобильном заголовок остаётся на месте и под ним раскрывается текст. Раньше он пропадал
          // через display: none, а такой же заголовок проявлялся ниже — высота пункта менялась скачком
          @include a.mobile {
            transform: none;
            opacity: 1;
          }
        }
      }

      &-content {
        grid-template-rows: 1fr;
        margin-top: 52px;

        opacity: 1;

        // Раскрытие: сначала высота, следом мягко проявляется текст

        transition:
          grid-template-rows 0.5s $accordion-easing,
          margin-top 0.5s $accordion-easing,
          opacity 0.4s ease 0.12s;

        @include a.mobile {
          margin-top: 0;
        }

        &-inner {
          transform: none;
        }
      }
    }
  }

  &-label {
    color: var(--dark-blue);

    transition: .3s ease;
    transition-property: opacity, transform;

    @include t.h3;

    @include a.mobile {
      @include t.h5;
    }
  }

  &-header {
    display: flex;
    align-items: center;
    height: 23px;

    @include a.tablet {
      height: auto;
    }

    @include a.mobile {
      flex-direction: column;
      gap: 20px;
      align-items: flex-start;
    }

    span {
      display: inline-block;
      margin-inline-end: 12px;

      color: var(--dark-blue-40);

      @include t.caption-m-medium;

      @include a.mobile {
        margin-top: 4px;

        @include t.caption-xs-medium;
      }
    }
  }

  // Место под картинку зарезервировано через aspect-ratio — ленивая загрузка не меняет высоту пункта

  &-image {
    display: none;

    @include a.mobile {
      display: block;
      width: 237px;
      margin: 20px auto 0;

      background: url("@l-expertise/assets/images/tabs/transport/stars.svg") repeat center / 180px;
    }
  }

  &-text {
    color: var(--dark-blue-80);

    @include t.lead-m-medium;

    @include a.mobile {
      line-height: 1.38em !important;

      @include t.body-s-medium-135
    }
  }

  &-content {
    display: grid;
    grid-template-rows: 0fr;

    opacity: 0;

    // Сворачивание: текст гаснет быстрее, чем схлопывается высота, — без «обрезанных» строк

    transition:
      grid-template-rows 0.45s $accordion-easing,
      margin-top 0.45s $accordion-easing,
      opacity 0.2s ease;

    &-inner {
      position: relative;

      min-height: 0;
      overflow: hidden;

      transform: translateY(12px);

      transition: transform 0.5s v.$easing;

      // На мобильном заголовок не дублируется — остаётся тот, что в шапке пункта

      > .transport__tab-label {
        @include a.mobile {
          display: none;
        }
      }

      hr {
        width: 100%;
        height: 1Px;
        margin: 24px 0;

        background: linear-gradient(90deg, #4F86FF 0%, #6B99FF 39.43%, #DEE9FF 60.36%);
        border: none;

        @include a.mobile {
          margin: 12px 0;
        }
      }
    }
  }
}
</style>

<!-- Transition -->
<style>
.swap-enter-active,
.swap-leave-active,
.swap-inverse-enter-active,
.swap-inverse-leave-active {
  transition: 1s ease;
  transition-property: opacity, transform;
}

.swap-enter-from,
.swap-leave-to,
.swap-inverse-enter-from,
.swap-inverse-leave-to {
  opacity: 0;
}

.swap-inverse-leave-to,
.swap-enter-from {
  transform: translateY(20px);
}

.swap-inverse-enter-from,
.swap-leave-to {
  transform: translateY(-20px);
}
</style>
