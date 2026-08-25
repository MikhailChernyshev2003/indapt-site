<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section class="digital-info">
    <div class="digital-info__container container">
      <h2 class="digital-info__title" v-html="t('mainPage.digitalInfo.title')" />

      <div class="digital-info__info-content">
        <p class="digital-info__info-text">
          <span :class="bem('digital-info__info-text', { caption: true })">(info)</span>
          <span v-html="t('mainPage.digitalInfo.text')" />
        </p>

        <div class="digital-info__info-text digital-info__info-text_2">
          <div v-html="t('mainPage.digitalInfo.text2')" />
          <div class="digital-info__info-text-gradient" />
        </div>
      </div>

      <AtomsButton
        class="digital-info__link"
        mode="text"
        href="/about"
      >
        {{ t('mainPage.digitalInfo.button') }}
      </AtomsButton>
    </div>
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;

.digital-info {
  position: relative;

  width: 100%;
  min-height: 100vh;

  &__container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;

    @include a.tablet {
      height: auto;
      padding-top: 110px;
    }
  }

  &__title {
    margin-bottom: 22px;

    color: var(--dark-blue);

    @include t.h1;

    @include a.tablet {
      margin-bottom: 26px;
    }

    @include a.mobile {
      margin-bottom: 16px;

      @include t.h4;
    }
  }

  &__info-content {
    display: flex;
    flex-direction: column;

    will-change: height;
  }

  &__info-text {
    position: relative;
    z-index: 1;

    display: inline-block;
    margin-bottom: 12px;

    color: var(--dark-blue);

    will-change: height;

    @include t.lead-m-medium;

    @include a.mobile {
      width: 300px;

      @include t.body-s-medium-135;

      br {
        display: none;
      }
    }

    &-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;

      width: 590px;
      height: 70px;

      background: linear-gradient(180deg, rgb(255 255 255 / 0%) 50%, var(--bg));
    }

    &_caption {
      margin: 0 28px 0 0;

      @include t.caption-m-medium;

      @include a.mobile {
        width: auto;
        margin-right: 12px;

        @include t.caption-xs-medium;
      }
    }

    &:last-child {
      margin-bottom: 32px;

      @include a.mobile {
        margin-bottom: 22px;
      }
    }
  }

  &__link {
    flex-shrink: 0;
  }
}
</style>
