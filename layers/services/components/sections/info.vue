<script setup lang="ts">
const { i18nKey, paragraphs } = defineProps<{
  /** Базовый ключ услуги, например services.analyticsPlanning */
  i18nKey: string;
  /** Ключи абзацев внутри <i18nKey> */
  paragraphs: string[];
}>();

const { t } = useI18n();
</script>

<template>
  <!-- Первый абзац по раскадровке насыщается вместе с меткой, остальные
       появляются следом снизу (см. text-reveal) -->
  <services-molecules-text-reveal is="section" class="service-info">
    <span class="service-info__label" data-reveal="text">(info)</span>
    <div class="service-info__text">
      <p
        v-for="(paragraph, idx) in paragraphs"
        :key="paragraph"
        class="service-info__paragraph"
        :data-reveal="idx ? 'paragraph' : 'text'"
        v-html="t(`${i18nKey}.${paragraph}`)"
      />
    </div>
  </services-molecules-text-reveal>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.service-info {
  display: grid;
  grid-template-columns: 4fr 8fr;

  @include s.base-container;

  // Текст по макету начинается в 118px от края контейнера

  @include a.tablet {
    grid-template-columns: 118px 1fr;
  }

  @include a.mobile {
    grid-template-columns: 52px 1fr;
  }
}

.service-info__label {
  color: var(--dark-blue);

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.service-info__text {
  color: var(--dark-blue);
}

.service-info__paragraph {
  @include t.lead-m-medium;

  @include a.mobile {
    @include t.body-s-medium-135;
  }

  &:not(:first-child) {
    margin-top: var(--info-paragraph-gap, 0.75rem); // 12px, в rem: pxtorem не заходит в var()

    @include a.mobile {
      margin-top: 8px;
    }
  }

  // Переносы в локали расставлены под десктопную ширину строки. На узких
  // экранах макет набран без них — текст течёт сам, иначе строки рвутся

  :deep(br) {
    @include a.tablet {
      display: none;
    }
  }
}
</style>
