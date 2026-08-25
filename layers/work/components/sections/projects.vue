<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section class="projects">
    <div class="projects__wrapper">
      <div class="projects__head">
        <h2 class="projects__title" v-html="t('workPage.projects.title')" />
        <p class="projects__text" v-html="t('workPage.projects.text1')" />
      </div>
      <div class="projects__content">
        <p class="projects__content-text" v-html="t('workPage.projects.text2')" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.projects {
  &__wrapper {}

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include a.tablet {
      display: block;
    }
  }

  &__title {
    max-width: 600px;

    @include t.h1;

    @include a.mobile {
      max-width: 80%;

      @include t.h4;
    }
  }

  &__text {
    max-width: 652px;

    // Figma: Manrope 24px / 128% / 500
    @include t.lead-m-medium;

    @include a.tablet {
      margin-top: 16px;
    }

    @include a.mobile {
      margin-top: 10px;

      @include t.lead-m-medium;
    }
  }

  &__content {
    max-width: 652px;
    margin-top: 64px;
    margin-left: auto;

    @include a.tablet {
      max-width: 100%;
      margin-top: 32px;
      margin-left: 0
    }

    @include a.mobile {
      margin-top: 18px;
    }

    &-text {
      @include t.h3;

      @include a.mobile {
        @include t.h5;
      }
    }

    &-button {
      margin-top: 32px;
    }
  }
}
</style>
