<script setup lang="ts">
import {
  ANALYTICS_PLANNING_BAND,
  ANALYTICS_PLANNING_GROUPS,
  ANALYTICS_PLANNING_INFO,
  ANALYTICS_PLANNING_KV,
  ANALYTICS_PLANNING_KV_FRAMES,
  ANALYTICS_PLANNING_RING_COLORS,
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
      :image="'/images/services/analytics-planning/hero.webp'"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="ANALYTICS_PLANNING_INFO"
    />
    <div class="service-page__decor">
      <services-molecules-pattern-band
        :clusters="ANALYTICS_PLANNING_BAND"
        :colors="ANALYTICS_PLANNING_RING_COLORS"
      />
    </div>
    <!-- Картинка по правкам статична: скроллится только текст аккордеонов -->
    <services-molecules-sticky-kv
      class="service-page__desc"
      :frames="ANALYTICS_PLANNING_KV_FRAMES"
    >
      <template #media>
        <services-molecules-figure
          :placement="ANALYTICS_PLANNING_KV"
          trigger-closest=".sticky-kv"
        >
          <services-molecules-ring-pattern
            shape="hexagon"
            :colors="ANALYTICS_PLANNING_RING_COLORS"
          />
        </services-molecules-figure>
      </template>
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
  --service-hero-stop: 63%;
  --service-row-hover: #feebd7;
  --pattern-band-bg: #feefdf;
  --hero-image-width: 516px;
  --hero-image-right: 54px;

  // Низ картинки продлён на 6px для мобильного макета, на десктопе он под краем героя
  --hero-image-bottom: -6px;
  --hero-image-left-tablet: 91px;
  --hero-image-top-tablet: -28px;
  --hero-image-width-tablet: 516px;
  --hero-image-left-mobile: -47px;
  --hero-image-top-mobile: 0px;
  --hero-image-width-mobile: 431px;

  // Три тега в макете стоят одним рядом шире обычной колонки
  --hero-content-width: 880px;

  // По макету от нижнего края карточек до футера 112px

  padding-bottom: 112px;

  // Фигуры макета уходят за правый край экрана: их должен резать край
  // страницы, а не растягивать документ в горизонтальный скролл

  overflow-x: clip;

  background-color: #fffaf5;

  // Кадр статичной картинки (sticky-kv) уходит под поток страницы
  // отрицательным z-index — контекст наложения должен быть свой

  isolation: isolate;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 100px;
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
    margin-top: 132px;
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
