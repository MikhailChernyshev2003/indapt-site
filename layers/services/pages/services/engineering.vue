<script setup lang="ts">
import {
  ENGINEERING_ALIGNMENT,
  ENGINEERING_ARCHITECTURE,
  ENGINEERING_INFO,
  ENGINEERING_TAGS,
  SERVICES,
} from '@l-services/configs';

const I18N_KEY = 'services.systemDesign';
const SLUG = 'engineering';

const { t } = useI18n();

const service = SERVICES.find(item => item.slug === SLUG)!;

useSeoMeta({
  title: t(`${I18N_KEY}.title`),
});

const architectureItems = computed(() =>
  ENGINEERING_ARCHITECTURE.map(key => ({
    title: t(`${I18N_KEY}.productArchitecture.${key}.title`),
    shortText: t(`${I18N_KEY}.productArchitecture.${key}.shortText`),
    text: t(`${I18N_KEY}.productArchitecture.${key}.text`),
  })),
);

const alignmentItems = computed(() =>
  ENGINEERING_ALIGNMENT.map(key => ({
    label: t(`${I18N_KEY}.technicalSpecificationAlignment.${key}.title`),
    text: t(`${I18N_KEY}.technicalSpecificationAlignment.${key}.text`),
  })),
);
</script>

<template>
  <div class="service-page">
    <services-sections-hero
      :i18n-key="I18N_KEY"
      :tags="ENGINEERING_TAGS"
      :image="service.image"
    />
    <services-sections-info
      class="service-page__info"
      :i18n-key="I18N_KEY"
      :paragraphs="ENGINEERING_INFO"
    />

    <section class="service-page__block">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.productArchitecture.title`)"
        :title-max-width="660"
      />
      <services-sections-architecture-cards
        class="service-page__block-body"
        :items="architectureItems"
      />
    </section>

    <section class="service-page__block service-page__block_lines">
      <services-molecules-section-head
        class="service-page__block-head"
        :title="t(`${I18N_KEY}.technicalSpecificationAlignment.title`)"
        :desc="t(`${I18N_KEY}.technicalSpecificationAlignment.desc`)"
        size="h2"
      />
      <services-sections-numbered-lines
        class="service-page__block-body"
        :items="alignmentItems"
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
  // Палитра услуги
  --service-accent: var(--services-black);
  --service-hero-from: #b7b7b7;
  --service-hero-to: #fcfcfc;
  --service-row-hover: #ecedee;
  --service-tile-bg: #eff2fa;
  --architecture-card-bg: #f2f2f3;
  --architecture-card-bg-hover: #ecedee;

  // Иллюстрация в макете крупнее эталонной и уходит за правый край
  --hero-image-width: 604px;
  --hero-image-right: -38px;
  --hero-image-bottom: -22px;

  padding-bottom: 112px;

  background-color: #fafafa;

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

.service-page__block {
  margin-top: 80px;

  @include a.mobile {
    margin-top: 40px;
  }

  // Второй блок в макете отбит от карточек архитектуры сильнее первого

  &_lines {
    margin-top: 130px;
  }

  // Контейнер задают сами секции, поэтому здесь он нужен только заголовку

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
  margin-top: 216px;

  @include a.tablet {
    margin-top: 164px;
  }

  @include a.mobile {
    margin-top: 88px;
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
