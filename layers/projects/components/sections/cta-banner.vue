<script setup lang="ts">
import { FOOTER_SOCIAL_URLS_RU } from '~/shared/constants/footer-social';

const { t } = useI18n();
</script>

<template>
  <!-- Баннер «кейсы пополняются»: приглашение в telegram
       с синим шестиугольным паттерном за текстом -->
  <section class="cta-banner">
    <div class="cta-banner__card">
      <div class="cta-banner__decor" aria-hidden="true">
        <services-molecules-layered-shape
          type="hexagon"
          :offset="79"
          :rings="8"
          :rotate="172"
        />
      </div>
      <div class="cta-banner__content">
        <div class="cta-banner__head">
          <h2 class="cta-banner__title" v-html="t('projects.general.subscribe.title')" />
          <p class="cta-banner__text" v-html="t('projects.general.subscribe.text')" />
        </div>
        <a
          class="cta-banner__button"
          :href="FOOTER_SOCIAL_URLS_RU.telegram"
          target="_blank"
          rel="noopener"
        >
          <span class="cta-banner__button-text">{{ t('projects.general.subscribe.button') }}</span>
          <span class="cta-banner__button-dot" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.cta-banner {
  @include s.base-container;
}

.cta-banner__card {
  position: relative;

  min-height: 258px;
  padding: 46px;
  overflow: hidden;

  background-color: var(--projects-cta-bg, #dfe8ff);
  border-radius: 16px;

  @include a.mobile {
    padding: 24px 20px;
  }
}

// Ядро паттерна у правого края, кольца обрезает карточка

.cta-banner__decor {
  position: absolute;
  top: 105px;
  left: 751px;

  width: 162px;

  pointer-events: none;

  @include a.tablet {
    left: 60%;
  }
}

.cta-banner__content {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
}

.cta-banner__head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 663px;
}

.cta-banner__title {
  color: var(--dark-blue);

  @include t.h5;

  @include a.mobile {
    @include t.lead-m-medium;
  }
}

.cta-banner__text {
  color: var(--dark-blue);

  @include t.body-l-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}

// Кнопка из макета: обводка, блюр-подложка и точка после текста

.cta-banner__button {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 14px 28px 16px;

  color: var(--dark-blue);

  background-color: var(--white-20);
  border: 1px solid var(--dark-blue);
  border-radius: 100px;
  backdrop-filter: blur(5px);

  @include t.caption-l-semi;
  @include s.default-transition(background-color);

  @include s.hover {
    background-color: var(--white-60);
  }
}

.cta-banner__button-dot {
  width: 8px;
  height: 8px;
  margin-top: 3px;

  background-color: var(--dark-blue);
  border-radius: 50%;
}
</style>
