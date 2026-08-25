<script setup lang="ts">
import DecorDesktop from '@/assets/images/subscribe/decor-desktop.png';
import DecorTablet from '@/assets/images/subscribe/decor-tablet.png';
import DecorMobile from '@/assets/images/subscribe/decor-mobile.png';

const { isDesktop, isTablet } = useDevice();

const { t } = useI18n();
</script>

<template>
  <section class="mail">
    <div class="mail__wrapper">
      <h2 class="mail__title">{{ t('aboutPage.mail.title') }}</h2>
      <p class="mail__text" v-html="t('aboutPage.mail.text')" />
      <atoms-button
        class="mail__button"
        mode="secondary"
        href="/work?scrollToBlock=work__vacancies"
      >
        {{ t('aboutPage.mail.button') }}
      </atoms-button>
      <img
        class="mail__img"
        :src="isDesktop ? DecorDesktop : isTablet ? DecorTablet : DecorMobile"
        alt="decor"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.mail {
  position: relative;
  z-index: 1;

  padding: 46px;
  overflow: hidden;

  background: #DFE8FF;
  border-radius: 16px;

  @include a.mobile {
    padding: 24px;
  }

  &__wrapper {
    width: 100%;
    max-width: 663px;

    @include a.tablet {
      max-width: 540px;
    }
  }

  &__title {
    @include t.h2;

    @include a.tablet {
      @include t.h3;
    }

    @include a.mobile {
      @include t.h5;
    }
  }

  &__text {
    margin-top: 12px;

    @include t.lead-s-medium;

    @include a.mobile {
      @include t.body-s-medium
    }
  }

  &__button {
    margin-top: 24px;

    @include a.mobile {
      padding: 24px 28px !important;
    }
  }

  &__img {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;

    width: 880px;
    height: 100%;

    pointer-events: none;

    @include a.tablet {
      width: auto;
    }
  }
}
</style>
