<script setup lang="ts">
const { t } = useI18n();

const formHandler = useFormHandler();

const openForm = () => {
  formHandler.handlerFormOpen(true);
  document.body.classList.add('lock');
};
</script>

<template>
  <section class="banner">
    <div class="banner__wrapper">
      <h3 class="banner__title">{{ t("contactsPage.banner.title") }}</h3>
      <p class="banner__text" v-html="t('contactsPage.banner.text')" />
      <AtomsButton
        class="banner__button"
        mode="secondary"
        @click="openForm"
      >
        {{ t("contactsPage.banner.button") }}
      </AtomsButton>
    </div>
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;

.banner {
  padding: 46px;

  background-image: url("/images/banner/banner-bg.png");
  background-position: top right;
  background-size: cover;
  border-radius: 16px;

  @include a.tablet {
    padding: 32px;

    background-image: url("/images/banner/banner-bg-tablet.png");
  }

  @include a.mobile {
    padding: 24px 24px 120px;

    background-image: url("/images/banner/banner-bg-mobile.png");
    background-position: bottom right;
    border-radius: 24px;
  }

  &__wrapper {
    max-width: 663px;

    @include a.tablet {
      max-width: 422px;
    }
  }

  &__title {
    @include t.h2;

    @include a.mobile {
      font-weight: 500;
      font-size: 30px;
      line-height: 120%;
    }
  }

  &__text {
    margin-top: 12px;

    @include t.lead-s-medium;

    @include a.tablet {
      margin-top: 8px;

      line-height: 150%;

      @include t.lead-s-medium;
    }

    @include a.mobile {
      @include t.body-s-medium;
    }
  }

  &__button {
    margin-top: 24px;

    backdrop-filter: blur(5px);
  }
}
</style>
