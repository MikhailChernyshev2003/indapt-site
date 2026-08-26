<script setup lang="ts">
import {
  DEVELOPMENT_CARDS,
  DEVELOPMENT_STEPS,
  DEVELOPMENT_TAGS,
  SERVICES,
} from '@l-services/configs';

const I18N_KEY = 'services.development';
const SLUG = 'development';

const { t } = useI18n();

const service = SERVICES.find(item => item.slug === SLUG)!;

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const cardItems = computed(() =>
  DEVELOPMENT_CARDS.map(key => ({
    title: t(`${I18N_KEY}.cards.${key}.title`),
    text: t(`${I18N_KEY}.cards.${key}.description`),
  })),
);

/** Координаты сняты с макета: карточки лежат внахлёст */
const cardPositions = {
  desktop: [[0, 184], [780, 284], [111, 544]],
  tablet: [[0, 246], [148, 566], [74, 862]],
} as const;

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
      :image="service.image"
    />

    <section class="service-page__block">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.cards.title`)"
      />
      <services-sections-scatter-cards
        class="service-page__block-body"
        :items="cardItems"
        :positions="cardPositions"
        :min-height="820"
        :min-height-tablet="1140"
      >
        <template #decor>
          <services-molecules-service-decor shape="triangle" />
        </template>
      </services-sections-scatter-cards>
    </section>

    <section class="service-page__block service-page__block_steps">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.list.title`)"
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
  --service-row-hover: #dfeafe;
  --service-tile-bg: #eaf1fe;
  --service-decor-shape: #5374e5;
  --scatter-border: #d4dced;
  --scatter-radius: 12px;
  --timeline-pin-active-bg: #3e5eff;
  --timeline-pin-bg: #c9dbfd;
  --timeline-pin-number: #586995;
  --timeline-line: #dfeafe;
  --hero-image-width: 680px;
  --hero-image-right: 59px;
  --hero-image-bottom: -40px;

  padding-bottom: 112px;

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
    margin-top: 110px;

    @include a.tablet {
      margin-top: 120px;
    }

    @include a.mobile {
      margin-top: 60px;
    }
  }

  &-head {
    @include s.base-container;
  }

  &-body {
    margin-top: 52px;

    @include a.mobile {
      margin-top: 32px;
    }
  }
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
