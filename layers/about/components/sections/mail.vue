<script setup lang="ts">
import DecorDesktop from '@/assets/images/subscribe/decor-desktop.png';
import DecorTablet from '@/assets/images/subscribe/decor-tablet.png';
import DecorMobile from '@/assets/images/subscribe/decor-mobile.png';

const { isDesktop, isTablet } = useDevice();

const { t } = useI18n();

const formHandler = useFormHandler();

const openPresentationForm = () => {
  formHandler.handlerPresentationFormOpen(true);
  document.body.classList.add('lock');
};
</script>

<template>
  <section class="mail">
    <div class="mail__wrapper">
      <h2 class="mail__title">{{ t('aboutPage.mail.title') }}</h2>
      <p class="mail__text" v-html="t('aboutPage.mail.text')" />
      <atoms-button
        class="mail__button"
        mode="secondary"
        @click="openPresentationForm"
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

  // Отступы крупнее, чем у баннера «Работа с нами» в макете (46 / 12 / 24):
  // текст презентации длиннее и в два предложения — с прежними отступами блок выглядел слипшимся

  padding: 56px;
  overflow: hidden;

  background: #DFE8FF;
  border-radius: 16px;

  @include a.tablet {
    padding: 48px 40px;
  }

  @include a.mobile {
    padding: 28px 24px;
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
    margin-top: 16px;

    @include t.lead-s-medium;

    @include a.mobile {
      @include t.body-s-medium
    }
  }

  &__button {
    margin-top: 36px;

    @include a.mobile {
      margin-top: 28px;
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
