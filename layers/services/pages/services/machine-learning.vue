<script setup lang="ts">
import {
  MACHINE_LEARNING_CHALLENGES,
  MACHINE_LEARNING_INFO,
  MACHINE_LEARNING_SOLUTIONS,
  MACHINE_LEARNING_TAGS,
} from '@l-services/configs';

const I18N_KEY = 'services.machineLearning';
const SLUG = 'machine-learning';

const { t } = useI18n();

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const challengeItems = computed(() =>
  MACHINE_LEARNING_CHALLENGES.map(key => ({
    title: t(`${I18N_KEY}.solvingBusinessChallengesAI.${key}.title`),
    text: t(`${I18N_KEY}.solvingBusinessChallengesAI.${key}.text`),
  })),
);

/** В этом блоке подписей нет — только тексты */
const solutionItems = computed(() =>
  MACHINE_LEARNING_SOLUTIONS.map(key => ({
    text: t(`${I18N_KEY}.keySolutionsProducts.${key}`),
  })),
);
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="MACHINE_LEARNING_TAGS"
      :image="'/images/services/machine-learning/hero.png'"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="MACHINE_LEARNING_INFO"
    />

    <section class="service-page__block">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.solvingBusinessChallengesAI.title`)"
      />
      <services-sections-bento-cards
        class="service-page__block-body"
        :items="challengeItems"
      >
        <template #decor>
          <services-molecules-service-decor shape="flower" />
        </template>
      </services-sections-bento-cards>
    </section>

    <section class="service-page__block service-page__block_wide">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.keySolutionsProducts.title`)"
        size="h2"
      />
      <services-sections-numbered-lines
        class="service-page__block-body"
        :items="solutionItems"
        text-size="lead"
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
  --service-accent: var(--services-pink);
  --service-hero-from: #f7ccd4;
  --service-hero-to: #fdf5f5;
  --service-row-hover: #f0e6e6;
  --service-tile-bg: #eeedf5;
  --service-decor-shape: var(--services-pink);
  --hero-image-width: 714px;
  --hero-image-right: 60px;
  --hero-image-bottom: -69px;

  padding-bottom: 112px;

  background-color: #f9f5f5;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

.service-page__info {
  margin-top: 104px;

  @include a.tablet {
    margin-top: 64px;
  }

  @include a.mobile {
    margin-top: 40px;
  }
}

.service-page__block {
  margin-top: 80px;

  @include a.mobile {
    margin-top: 40px;
  }

  &_wide {
    margin-top: 104px;

    @include a.tablet {
      margin-top: 80px;
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

.service-page__expertise,
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
