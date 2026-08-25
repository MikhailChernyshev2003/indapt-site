<script lang="ts" setup>
const {
  tabs,
} = defineProps<{
  tabs: {
    label: string;
    text: string;
    image: string;
  }[];
}>();

const { isDesktop } = useDevice();

const activeTabIndex = ref(0);
const activeTab = computed(() => tabs[activeTabIndex.value]);

const setActiveTab = async (index: number) => {
  activeTabIndex.value = index;

  if (isDesktop.value) return;

  setTimeout(() => {
    const activeTab = document.querySelector('.tabs-content__tab_active .tabs-content__tab-button');
    if (!activeTab) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const rect = activeTab.getBoundingClientRect();
    const elementAbsoluteTop = scrollTop + rect.top;

    window.scrollTo({
      top: elementAbsoluteTop - 60,
      behavior: 'smooth',
    });
  }, 300);
};
</script>

<template>
  <div class="tabs-content">
    <div class="tabs-content__tabs">
      <div
        v-for="(tab, idx) in tabs"
        :key="idx"
        :class="bem('tabs-content__tab', { active: idx === activeTabIndex })"
      >
        <button
          class="tabs-content__tab-button"
          type="button"
          @mouseenter="setActiveTab(idx)"
          @click="setActiveTab(idx)"
        >
          {{ tab.label }}
        </button>

        <div class="tabs-content__content-collapse">
          <div class="tabs-content__content tabs-content__content_tablet">
            <p class="tabs-content__text">{{ tab.text }}</p>
            <img
              :src="tab.image"
              alt="method"
              class="tabs-content__image"
            />
          </div>
        </div>
      </div>
    </div>

    <transition mode="out-in" name="fade-slow">
      <div :key="activeTab.label" class="tabs-content__content tabs-content__content_desktop">
        <p class="tabs-content__text">{{ activeTab.text }}</p>
        <img
          :src="activeTab.image"
          alt="method"
          class="tabs-content__image"
        />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;
@use "@/assets/styles/adaptive" as a;

.tabs-content {
  position: relative;

  display: grid;
  grid-gap: 127px;
  grid-template-columns: 1fr 652px;

  @include a.tablet {
    grid-template-columns: 1fr;
  }
}

.tabs-content__tabs {
  display: flex;
  flex-direction: column;
}

.tabs-content__tab {
  height: auto;

  &:not(&_active) &-button {
    @include s.hover {
      color: var(--dark-blue-60);
    }
  }

  &_active {
    .tabs-content__tab-button {
      color: var(--dark-blue);
    }

    .tabs-content__content-collapse {
      grid-template-rows: 1fr;
      margin-top: 32px;

      opacity: 1;

      @include a.mobile {
        margin: 16px 0;
      }
    }
  }

  &:not(:first-child) &-button {
    padding-top: 40px;

    @include a.mobile {
      padding-top: 24px;
    }
  }

  &:not(:last-child) &-button {
    padding-bottom: 40px;

    border-bottom: 1px solid var(--dark-blue-20);

    @include a.mobile {
      padding-bottom: 24px;
    }
  }

  &-button {
    width: 100%;

    color: var(--dark-blue-40);

    text-align: start;

    transition: color .15s ease;

    @include t.lead-m-medium;

    @include a.mobile  {
      @include t.lead-s-medium;
    }
  }
}

.tabs-content__text {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

.tabs-content__content {
  display: flex;
  flex-direction: column;

  &_desktop {
    @include a.tablet {
      display: none;
    }
  }

  &_tablet {
    display: none;
    min-height: 0;
    overflow: hidden;

    @include a.tablet {
      display: flex;
    }
  }
}

.tabs-content__image {
  width: 100%;

  margin-top: 64px;
  margin-left: auto;

  border-radius: 16px;

  @include a.tablet {
    width: 100%;

    height: 300px;
    margin-top: 38px;

    object-fit: contain;
    object-position: center;
  }

  @include a.mobile {
    width: 100%;
    height: 219px;
    min-height: unset;
    margin-top: 16px;
    object-fit: cover;
  }
}

.tabs-content__content-collapse {
  display: grid;
  grid-template-rows: 0fr;

  opacity: 0;

  transition: .3s ease;
  transition-property: grid-template-rows, margin, opacity;

  @include a.desktop-only {
    display: none;
  }
}
</style>
