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
  <!-- По комментарию в макете текст насыщается, когда блок попадает на экран -->
  <animations-scroll-fade
    is="section"
    class="service-info"
    :initial-opacity="0.3"
  >
    <span class="service-info__label">(info)</span>
    <div class="service-info__text">
      <p
        v-for="paragraph in paragraphs"
        :key="paragraph"
        class="service-info__paragraph"
        v-html="t(`${i18nKey}.${paragraph}`)"
      />
    </div>
  </animations-scroll-fade>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.service-info {
  display: grid;
  grid-template-columns: 4fr 8fr;

  @include s.base-container;

  @include a.tablet {
    grid-template-columns: 116px 1fr;
  }

  @include a.mobile {
    grid-template-columns: 52px 1fr;
  }
}

.service-info__label {
  color: var(--dark-blue-50);

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
    margin-top: var(--info-paragraph-gap, 12px);

    @include a.mobile {
      margin-top: 8px;
    }
  }
}
</style>
