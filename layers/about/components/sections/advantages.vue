<script setup lang="ts">
const { isMobile, isTablet } = useDevice();

const { t } = useI18n();

const tabs = computed(() => [
  {
    label: t('aboutPage.advantages.tab1.label'),
    text: t('aboutPage.advantages.tab1.text'),
    image: '/images/about/slide-1.png',
    imageTablet: '/images/about/slide-1-t.png',
    imageMobile: '/images/about/slide-1-m.png',
  },
  {
    label: t('aboutPage.advantages.tab2.label'),
    text: t('aboutPage.advantages.tab2.text'),
    image: '/images/about/slide-2.png',
    imageTablet: '/images/about/slide-2-t.png',
    imageMobile: '/images/about/slide-2-m.png',
  },
  {
    label: t('aboutPage.advantages.tab3.label'),
    text: t('aboutPage.advantages.tab3.text'),
    image: '/images/about/slide-3.png',
    imageTablet: '/images/about/slide-3-t.png',
    imageMobile: '/images/about/slide-3-m.png',
  },
]);

const renderTabs = computed(() => {
  return tabs.value.map(el => isMobile.value ? { ...el, image: el.imageMobile } : isTablet.value ? { ...el, image: el.imageTablet } : { ...el });
});
</script>

<template>
  <section class="advantages">
    <div class="advantages__wrapper">
      <h2 class="advantages__title" v-html="t('aboutPage.advantages.title')" />
      <organisms-tabs-content class="advantages__tabs" :tabs="renderTabs" />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.advantages {
  &__wrapper {
  }

  &__title {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__tabs {
    height: 460px;
    margin-top: 52px;

    @include a.tablet {
      height: auto;
    }

    @include a.mobile {
      margin-top: 32px;

      :deep(.tabs-content__text) {
        @include t.body-m-medium;
      }

      :deep(.tabs-content__tab_active .tabs-content__content-collapse) {
        margin: unset;
        margin: 24px 0 0 0;
      }
    }

    :deep(.tabs-content__tab-button) {
      @include t.h5;
    }
  }

  &__list {
    margin-top: 40px;

    @include a.mobile {
      margin-top: 32px;
    }

    &-item {
      &:not(:first-child) {
        margin-top: 40px;

        @include a.mobile {
          margin-top: 34px;
        }
      }

      &-title {
        width: 100%;
        padding-bottom: 32px;

        border-bottom: 1px solid var(--dark-blue-40);

        @include t.lead-m-medium;

        @include a.mobile {
          padding-bottom: 16px;

          @include t.lead-s-medium;
        }
      }

      &-text {
        padding-top: 16px;

        @include t.lead-m-medium;

        @include a.mobile {
          @include t.lead-s-medium;
        }
      }

      &-img {
        width: 100%;
        margin-top: 16px;
      }
    }
  }

  :deep(.tabs-content__image) {
    margin-top: 24px;

    @include a.mobile {
      height: 522px;
    }
  }

  :deep(.tabs-content__tab_active .tabs-content__content-collapse) {
    @include a.tablet {
      margin-top: 8px;
    }

    @include a.mobile {
      margin-top: 22px;
    }
  }

  @include a.mobile {
    :deep(.tabs-content__tab:not(:first-child) .tabs-content__tab-button) {
      padding: 32px 0;
    }
  }
}
</style>
