<script setup lang="ts">
const { isDesktop, isTablet } = useDevice();

const { t } = useI18n();

const tabs = computed(() => [
  {
    label: t('workPage.team.tab1.title'),
    text: t('workPage.team.tab1.text'),
    image: '/images/work/slide-1.png',
    imageTablet: '/images/work/slide-1-tablet.png',
    imageMobile: '/images/work/slide-1-mobile.png',
  },
  {
    label: t('workPage.team.tab2.title'),
    text: t('workPage.team.tab2.text'),
    image: '/images/work/slide-2.png',
    imageTablet: '/images/work/slide-2-tablet.png',
    imageMobile: '/images/work/slide-2-mobile.png',
  },
  {
    label: t('workPage.team.tab3.title'),
    text: t('workPage.team.tab3.text'),
    image: '/images/work/slide-3.png',
    imageTablet: '/images/work/slide-3-tablet.png',
    imageMobile: '/images/work/slide-3-mobile.png',
  },
]);
</script>

<template>
  <section class="team">
    <div class="team__wrapper">
      <h2 class="team__title" v-html="t('workPage.team.title')" />
      <organisms-tabs-content
        v-if="isDesktop"
        class="team__tabs"
        :tabs="tabs"
      />
      <div v-else class="team__list">
        <div
          v-for="tab in tabs"
          :key="tab.label"
          class="team__list-item"
        >
          <p class="team__list-item-title" v-html="tab.label" />
          <p class="team__list-item-text" v-html="tab.text" />
          <atoms-picture class="team__list-item-img" :src="isDesktop ? tab.image : isTablet ? tab.imageTablet : tab.imageMobile" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.team {
  &__wrapper {
  }

  &__title {
    max-width: 652px;

    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__tabs {
    margin-top: 60px;
  }

  &__list {
    margin-top: 40px;

    @include a.tablet {
      margin-top: 44px;
    }

    @include a.mobile {
      margin-top: 32px;
    }

    &-item {
      &:not(:first-child) {
        margin-top: 40px;

        @include a.tablet {
          margin-top: 34px;
        }
      }

      &-title {
        width: 100%;
        padding-bottom: 32px;

        border-bottom: 1px solid var(--dark-blue-40);

        @include t.lead-m-medium;

        @include a.tablet {
          padding-bottom: 16px;
        }

        @include a.mobile {
          @include t.lead-s-medium;
        }
      }

      &-text {
        padding-top: 16px;

        @include t.lead-m-medium;

        @include a.tablet {
          max-width: 400px
        }

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

  :deep(.tabs-content__text) {
    max-width: 400px;
  }

  :deep(.tabs-content__image) {
    height: 288px;
    margin-top: 32px;
  }
}
</style>
