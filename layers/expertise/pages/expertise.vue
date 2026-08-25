<script setup lang="ts">
import type { ConcreteComponent } from 'vue';
import { expertiseCases, expertiseTabs, expertiseTabsEng } from '@l-expertise/configs';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const { t, locale } = useI18n();

useSeoMeta({
  title: t('expertise.seoTitle'),
});

type ExpertiseKey = (typeof expertiseTabs)[number]['key'];

const activeTab = useRouteQuery<ExpertiseKey>('tab', 'industry', {
  mode: 'replace',
});
const displayedTab = ref<ExpertiseKey>(activeTab.value);
let tabSwitchToken = 0;

const TABS_MAP: Record<ExpertiseKey, ConcreteComponent | string> = {
  industry: resolveComponent('ExpertiseTabsIndustry'),
  transport: resolveComponent('ExpertiseTabsTransport'),
  trade: resolveComponent('ExpertiseTabsTrade'),
  science: resolveComponent('ExpertiseTabsScience'),
  health: resolveComponent('ExpertiseTabsHealth'),
  fintech: resolveComponent('ExpertiseTabsFintech'),
};

const tabsRef = useTemplateRef('tabsRef');
const sentinelRef = ref<HTMLElement | null>(null);
const isSticky = ref(false);
const tabsOpacity = ref(false);
const isStickyContainerVisible = ref(false);
let stickyOpacityTimeoutId: ReturnType<typeof setTimeout> | null = null;

const getHeroHeight = (): number => {
  const hero = document.querySelector('.expertise > .hero') as HTMLElement | null;
  return hero?.offsetHeight ?? 0;
};

const localeTabs = computed(() => {
  if (locale.value === 'ru') {
    return expertiseTabs;
  }

  return expertiseTabsEng;
});

const initStickyObserver = () => {
  const header: HTMLDivElement | null = document.querySelector('.header');

  const setHeaderBlur = (sticky: boolean) => {
    isSticky.value = sticky;
    if (!header) return;
    header.style.backdropFilter = sticky ? 'blur(0px)' : 'blur(20px)';
    header.style.setProperty('-webkit-backdrop-filter', sticky ? 'blur(0px)' : 'blur(20px)');
  };

  const onScroll = () => {
    const heroHeight = getHeroHeight();
    if (!heroHeight) return;
    setHeaderBlur(window.scrollY >= heroHeight);
  };

  window.addEventListener('scroll', onScroll);

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
  });
};

const activeCase = computed(() => {
  return expertiseCases.find(el => el.tab === displayedTab.value);
});

const smoothScrollTo = (targetTop: number): Promise<void> => {
  return new Promise((resolve) => {
    const startTop = window.scrollY;
    const distance = targetTop - startTop;
    const absDistance = Math.abs(distance);

    if (absDistance < 1) {
      resolve();
      return;
    }

    const durationMs = Math.max(350, Math.min(900, absDistance * 0.45));
    const startedAt = performance.now();

    const tick = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startedAt) / durationMs);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextTop = startTop + distance * easedProgress;

      window.scrollTo({ top: nextTop, behavior: 'auto' });

      if (progress >= 1) {
        window.scrollTo({ top: targetTop, behavior: 'auto' });
        resolve();
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
};

watch(activeTab, async (newTab) => {
  const heroHeight = getHeroHeight();
  const currentToken = ++tabSwitchToken;

  if (window.scrollY <= heroHeight) {
    displayedTab.value = newTab;
    return;
  }

  await smoothScrollTo(heroHeight);

  if (currentToken !== tabSwitchToken) return;
  displayedTab.value = newTab;
  await nextTick();
  window.scrollTo({ top: heroHeight, behavior: 'auto' });
});

onMounted(() => {
  nextTick(() => {
    initStickyObserver();
  });

  stickyOpacityTimeoutId = setTimeout(() => {
    isStickyContainerVisible.value = true;
    stickyOpacityTimeoutId = null;
  }, 500);
});

onUnmounted(() => {
  if (stickyOpacityTimeoutId !== null) {
    clearTimeout(stickyOpacityTimeoutId);
  }

  const header: HTMLDivElement | null = document.querySelector('.header');
  if (header) {
    header.style.backdropFilter = 'blur(20px)';
    header.style.setProperty('-webkit-backdrop-filter', 'blur(20px)');
  }
});
</script>

<template>
  <div class="expertise">
    <expertise-organisms-hero />

    <div
      class="expertise__sticky-container"
      :class="{ 'expertise__sticky-container_visible': isStickyContainerVisible }"
    >
      <div ref="sentinelRef" class="sticky-sentinel" />
      <div
        ref="tabsRef"
        class="expertise__tabs"
        :class="{ expertise__tabs_hide: tabsOpacity }"
      >
        <organisms-tabs v-model:active="activeTab" :tabs="localeTabs" />
      </div>

      <div :class="`expertise__content expertise__content_${displayedTab}`">
        <transition
          name="fade"
          mode="out-in"
          @before-enter="() => ScrollTrigger.refresh()"
        >
          <component :is="TABS_MAP[displayedTab]" :key="displayedTab" />
        </transition>
      </div>

      <div :class="`expertise__cases expertise__cases_${displayedTab}`">
        <transition
          name="fade"
          mode="out-in"
          @before-enter="() => ScrollTrigger.refresh()"
        >
          <expertise-molecules-case v-if="activeCase" :data="activeCase" />
        </transition>
      </div>

      <div class="expertise__questions">
        <expertise-organisms-questions v-model:active="activeTab" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.expertise {
  background-color: var(--white);

  &__sticky-container {
    position: relative;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.35s ease;

    &_visible {
      opacity: 1;
    }
  }

  .sticky-sentinel {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 1px;

    opacity: 0;

    pointer-events: none;
  }
}

.expertise__tabs {
  position: sticky;
  top: -54px;
  left: 0;
  z-index: 10;

  padding-top: 120px;

  background: rgb(var(--sea-blue-20), 0.4);
  backdrop-filter: blur(20px);

  transition: opacity 0.1s;

  @include s.base-container;

  @include a.tablet {
    margin-top: 60px;
    overflow: auto;

    scroll-snap-type: x mandatory;
    scroll-snap-stop: always;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @include a.mobile {
    top: 0;

    margin-top: 0;
    padding-top: 48px;
  }

  &_hide {
    opacity: 0;

    pointer-events: none
  }
}

.expertise__cases {
  @include s.base-container;

  @include a.tablet {
    padding-top: 108px;
    padding-bottom: 80px;
  }

  @include a.mobile {
    padding-bottom: 40px;
  }

  &_trade {
    @include a.mobile {
      padding-top: 69px;
    }
  }

  &_fintech {
    @include a.tablet {
      padding-top: 120px;
    }

    @include a.mobile {
      padding-top: 80px;
    }
  }

    &_science {
    @include a.mobile {
      padding-top: 84px !important;
    }
  }
}

.expertise__content {
  margin-top: 60px;

  padding-bottom: 120px;

  @include s.base-container;

  @include a.tablet {
    margin-top: 52px;
    padding-bottom: 0;
  }

  @include a.mobile {
    margin-top: 40px;

    padding-bottom: 80px;
  }

  &_industry {
    padding-bottom: 162px;

    @include a.mobile {
      padding-bottom: 3px !important;
    }
  }

  &_transport {
    padding-bottom: 170px;

     @include a.mobile {
      padding-bottom: 0 !important;
    }
  }

  &_trade {
    @include a.tablet {
      padding-bottom: 12px !important;
    }
  }

  &_fintech {
    @include a.mobile {
      padding-bottom: 0 !important;
    }
  }

  &_science {
    @include a.mobile {
      padding-bottom: 0 !important;
    }
  }
}

.expertise__questions {
  margin-top: 120px;
  padding-bottom: 30px;

  @include a.desktop-only {
    padding-bottom: 100px;
  }

  @include s.base-container;

  @include a.tablet {
    margin-top: 83px;
    padding-bottom: 68px;
  }

  @include a.mobile {
    margin-top: 40px;
    padding-bottom: 16px;
  }

  :deep(.collapse-text__body-inner) {
    @include a.mobile {
      font-size: 14px;
    }
  }
}
</style>
