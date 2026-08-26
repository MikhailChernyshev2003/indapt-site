<script setup lang="ts">
import {
  DESIGN_FEATURES,
  DESIGN_INFO,
  DESIGN_METHODS,
  DESIGN_TAGS,
  SERVICES,
} from '@l-services/configs';

const I18N_KEY = 'services.design';
const SLUG = 'design';

const { t } = useI18n();

const service = SERVICES.find(item => item.slug === SLUG)!;

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const featureItems = computed(() =>
  DESIGN_FEATURES.map(key => ({
    title: t(`${I18N_KEY}.features.${key}.title`),
    text: t(`${I18N_KEY}.features.${key}.text`),
  })),
);

const methodTabs = computed(() =>
  DESIGN_METHODS.map(key => ({
    label: t(`${I18N_KEY}.methodFramework.${key}.label`),
    text: t(`${I18N_KEY}.methodFramework.${key}.text`),
    image: '',
  })),
);
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="DESIGN_TAGS"
      :image="service.image"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="DESIGN_INFO"
    />
    <div class="service-page__decor">
      <services-molecules-decor-band />
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
  --service-decor-bg: #f9f3ff;
  --service-decor-shape: #8d19fc;
  --service-tile-bg: #efeefd;
  --hero-image-width: 587px;
  --hero-image-right: 18px;
  --hero-image-bottom: -9px;

  padding-bottom: 112px;

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
