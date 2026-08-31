<script setup lang="ts">
import {
  MARKETING_CREATE,
  MARKETING_FEATURES,
  MARKETING_INFO,
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
      :width="556"
      :height="1265"
      :left="-1"
    >
      <template #media>
        <div class="service-page__kv-shape">
          <services-molecules-layered-shape
            type="flower"
            :offset="41"
            trigger-closest=".sticky-kv"
          />
        </div>
      </template>
      <services-sections-desc-services
        :i18n-key="I18N_KEY"
        :groups="MARKETING_FEATURES"
        :paths="featurePaths"
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
        class="service-page__block-body"
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
  --service-decor-shape: #ebce53;
  --info-paragraph-gap: 16px;
  --hero-image-width: 510px;
  --hero-image-right: 60px;
  --hero-image-bottom: 0px;

  padding-bottom: 112px;

  background-color: #fffef5;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

// Ядро жёлтой массы у левого края, по центру высоты кадра; слои
// расходятся наружу и частично уходят за край экрана, как в макете

// Ядро жёлтого цветка KV. По макету центр фигуры на 290px за левым
// краем экрана — видна только правая часть колец; по высоте кадра ядро
// стоит по центру. Числа сняты попиксельной подгонкой к экспорту макета

.service-page__kv-shape {
  width: 728px;
  margin: 268px 0 0 -653px;
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
  // Самая длинная подводка вкладок занимает три строки
  --method-tabs-text-min-height: 92px;

  margin-top: 80px;

  @include a.mobile {
    margin-top: 40px;
  }
}

.service-page__features {
  margin-top: 102px;

  @include a.tablet {
    margin-top: 0;
  }
}

.service-page__block {
  margin-top: 37px;

  @include a.mobile {
    margin-top: 40px;
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
    margin-top: 96px;
  }

  @include a.mobile {
    margin-top: 80px;
  }
}
</style>
