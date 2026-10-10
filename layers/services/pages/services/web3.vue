<script setup lang="ts">
import {
  WEB3_BAND,
  WEB3_CREATE,
  WEB3_CREATE_GLOWS,
  WEB3_CREATE_PATTERN,
  WEB3_FEATURES,
  WEB3_INFO,
  WEB3_RING_COLORS,
  WEB3_SLIDES,
  WEB3_TAGS,
} from '@l-services/configs';

const I18N_KEY = 'services.web3';
const SLUG = 'web3';

const { t } = useI18n();

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const featureItems = computed(() =>
  WEB3_FEATURES.map(key => ({
    title: t(`${I18N_KEY}.features.${key}.title`),
    text: t(`${I18N_KEY}.features.${key}.text`),
  })),
);

const createItems = computed(() =>
  WEB3_CREATE.map(key => ({
    label: t(`${I18N_KEY}.create.${key}.label`),
    text: t(`${I18N_KEY}.create.${key}.text`),
  })),
);

// Размеры одинаковые у всех слайдов: они держат место до загрузки картинки
// и не дают подписям встать на разной высоте
const SLIDE_SIZE = { imageWidth: 418, imageHeight: 290 };

const SLIDE_IMAGES = [
  { image: '/images/services/web3/slide-1.png', ...SLIDE_SIZE },
  { image: '/images/services/web3/slide-2.png', ...SLIDE_SIZE },
  { image: '/images/services/web3/slide-3.png', ...SLIDE_SIZE },
  { image: '/images/services/web3/slide-4.png', ...SLIDE_SIZE },
];

const techSlides = computed(() =>
  WEB3_SLIDES.map((key, idx) => ({
    label: t(`${I18N_KEY}.tech.${key}.label`),
    text: t(`${I18N_KEY}.tech.${key}.text`),
    image: '',
    ...SLIDE_IMAGES[idx],
  })),
);
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="WEB3_TAGS"
      :image="'/images/services/web3/hero.webp'"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="WEB3_INFO"
    />
    <div class="service-page__decor">
      <services-molecules-pattern-band
        :clusters="WEB3_BAND"
        :colors="WEB3_RING_COLORS"
      />
    </div>
    <services-sections-feature-list
      class="service-page__features"
      :items="featureItems"
    />

    <section class="service-page__block">
      <!-- Паттерн из макета лежит за пунктами и уходит за края блока,
           поверх него — белые засветы. Режется по бокам экрана и снизу
           по началу «Наших технологий», сверху не режется -->
      <div class="service-page__block-bg">
        <services-molecules-figure :placement="WEB3_CREATE_PATTERN">
          <services-molecules-ring-pattern
            shape="hexagon"
            :colors="WEB3_RING_COLORS"
          />
        </services-molecules-figure>
        <services-molecules-figure
          v-for="(glow, idx) in WEB3_CREATE_GLOWS"
          :key="idx"
          :placement="glow"
          :animated="false"
        >
          <div class="service-page__glow" />
        </services-molecules-figure>
      </div>
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.create.title`)"
        :desc="t(`${I18N_KEY}.create.text`)"
        size="h2"
        :desc-max-width="536"
      />
      <services-sections-numbered-lines
        class="service-page__block-body service-page__lines"
        :items="createItems"
        :columns="3"
        :tablet-columns="2"
        reveal-on-hover
      />
    </section>

    <services-sections-tech-slider
      class="service-page__slider"
      :title="t(`${I18N_KEY}.tech.title`)"
      :desc="t(`${I18N_KEY}.tech.text`)"
      :slides="techSlides"
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
  --service-accent: #42a400;
  --service-hero-from: #c9f6ab;
  --service-hero-to: #ecfde2;
  --service-hero-stop: 79%;
  --service-row-hover: #eafee1;
  --hero-image-width: 510px;
  --hero-image-right: 60px;
  --hero-image-bottom: 0px;
  --hero-image-left-tablet: 102px;
  --hero-image-top-tablet: -22px;
  --hero-image-width-tablet: 484px;
  --hero-image-left-mobile: 1px;
  --hero-image-top-mobile: 9px;
  --hero-image-width-mobile: 420px;
  --pattern-band-bg: #f5fff0;

  // Отступ от «Что мы создаём» до «Наших технологий»: до него же
  // по макету тянется паттерн блока
  --create-to-slider: 105px;

  padding-bottom: 112px;

  // Фигуры макета уходят за правый край экрана: их должен резать край
  // страницы, а не растягивать документ в горизонтальный скролл

  overflow-x: clip;

  background-color: #fafef7;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

// По макету паттерн режет фрейм страницы, который кончается там, где
// начинается «Наши технологии», а сверху угол шестиугольника выходит
// над заголовком. Поэтому вместо overflow — clip-path с выносом вверх
// и вниз на отступ до слайдера: координаты фигур остаются от блока

.service-page__block-bg {
  position: absolute;
  inset: 0;

  z-index: 0;

  clip-path: inset(-300px 0 calc(-1 * var(--create-to-slider)) 0);
}

// Засветы из макета: белые эллипсы с сильным размытием

.service-page__glow {
  width: 100%;
  height: 100%;

  background-color: var(--white);
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(120px);
}

.service-page__info {
  margin-top: 108px;

  @include a.tablet {
    margin-top: 68px;
  }

  @include a.mobile {
    margin-top: 40px;
  }
}

.service-page__decor {
  margin-top: 48px;

  @include s.base-container;

  @include a.mobile {
    margin-top: 32px;
  }
}

.service-page__features {
  // Блоки этой услуги в макете разведены сильнее
  --feature-row-padding-bottom: 48px;
  --feature-text-gap-mobile: 16px;

  margin-top: 16px;
}

.service-page__block {
  position: relative;

  margin-top: 32px;

  &-head {
    position: relative;
    z-index: 1;

    @include s.base-container;
  }

  &-body {
    position: relative;
    z-index: 1;

    margin-top: 52px;

    @include a.mobile {
      margin-top: 32px;
    }
  }
}

.service-page__slider {
  margin-top: var(--create-to-slider);
}

.service-page__expertise {
  margin-top: 96px;

  @include a.tablet {
    margin-top: 160px;
  }

  @include a.mobile {
    margin-top: 80px;
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

.service-page__lines {
  // На планшете и мобильном линии в макете светлее, ряды на планшете
  // разведены сильнее, а номер на мобильном крупнее общего

  @include a.tablet {
    --lines-line-color: var(--dark-blue-30);
    --lines-row-gap-tablet: 60px;
  }

  @include a.mobile {
    --lines-number-size-mobile: 16px;
  }
}
</style>
