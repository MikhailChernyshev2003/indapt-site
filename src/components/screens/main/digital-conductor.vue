<script setup lang="ts">
const formHandler = useFormHandler();
const { t } = useI18n();

const scrollToSecondSection = () => {
  window.scrollTo(0, 1600);
};

const openForm = () => {
  formHandler.handlerFormOpen(true);
  document.body.classList.add('lock');
};
</script>

<template>
  <section class="digital-conductor">
    <div class="digital-conductor__container container">
      <h1 class="digital-conductor__title" v-html="t('mainPage.digitalConductor.title')" />

      <div class="digital-conductor__info">
        <p class="digital-conductor__info-text" v-html="t('mainPage.digitalConductor.text')" />
        <atoms-button class="digital-conductor__button" @click="openForm">
          {{ t('mainPage.digitalConductor.button') }}
        </atoms-button>
      </div>

      <div class="digital-conductor__scroll-button-wrapper">
        <button
          class="digital-conductor__scroll-button"
          @click="scrollToSecondSection"
        >
          <span class="digital-conductor__scroll-button-text">{{ t('mainPage.digitalConductor.scroll') }}</span>
          <svgo-arrow-right-blue
            class="digital-conductor__scroll-button-icon"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/variables" as v;

.digital-conductor {
  position: relative;

  width: 100%;
  height: 100vh;
  padding-top: 160px;

  @include a.tablet {
    padding-top: 145px;
  }

  @include a.mobile {
    padding-top: 96px;
  }

  &__container {
    display: grid;
    grid-gap: 57px;
    grid-template-columns: 722px 541px;
    height: 100%;

    @include a.tablet {
      display: block;
    }
  }

  &__title {
    height: fit-content;

    color: var(--dark-blue);

    @include t.h1;

    @include a.mobile {
      letter-spacing: 0;

      @include t.h4;
    }

    & * {
      font-family: v.$font-involve;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    height: fit-content;

    @include a.tablet {
      margin-top: 26px;
    }

    @include a.mobile {
      margin-top: 16px;
    }
  }

  &__info-text {
    width: 80%;
    margin-bottom: 20px;
    padding-top: 12px;

    color: var(--dark-blue);

    @include t.lead-m-medium;

    @include a.tablet {
      width: 100%;
      margin-bottom: 40px;
      padding-top: 0;
    }

    @include a.mobile {
      margin-bottom: 26px;

      @include t.body-s-medium-135;
    }
  }

  &__scroll-button-wrapper {
    position: absolute;
    bottom: 24px;

    width: 100%;

    @include a.tablet {
      left: 0;
      bottom: 60px;
    }

    @include a.mobile {
      // bottom: 32px;
      bottom: 4vh;
    }
  }

  &__scroll-button {
    display: flex;
    align-items: center;
    width: fit-content;
    margin: 0 auto;
    padding: 11px 15px 11px 17px;

    background: var(--white-30);
    border: 1px solid var(--blue-30);
    border-radius: 100px;
    filter: blur(0);

    backdrop-filter: blur(5px);

    @include a.mobile {
      bottom: 20px;
    }
  }

  &__scroll-button-text {
    margin-right: 8px;

    color: var(--medium-blue);
    font-weight: 600;
    font-size: 16px;
    line-height: 128%;
  }

  &__scroll-button-icon {
    width: 20px;
    height: 20px;

    color: var(--medium-blue);

    transform: rotate(90deg);
  }
}
</style>
