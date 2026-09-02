<script setup lang="ts">
import {
  DESIGN_BAND,
  DESIGN_FEATURES,
  DESIGN_INFO,
  DESIGN_METHODS,
  DESIGN_TAGS,
} from '@l-services/configs';

const I18N_KEY = 'services.design';
const SLUG = 'design';

const { t } = useI18n();

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const featureItems = computed(() =>
  DESIGN_FEATURES.map(key => ({
    title: t(`${I18N_KEY}.features.${key}.title`),
    text: t(`${I18N_KEY}.features.${key}.text`),
  })),
);

/** Иллюстрации методологий, порядок совпадает с DESIGN_METHODS */
const METHOD_IMAGES = DESIGN_METHODS.map((_, idx) => ({
  image: `/images/services/design/method-${idx + 1}.webp`,
}));

const methodTabs = computed(() =>
  DESIGN_METHODS.map((key, idx) => ({
    label: t(`${I18N_KEY}.methodFramework.${key}.label`),
    text: t(`${I18N_KEY}.methodFramework.${key}.text`),
    image: '',
    ...METHOD_IMAGES[idx],
  })),
);
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="DESIGN_TAGS"
      :image="'/images/services/design/hero.webp'"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="DESIGN_INFO"
    />
    <div class="service-page__decor">
      <services-molecules-pattern-band
        :clusters="DESIGN_BAND"
        image="/images/services/design/band.webp"
      />
    </div>
    <services-sections-feature-list
      class="service-page__features"
      :items="featureItems"
    />
    <services-sections-method-tabs
      class="service-page__methods"
      :title="t(`${I18N_KEY}.methodFramework.title`)"
      :tabs="methodTabs"
    />
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
  --service-accent: #8d19fc;
  --service-hero-from: #e3c7fd;
  --service-hero-to: #fbf6ff;
  --service-row-hover: #ebe3fd;
  --service-tile-bg: #efeefd;
  --hero-image-width: 510px;
  --hero-image-right: 60px;
  --hero-image-bottom: 0px;
  --pattern-band-bg: #f9f3ff;

  padding-bottom: 112px;

  // Фигуры макета уходят за правый край экрана: их должен резать край
  // страницы, а не растягивать документ в горизонтальный скролл

  overflow-x: clip;

  background-color: #faf6fe;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

.service-page__info {
  margin-top: 108px;

  @include a.tablet {
    margin-top: 64px;
  }

  @include a.mobile {
    margin-top: 40px;
  }
}

.service-page__decor {
  margin-top: 60px;

  @include s.base-container;

  @include a.tablet {
    margin-top: 48px;
  }

  @include a.mobile {
    margin-top: 32px;
  }
}

.service-page__features {
  margin-top: 16px;
}

.service-page__methods {
  margin-top: 152px;

  @include a.tablet {
    margin-top: 133px;
  }

  @include a.mobile {
    margin-top: 112px;
  }
}

.service-page__expertise {
  margin-top: 240px;

  @include a.tablet {
    margin-top: 166px;
  }

  @include a.mobile {
    margin-top: 64px;
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
