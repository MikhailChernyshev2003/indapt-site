<script setup lang="ts">
import {
  DEVELOPMENT_CARD_POSITIONS,
  DEVELOPMENT_CARDS,
  DEVELOPMENT_CARDS_FIGURE,
  DEVELOPMENT_STEPS,
  DEVELOPMENT_STEPS_FIGURE,
  DEVELOPMENT_TAGS,
} from '@l-services/configs';

const I18N_KEY = 'services.development';
const SLUG = 'development';

const { t } = useI18n();

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const cardItems = computed(() =>
  DEVELOPMENT_CARDS.map(key => ({
    title: t(`${I18N_KEY}.cards.${key}.title`),
    text: t(`${I18N_KEY}.cards.${key}.description`),
  })),
);

const stepItems = computed(() =>
  DEVELOPMENT_STEPS.map(key => ({
    title: t(`${I18N_KEY}.list.${key}.title`),
    text: t(`${I18N_KEY}.list.${key}.description`),
  })),
);
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="DEVELOPMENT_TAGS"
      :image="'/images/services/development/hero.webp'"
    />

    <section class="service-page__block">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.cards.title`)"
        :title-max-width="910"
      />
      <services-sections-scatter-cards
        class="service-page__block-body"
        :items="cardItems"
        :positions="DEVELOPMENT_CARD_POSITIONS"
        :decor="DEVELOPMENT_CARDS_FIGURE"
        :min-height="561"
        :min-height-tablet="811"
      >
        <template #decor>
          <img
            src="/images/services/development/triangle.webp"
            alt=""
            loading="lazy"
          />
        </template>
      </services-sections-scatter-cards>
    </section>

    <section class="service-page__block service-page__block_steps">
      <!-- Тот же треугольник лежит за шагами и уходит за правый край экрана -->
      <services-molecules-figure
        class="service-page__steps-figure"
        :placement="DEVELOPMENT_STEPS_FIGURE"
      >
        <img
          src="/images/services/development/triangle.webp"
          alt=""
          loading="lazy"
        />
      </services-molecules-figure>
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.list.title`)"
        :title-max-width="1068"
      />
      <services-sections-timeline-steps
        class="service-page__block-body"
        :items="stepItems"
      />
    </section>

    <services-sections-expertise class="service-page__expertise" />
    <services-sections-other-services
      class="service-page__other"
      :current-slug="SLUG"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;

.service-page {
  --service-accent: #1764f6;
  --service-hero-from: #c0d5fd;
  --service-hero-to: #dae6fe;
  --service-hero-stop: 80%;
  --service-row-hover: #dfeafe;
  --service-tile-bg: #eaf1fe;
  --scatter-bg: rgb(23 100 246 / 5%);
  --scatter-border: var(--dark-blue-10);
  --scatter-radius: 16px;
  --timeline-pin-active-bg: #3e5eff;
  --timeline-pin-bg: #c9dbfd;
  --timeline-pin-number: #586995;
  --timeline-line: #dfeafe;
  --hero-image-width: 516px;
  --hero-image-right: 57px;

  // Низ картинки продлён на 11px для мобильного макета, на десктопе он под краем героя
  --hero-image-bottom: -11px;
  --hero-image-left-tablet: 138px;
  --hero-image-top-tablet: 0px;
  --hero-image-width-tablet: 438px;
  --hero-image-left-mobile: 13px;
  --hero-image-top-mobile: 0px;
  --hero-image-width-mobile: 425px;

  padding-bottom: 112px;

  // Фигуры макета уходят за правый край экрана: их должен резать край
  // страницы, а не растягивать документ в горизонтальный скролл

  overflow-x: clip;

  background-color: #f5f9ff;

  @include a.tablet {
    padding-bottom: 100px;
  }

  @include a.mobile {
    padding-bottom: 100px;
  }
}

.service-page__block {
  margin-top: 104px;

  @include a.tablet {
    margin-top: 64px;
  }

  @include a.mobile {
    margin-top: 40px;
  }

  &_steps {
    position: relative;

    margin-top: 107px;

    @include a.tablet {
      margin-top: 120px;
    }

    @include a.mobile {
      margin-top: 60px;
    }

    // Ленту шагов заголовок отбивает сильнее, чем карточки

    .service-page__block-body {
      margin-top: 66px;

      @include a.mobile {
        margin-top: 38px;
      }
    }

    // Фигура лежит под заголовком и шагами

    .service-page__block-head,
    .service-page__block-body {
      position: relative;
      z-index: 1;
    }
  }

  &-head {
    @include s.base-container;
  }

  &-body {
    margin-top: 60px;

    @include a.tablet {
      margin-top: 62px;
    }

    @include a.mobile {
      margin-top: 32px;
    }
  }
}

.service-page__steps-figure {
  z-index: 0;
}

.service-page__expertise {
  margin-top: 200px;

  @include a.tablet {
    margin-top: 168px;
  }

  @include a.mobile {
    margin-top: 88px;
  }
}

.service-page__other {
  margin-top: 200px;

  @include a.tablet {
    margin-top: 160px;
  }

  @include a.mobile {
    margin-top: 80px;
  }
}
</style>
