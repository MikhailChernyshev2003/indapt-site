<script setup lang="ts">
import {
  SUPPORT_CARD_POSITIONS,
  SUPPORT_CARDS,
  SUPPORT_CARDS_FIGURE,
  SUPPORT_RING_COLORS,
  SUPPORT_TAGS,
} from '@l-services/configs';

const I18N_KEY = 'services.support';
const SLUG = 'support';

const { t } = useI18n();

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const cardItems = computed(() =>
  SUPPORT_CARDS.map(key => ({
    title: t(`${I18N_KEY}.cards.${key}.title`),
    text: t(`${I18N_KEY}.cards.${key}.description`),
  })),
);
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="SUPPORT_TAGS"
      :image="'/images/services/support/hero.webp'"
    />

    <services-sections-intro-block
      class="service-page__intro"
      :title="t(`${I18N_KEY}.development.title`)"
      :text="t(`${I18N_KEY}.development.info`)"
    >
      <template #decor>
        <services-molecules-figure>
          <services-molecules-ring-pattern
            shape="circle"
            :colors="SUPPORT_RING_COLORS"
          />
        </services-molecules-figure>
      </template>
    </services-sections-intro-block>

    <section class="service-page__block">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.cards.title`)"
        :title-max-width="878"
      />
      <services-sections-scatter-cards
        class="service-page__block-body"
        :items="cardItems"
        :positions="SUPPORT_CARD_POSITIONS"
        :decor="SUPPORT_CARDS_FIGURE"
        :min-height="561"
        :min-height-tablet="811"
      >
        <template #decor>
          <services-molecules-ring-pattern
            shape="circle"
            :colors="SUPPORT_RING_COLORS"
          />
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
  --scatter-bg: rgb(60 246 225 / 5%);
  --scatter-border: var(--dark-blue-10);
  --scatter-radius: 16px;
  --hero-image-width: 510px;
  --hero-image-right: 60px;
  --hero-image-bottom: 0px;

  padding-bottom: 112px;

  // Фигуры макета уходят за правый край экрана: их должен резать край
  // страницы, а не растягивать документ в горизонтальный скролл

  overflow-x: clip;

  background-color: #fafffe;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

.service-page__intro {
  margin-top: 104px;

  @include a.tablet {
    margin-top: 64px;
  }

  @include a.mobile {
    margin-top: 39px;
  }
}

.service-page__block {
  margin-top: 101px;

  @include a.tablet {
    margin-top: 157px;
  }

  @include a.mobile {
    margin-top: 53px;
  }

  &-head {
    @include s.base-container;
  }

  &-body {
    margin-top: 60px;

    @include a.tablet {
      margin-top: 65px;
    }

    @include a.mobile {
      margin-top: 39px;
    }
  }
}

.service-page__expertise {
  margin-top: 190px;

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
