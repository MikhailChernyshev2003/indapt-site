<script setup lang="ts">
import { SERVICES, SUPPORT_CARDS, SUPPORT_TAGS } from '@l-services/configs';

const I18N_KEY = 'services.support';
const SLUG = 'support';

const { t } = useI18n();

const service = SERVICES.find(item => item.slug === SLUG)!;

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const cardItems = computed(() =>
  SUPPORT_CARDS.map(key => ({
    title: t(`${I18N_KEY}.cards.${key}.title`),
    text: t(`${I18N_KEY}.cards.${key}.description`),
  })),
);

/** Координаты сняты с макета: карточки лежат внахлёст */
const cardPositions = {
  desktop: [[0, 184], [779, 284], [111, 544]],
  tablet: [[0, 246], [147, 566], [74, 862]],
} as const;
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="SUPPORT_TAGS"
      :image="service.image"
    />

    <services-sections-intro-block
      class="service-page__intro"
      :title="t(`${I18N_KEY}.development.title`)"
      :text="t(`${I18N_KEY}.development.info`)"
    >
      <template #decor>
        <services-molecules-service-decor shape="circle" />
      </template>
    </services-sections-intro-block>

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
          <services-molecules-service-decor shape="circle" />
        </template>
      </services-sections-scatter-cards>
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
  --service-accent: #0099b6;
  --service-hero-from: #bbfcf5;
  --service-hero-to: #ebfefc;
  --service-row-hover: #d4fdf8;
  --service-tile-bg: #eff6fd;
  --service-decor-shape: #0099b6;
  --scatter-bg: rgb(210 251 246 / 25%);
  --scatter-border: #d9e7eb;
  --scatter-radius: 14px;
  --hero-image-width: 647px;
  --hero-image-right: 18px;
  --hero-image-bottom: -12px;

  padding-bottom: 112px;

  background-color: #fafffe;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

.service-page__intro {
  margin-top: 196px;

  @include a.tablet {
    margin-top: 64px;
  }

  @include a.mobile {
    margin-top: 39px;
  }
}

.service-page__block {
  margin-top: 194px;

  @include a.tablet {
    margin-top: 157px;
  }

  @include a.mobile {
    margin-top: 78px;
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
  margin-top: 204px;

  @include a.tablet {
    margin-top: 159px;
  }

  @include a.mobile {
    margin-top: 86px;
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
