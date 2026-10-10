<script setup lang="ts">
import {
  MARKETING_CREATE,
  MARKETING_FEATURES,
  MARKETING_INFO,
  MARKETING_KV_FLOWER,
  MARKETING_KV_FRAMES,
  MARKETING_KV_GLOW,
  MARKETING_KV_IMAGE,
  MARKETING_TABS,
  MARKETING_TAGS,
} from '@l-services/configs';

const I18N_KEY = 'services.marketing';
const SLUG = 'marketing';

const { t } = useI18n();

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

// По одной картинке на вкладку и одинаковой пропорции: отдельные кадры под
// планшет и мобильный были только у первой вкладки, и из-за другой пропорции
// панель на ней оказывалась выше остальных, а блок ниже прыгал при переключении
const TAB_IMAGES = MARKETING_TABS.map((_, idx) => ({
  image: `/images/services/marketing/tab-${idx + 1}.webp`,
}));

const creativeTabs = computed(() =>
  MARKETING_TABS.map((key, idx) => ({
    label: t(`${I18N_KEY}.creative.${key}.label`),
    text: t(`${I18N_KEY}.creative.${key}.text`),
    image: '',
    ...TAB_IMAGES[idx],
  })),
);

const creativeParagraphs = computed(() => [
  t(`${I18N_KEY}.creative.paragraph_1`),
  t(`${I18N_KEY}.creative.paragraph_2`),
]);

const createItems = computed(() =>
  MARKETING_CREATE.map(key => ({
    label: t(`${I18N_KEY}.create.${key}.label`),
    text: t(`${I18N_KEY}.create.${key}.text`),
  })),
);

/** У этой услуги раскрывающиеся блоки лежат в features, а не в descServices */
const featurePaths = {
  root: 'features',
  desc: 'text',
  collapseLabel: 'label',
  collapseText: 'text',
};
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="MARKETING_TAGS"
      :image="'/images/services/marketing/hero.webp'"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="MARKETING_INFO"
    />
    <services-sections-method-tabs
      class="service-page__methods"
      :title="t(`${I18N_KEY}.creative.title`)"
      :paragraphs="creativeParagraphs"
      :tabs="creativeTabs"
    />
    <!-- Картинка по правкам статична: скроллится только текст аккордеонов -->
    <services-molecules-sticky-kv
      class="service-page__features"
      :frames="MARKETING_KV_FRAMES"
    >
      <template #media>
        <services-molecules-figure
          :placement="MARKETING_KV_IMAGE"
          trigger-closest=".sticky-kv"
        >
          <img
            src="/images/services/marketing/kv.webp"
            alt=""
            loading="lazy"
          />
        </services-molecules-figure>
        <services-molecules-figure
          :placement="MARKETING_KV_FLOWER"
          trigger-closest=".sticky-kv"
        >
          <img
            class="service-page__kv-flower"
            src="/images/services/marketing/flower.webp"
            alt=""
            loading="lazy"
          />
        </services-molecules-figure>
        <services-molecules-figure
          :placement="MARKETING_KV_GLOW"
          :animated="false"
        >
          <div class="service-page__kv-glow" />
        </services-molecules-figure>
      </template>
      <services-sections-desc-services
        :i18n-key="I18N_KEY"
        :groups="MARKETING_FEATURES"
        :paths="featurePaths"
        reveal-on-hover
      />
    </services-molecules-sticky-kv>

    <section class="service-page__block">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.create.title`)"
        :desc="t(`${I18N_KEY}.create.info`)"
        size="h2"
        :desc-max-width="429"
      />
      <services-sections-numbered-lines
        class="service-page__block-body service-page__lines"
        :items="createItems"
        reveal-on-hover
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
  --service-accent: #dd9000;
  --service-hero-from: #fff6b0;
  --service-hero-to: #fffce5;
  --service-row-hover: #fff8bd;
  --info-paragraph-gap: 16px;
  --hero-image-width: 510px;
  --hero-image-right: 60px;
  --hero-image-bottom: 0px;
  --hero-image-left-tablet: 71px;
  --hero-image-top-tablet: -26px;
  --hero-image-width-tablet: 510px;
  --hero-image-left-mobile: -69px;
  --hero-image-top-mobile: -6px;
  --hero-image-width-mobile: 440px;

  padding-bottom: 112px;

  // Фигуры макета уходят за правый край экрана: их должен резать край
  // страницы, а не растягивать документ в горизонтальный скролл

  overflow-x: clip;

  background-color: #fffef5;

  // Кадр статичной картинки (sticky-kv) уходит под поток страницы
  // отрицательным z-index — контекст наложения должен быть свой

  isolation: isolate;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

// Рамка цветка в макете шире растра (1036×886 против 1421×1259): макет
// заполняет её с обрезкой, а растянутая картинка сплющивалась на 4%

.service-page__kv-flower {
  object-fit: cover;
}

// Засвет из макета гасит нижний край цветка: размытый эллипс цвета фона

.service-page__kv-glow {
  width: 100%;
  height: 100%;

  background-color: rgb(255 254 245 / 80%);
  border-radius: 50%;
  filter: blur(100px);
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

.service-page__methods {
  // Резерв панели под самую длинную подводку (три строки, 92px),
  // отступ 64px и картинку 652×300
  --method-tabs-panel-min-height: 456px;
  --method-tabs-image-position: right;

  margin-top: 80px;

  @include a.mobile {
    margin-top: 40px;
  }
}

.service-page__features {
  // Абзац группы по макету уже колонки: на десктопе переносится по 763px
  --desc-services-desc-max-width: 763px;

  // По макету от картинки вкладки до заголовка SMM 104px: их даёт резерв
  // панели вкладок (61px) и верхний отступ группы (40px). На планшете
  // и мобильном от последней вкладки до (01) — 80px

  @include a.tablet {
    --desc-services-desc-max-width: none;

    margin-top: 40px;
  }

  @include a.mobile {
    --desc-services-aside-mobile: 52px;

    margin-top: 64px;
  }
}

.service-page__block {
  // От разделителя под последней группой до заголовка по макету

  margin-top: 80px;

  @include a.tablet {
    margin-top: 60px;
  }

  @include a.mobile {
    margin-top: 32px;
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
  margin-top: 160px;

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
  // На планшете и мобильном пункты в макете разделены тёмной линией,
  // а на планшете ещё и одной высоты — шаг рядов 209px

  @include a.tablet {
    --lines-line-color: var(--dark-blue);
    --lines-item-min-height: 157px;
  }

  @include a.mobile {
    --lines-item-min-height: auto;
  }
}
</style>
