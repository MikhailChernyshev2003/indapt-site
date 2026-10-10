<script setup lang="ts">
import {
  MACHINE_LEARNING_CHALLENGES,
  MACHINE_LEARNING_INFO,
  MACHINE_LEARNING_RING_COLORS,
  MACHINE_LEARNING_SOLUTIONS,
  MACHINE_LEARNING_STAR,
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
      :image="'/images/services/machine-learning/hero.webp'"
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
          <services-molecules-figure :placement="MACHINE_LEARNING_STAR">
            <services-molecules-ring-pattern
              shape="star"
              :colors="MACHINE_LEARNING_RING_COLORS"
            />
          </services-molecules-figure>
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
        :tablet-columns="2"
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
  --hero-image-width: 714px;
  --hero-image-right: 60px;

  // Низ картинки продлён на 3px для мобильного макета, на десктопе он под краем героя
  --hero-image-bottom: -3px;
  --hero-image-left-tablet: -105px;
  --hero-image-top-tablet: -53px;
  --hero-image-width-tablet: 714px;
  --hero-image-left-mobile: -187px;
  --hero-image-top-mobile: -38px;
  --hero-image-width-mobile: 678px;

  // Карточки по макету: тёмно-красная заливка на 3% и радиус 16px
  --bento-card-bg: rgb(104 0 3 / 3%);
  --bento-card-radius: 1rem;

  padding-bottom: 112px;

  // Фигуры макета уходят за правый край экрана: их должен резать край
  // страницы, а не растягивать документ в горизонтальный скролл

  overflow-x: clip;

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

  // Пункты «Ключевых решений» по макету: текст в две строки с теми же
  // переносами, что в макете (ширина с запасом между самой длинной первой
  // строкой и строкой с лишним словом), ряды разнесены на 60px,
  // от заголовка на десктопе всего 40px

  &_wide {
    --lines-text-max-width: 460px;
    --lines-row-gap: 60px;
    --lines-row-gap-tablet: 60px;

    margin-top: 104px;

    @include a.tablet {
      margin-top: 80px;
    }

    .service-page__block-body {
      margin-top: 40px;

      @include a.tablet {
        margin-top: 60px;
      }

      @include a.mobile {
        margin-top: 32px;
      }
    }
  }

  &-head {
    @include s.base-container;
  }

  &-body {
    margin-top: 60px;

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
