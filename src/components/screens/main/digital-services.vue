<script setup lang="ts">
import NavButton from '@/assets/icons/digaital-services/nav-button.svg';
import { SERVICES, SERVICE_FALLBACK_HREF, getServiceHref } from '@l-services/configs';

const { isDesktop } = useDevice();
const { t } = useI18n();

const DEFAULT_LAYER_OFFSET = 80;

const currentType = ref('hexagon');
const currentLayerOffset = ref(DEFAULT_LAYER_OFFSET);
const listRef = ref<HTMLElement | null>(null);

const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const DRAG_ACTIVATION_DELAY_MS = 100;
const DRAG_THRESHOLD_PX = 5;

let dragActivationTimeout: ReturnType<typeof setTimeout> | null = null;

const resetDragState = (): void => {
  if (dragActivationTimeout) {
    clearTimeout(dragActivationTimeout);
    dragActivationTimeout = null;
  }

  isDragging.value = false;
};

const startDrag = (e: MouseEvent): void => {
  if (!isDesktop.value || !listRef.value || e.button !== 0) return;

  resetDragState();

  startX.value = e.clientX;
  scrollLeft.value = listRef.value.scrollLeft;

  dragActivationTimeout = setTimeout(() => {
    dragActivationTimeout = null;
    isDragging.value = true;
  }, DRAG_ACTIVATION_DELAY_MS);
};

const duringDrag = (e: MouseEvent): void => {
  if (!isDesktop.value || !listRef.value) return;

  const deltaX = e.clientX - startX.value;

  if (!isDragging.value && dragActivationTimeout && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
    clearTimeout(dragActivationTimeout);
    dragActivationTimeout = null;
    isDragging.value = true;
  }

  if (!isDragging.value) return;

  e.preventDefault();
  listRef.value.scrollLeft = scrollLeft.value - deltaX;
};

const stopDrag = (): void => {
  if (!isDesktop.value) return;
  resetDragState();
};

const canScrollPrev = ref(false);
const canScrollNext = ref(false);

const scrollPrev = () => {
  if (!listRef.value || !canScrollPrev.value) return;
  listRef.value.scrollBy({ left: -23.5 * window.innerWidth / 100, behavior: 'smooth' });
};

const scrollNext = () => {
  if (!listRef.value || !canScrollNext.value) return;
  listRef.value.scrollBy({ left: 23.5 * window.innerWidth / 100, behavior: 'smooth' });
};

const checkScrollButtons = () => {
  if (!listRef.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = listRef.value;
  canScrollPrev.value = scrollLeft > 0;
  canScrollNext.value = scrollLeft < scrollWidth - clientWidth - 10; // небольшой запас
};

onMounted(() => {
  if (listRef.value) {
    listRef.value.addEventListener('mousedown', startDrag);
    listRef.value.addEventListener('scroll', checkScrollButtons, { passive: true });
    window.addEventListener('mousemove', duringDrag, { passive: false });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mouseleave', stopDrag);

    setTimeout(checkScrollButtons, 100);
  }
});

onBeforeUnmount(() => {
  resetDragState();

  if (listRef.value) {
    listRef.value.removeEventListener('mousedown', startDrag);
    listRef.value.removeEventListener('scroll', checkScrollButtons);
  }

  window.removeEventListener('mousemove', duringDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('mouseleave', stopDrag);
});

const handlerChangeShape = (shape: string, layerOffset: number) => {
  currentType.value = shape;
  currentLayerOffset.value = layerOffset;
};

defineExpose({
  handlerChangeShape,
});

// Ссылку берём из реестра услуг, чтобы неготовые вели на заглушку,
// а не на несуществующий маршрут
const serviceHref = (slug: string) => {
  const service = SERVICES.find(item => item.slug === slug);

  return service ? getServiceHref(service) : SERVICE_FALLBACK_HREF;
};

const services = computed(() => [
  {
    slug: 'analytics-planning',
    color: '#DF7201',
    bg: '#F4EBE5',
    title: t('mainPage.digitalServices.analytics'),
    image: '/images/main/services/analytics-planning.png',
    shape: 'hexagonOrange',
    layerOffset: DEFAULT_LAYER_OFFSET,
  },
  {
    slug: 'engineering',
    color: '#3E3E3E',
    bg: '#E1E4EB',
    title: t('mainPage.digitalServices.engineering'),
    image: '/images/main/services/engineering.png',
    shape: 'square',
    layerOffset: 60,
  },
  {
    slug: 'machine-learning',
    color: '#FA3A59',
    bg: '#F5E5EF',
    title: t('mainPage.digitalServices.ml'),
    image: '/images/main/services/machine-learning.png',
    shape: 'star',
    layerOffset: 60,
  },
  {
    slug: 'development',
    color: '#1764F6',
    bg: '#E0EAFE',
    title: t('mainPage.digitalServices.development'),
    image: '/images/main/services/development.png',
    shape: 'triangle',
    layerOffset: 60,
  },
  {
    slug: 'design',
    color: '#8D19FC',
    bg: '#ECE6FE',
    title: t('mainPage.digitalServices.design'),
    image: '/images/main/services/design.png',
    shape: 'hexagonPurple',
    layerOffset: 60,
  },
  {
    slug: 'support',
    color: '#0099B6',
    bg: '#D0F7F9',
    title: t('mainPage.digitalServices.support'),
    image: '/images/main/services/support.png',
    shape: 'circle',
    layerOffset: 60,
  },
  {
    slug: 'marketing',
    color: '#DD9000',
    bg: '#F8F4C7',
    title: t('mainPage.digitalServices.marketing'),
    image: '/images/main/services/marketing.png',
    shape: 'flower',
    layerOffset: 60,
  },
  {
    slug: 'web3',
    color: '#42A400',
    bg: '#DCF5D0',
    title: t('mainPage.digitalServices.web'),
    image: '/images/main/services/web-3.png',
    shape: 'hexagonGreen',
    layerOffset: 60,
  },
]);
</script>

<template>
  <section class="digital-services">
    <div class="digital-services__container">
      <div class="digital-services__head">
        <h2 class="digital-services__title">{{ t('mainPage.digitalServices.title') }}</h2>
        <div class="digital-services__nav-buttons">
          <NavButton
            class="digital-services__nav-button digital-services__nav-button_prev"
            :class="{ 'digital-services__nav-button_disabled': !canScrollPrev }"
            @click="scrollPrev"
          />
          <NavButton
            class="digital-services__nav-button digital-services__nav-button_next"
            :class="{ 'digital-services__nav-button_disabled': !canScrollNext }"
            @click="scrollNext"
          />
        </div>
      </div>
      <div
        ref="listRef"
        class="digital-services__list"
        :class="{ 'digital-services__list_dragging': isDragging }"
      >
        <AtomsServiceCard
          v-for="item in services"
          :key="item.slug"
          v-bind="item"
          :href="serviceHref(item.slug)"
          class="digital-services__list-item"
          :style="{ pointerEvents: isDragging ? 'none' : 'all' }"
          @mouseenter="handlerChangeShape(item.shape, item.layerOffset)"
          @mouseleave="handlerChangeShape('hexagon', DEFAULT_LAYER_OFFSET)"
        />
      </div>
    </div>
    <OrganismsSvgMorphShape
      ref="refSvgMorphShape"
      :type="currentType"
      :offset="currentLayerOffset"
      :class="`digital-services__shape digital-services__shape_${currentType}`"
    />
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.digital-services {
  width: 100%;
  height: 100vh;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 192px 60px 0;

    @include a.tablet {
      padding: 110px 40px;
    }

    @include a.mobile {
      padding: 94px 20px 0;
    }
  }

  &__title {
    color: var(--dark-blue);

    @include t.h1;

    @include a.mobile {
      font-size: 30px;
    }

    & * {
      font-family: v.$font-involve;
    }
  }

  &__nav-buttons {
    display: flex;
    gap: 16px;
    align-items: center;

    @include a.tablet {
      display: none;
    }
  }

  &__nav-button {
    width: 60px;
    height: 60px;

    color: #0C1D4F;

    pointer-events: all;

    rect {
      color: #ffffff;
    }

    path {
      transition: opacity 0.3s;
    }

    &:hover {
      path {
        opacity: 0.6;
      }
    }

    &_disabled {
      pointer-events: none;

      path {
        opacity: 0.4;
      }
    }

    &_prev {
      transform: rotate(180deg);
    }
  }

  &__list {
    position: relative;
    z-index: 2;

    display: flex;
    margin-top: 40px;
    padding: 20px 60px;
    overflow-x: auto;

    cursor: grab;

    @include s.no-scrollbar;

    &_dragging {
      cursor: grabbing;
      user-select: none;
    }

    @include a.tablet {
      margin-top: 56px;
      padding: 20px 40px;
      overflow: visible;
    }

    @include a.mobile {
      margin-top: 32px;
      padding: 20px;
    }

    &-item {
      flex-shrink: 0;

      &:not(:first-child) {
        margin-left: 16px;
      }
    }
  }

  &__container {
    position: relative;
    z-index: 2;

    pointer-events: none;
  }

  &__shape {
    position: absolute;

    // top: -116px;
    // right: 36px;

    top: -20px;
    right: 100px;
    z-index: 1;

    width: 142px;

    // top/right тоже анимируем: у формы «flower» другие координаты,
    // и без перехода фигура скачком перескакивала на новое место

    transition: transform 0.6s, top 0.6s, right 0.6s;

    @include a.mobile {
      width: 100px;
    }

    @include s.hover {
      transform: scale(0.85);
    }

    &_flower {
      top: -120px;
      right: -50px;

      transform: rotate(50deg) scale(1.4);

      @include a.tablet {
        top: -60px;
        right: -90px;
      }
    }

    // &_hexagon {
    //   transform: scale(1.35);

    //   @include a.tablet {
    //     transform: scale(1);
    //   }
    // }

    &_hexagonGreen {
      transform: scale(1.05);

      @include a.mobile {
        transform: scale(1);
      }
    }
  }
}
</style>
