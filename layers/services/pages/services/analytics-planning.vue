<script setup lang="ts">
import {
  ANALYTICS_PLANNING_GROUPS,
  ANALYTICS_PLANNING_INFO,
  ANALYTICS_PLANNING_TAGS,
} from '@l-services/configs';

const I18N_KEY = 'services.analyticsPlanning';
const SLUG = 'analytics-planning';

const { t } = useI18n();

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="ANALYTICS_PLANNING_TAGS"
      :image="'/images/services/analytics-planning/hero.png'"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="ANALYTICS_PLANNING_INFO"
    />
    <div class="service-page__decor">
      <services-molecules-pattern-band type="hexagonOrange" />
    </div>
    <!-- Картинка по правкам статична: скроллится только текст аккордеонов -->
    <services-molecules-sticky-kv
      class="service-page__desc"
      src="/images/services/analytics-planning/kv.webp"
      :width="1444"
      :height="1144"
      :left="-4"
    >
      <services-sections-desc-services
        :i18n-key="I18N_KEY"
        :groups="ANALYTICS_PLANNING_GROUPS"
      />
    </services-molecules-sticky-kv>
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
  // Палитра услуги. Для другой услуги меняются только эти значения.
  --service-accent: var(--services-orange);
  --service-hero-from: #fddebe;
  --service-hero-to: #fef2e6;
  --service-decor-bg: #feefdf;
  --service-row-hover: #feebd7;

  // По макету от нижнего края карточек до футера 112px

  --pattern-band-bg: #ffefe0;

  padding-bottom: 112px;

  background-color: #fffaf5;

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

.service-page__desc {
  margin-top: 16px;
}

.service-page__expertise {
  // По макету от последнего раскрывающегося блока до заголовка
  // секции 219px, из них 32px даёт нижний отступ группы

  margin-top: 152px;

  @include a.tablet {
    margin-top: 96px;
  }

  @include a.mobile {
    margin-top: 64px;
  }
}

.service-page__other {
  margin-top: 200px;

  @include a.tablet {
    margin-top: 120px;
  }

  @include a.mobile {
    margin-top: 80px;
  }
}
</style>
