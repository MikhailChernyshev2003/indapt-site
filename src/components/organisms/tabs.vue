<script setup lang="ts">
import type { Tab } from '@/types';

defineProps<{ tabs: Tab[]; type?: string }>();

const activeTab = defineModel<string>('active');

const isMounted = ref(false);

const tabsRef = shallowRef<HTMLButtonElement[]>([]);
const containerRef = shallowRef<HTMLElement>();

const decorationRef = useTemplateRef<HTMLElement>('decorationRef');

const getScrollableParent = (el: HTMLElement): HTMLElement => {
  let parent = el.parentElement;
  while (parent) {
    const { overflowX } = getComputedStyle(parent);
    if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document.documentElement;
};

const scrollToActiveTab = () => {
  if (!containerRef.value || !tabsRef.value) return;

  const activeElement = tabsRef.value.find(element => element.ariaSelected === 'true');
  if (!activeElement) return;

  const scrollable = getScrollableParent(containerRef.value);

  const scrollableRect = scrollable.getBoundingClientRect();
  const activeRect = activeElement.getBoundingClientRect();

  const activeElementOffsetLeft = activeRect.left - scrollableRect.left + scrollable.scrollLeft;
  const scrollableWidth = scrollable.clientWidth;
  const activeElementWidth = activeRect.width;

  const isVisible
    = activeElementOffsetLeft >= scrollable.scrollLeft
      && activeElementOffsetLeft + activeElementWidth <= scrollable.scrollLeft + scrollableWidth;

  if (!isVisible) {
    const targetScrollLeft = activeElementOffsetLeft - (scrollableWidth / 2) + (activeElementWidth / 2);

    scrollable.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });
  }
};

const updateDecorationPosition = async () => {
  await nextTick();

  requestAnimationFrame(() => {
    if (!tabsRef.value || !decorationRef.value || !containerRef.value) return;

    const activeElement = tabsRef.value.find(
      element => element.ariaSelected === 'true',
    );
    if (!activeElement) return;

    const containerRect = containerRef.value.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    decorationRef.value.style.left = `${activeRect.left - containerRect.left}px`;
    decorationRef.value.style.width = `${activeRect.width - 1}px`;
  });
};

const startDecorationAnimate = () => {
  if (!decorationRef.value) return;
  decorationRef.value.style.transition = 'left 0.3s ease, width 0.3s ease';
};

const endDecorationAnimate = () => {
  if (!decorationRef.value) return;
  decorationRef.value.style.removeProperty('transition');
};

const handleClickTab = (key: string) => {
  if (key === activeTab.value) return;

  startDecorationAnimate();
  activeTab.value = key;

  nextTick(() => {
    scrollToActiveTab();
  });
};

watch(activeTab, () => {
  nextTick(() => {
    updateDecorationPosition();
  });
});

onMounted(() => {
  if (!containerRef.value) return;

  nextTick(() => {
    scrollToActiveTab();
    updateDecorationPosition();
  });

  isMounted.value = true;
});

useEventListener(decorationRef, 'transitionend', endDecorationAnimate);

// Размеры табов тянутся за шириной экрана (rem от vw): после ресайза
// или поворота подчёркивание пересчитываем, иначе оно уезжает с активного таба
useResizeObserver(containerRef, () => {
  updateDecorationPosition();
});
</script>

<template>
  <div
    ref="containerRef"
    class="tabs"
    role="tablist"
    :class="{ 'tabs_with-scroll': type !== 'button' }"
  >
    <client-only>
      <span
        v-if="type !== 'button'"
        ref="decorationRef"
        aria-hidden="true"
        class="tabs__decoration"
      />
    </client-only>

    <button
      v-for="tab in tabs"
      :key="tab.key"
      ref="tabsRef"
      role="tab"
      :aria-selected="tab.key === activeTab"
      :aria-controls="`panel-${tab.key}`"
      class="tabs__item"
      :class="{
        tabs__item_decor: tab.key === activeTab && !isMounted,
        tabs__item_button: type === 'button',
      }"
      @click="handleClickTab(tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;
@use "assets/styles/shared" as s;

.tabs {
  position: relative;
  z-index: 1;

  display: flex;

  width: max-content;

  &_with-scroll {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.tabs__item {
  position: relative;
  z-index: 1;

  flex-shrink: 0;

  padding: 12px 24px;

  color: var(--dark-blue-40);
  white-space: nowrap;

  transition: color 0.15s ease;

  @include t.caption-m-medium;

  @include a.mobile {
    padding: 12px 20px;

    @include t.caption-xs-medium;
  }

  @include s.hover {
    color: var(--dark-blue-60);
  }

  &_button {
    color: var(--dark-blue);

    border: 1px solid var(--dark-blue-20);
    border-radius: 100px;

    transition: background 0.3s, color 0.3s;

    @include t.caption-s-semi-128;

    @include a.mobile {
      padding: 12px 24px;

      @include t.caption-s-semi-128;
    }

    &:not(:last-child) {
      margin-right: 6px;

      @include a.mobile {
        margin-right: 8px;
      }
    }

    &[aria-selected="true"] {
      color: var(--white) !important;

      background: var(--dark-blue);
    }
  }

  &[aria-selected="true"] {
    color: var(--dark-blue);
  }

  &_decor::before {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 1px;

    background-color: var(--dark-blue);

    content: "";
  }
}

.tabs__decoration {
  position: absolute;
  bottom: 0;
  z-index: 1;

  display: block;
  height: 1px;

  background-color: var(--dark-blue);

  content: "";

  pointer-events: none;
}
</style>
