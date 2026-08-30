<script setup lang="ts">
import type { ServiceFeatureItem } from '@l-services/types';

const { items } = defineProps<{
  /** Блоки списка в порядке вывода */
  items: ServiceFeatureItem[];
}>();

const itemNumber = (idx: number) => `(${String(idx + 1).padStart(2, '0')})`;
</script>

<template>
  <section class="feature-list">
    <services-molecules-text-reveal
      is="article"
      v-for="(item, idx) in items"
      :key="item.title"
      class="feature-list__item"
    >
      <span class="feature-list__number" data-reveal="text">{{ itemNumber(idx) }}</span>
      <div class="feature-list__content">
        <h3
          class="feature-list__title"
          data-reveal="title"
          v-html="item.title"
        />
        <p
          class="feature-list__text"
          data-reveal="text"
          v-html="item.text"
        />
      </div>
    </services-molecules-text-reveal>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.feature-list {
  @include s.base-container;
}

// Значения по умолчанию внутри var() записаны в rem: postcss-pxtorem
// не заходит внутрь var(), поэтому px там остался бы жёстким, тогда как
// соседний desc-services.vue с теми же 40/56/28px тянется от html
// font-size. В скобках размер по макету

.feature-list__item {
  display: grid;

  // Сетка макета: 12 колонок по 88px с жёлобом 24px. Номер занимает первые
  // четыре вместе с жёлобом, текст — следующие семь, последняя остаётся
  // пустой. Из-за неё строки переносятся так же, как в макете

  grid-template-columns: 448px 760px;
  padding-top: var(--feature-row-padding-top, 2.5rem); // 40px
  padding-bottom: var(--feature-row-padding-bottom, 1.75rem); // 28px

  @include a.tablet {
    grid-template-columns: 116px 1fr;
  }

  @include a.mobile {
    grid-template-columns: 52px 1fr;
    padding-top: 32px;
    padding-bottom: 24px;
  }

  // Сверху у блока разделитель, поэтому по макету поле больше, чем у первого

  &:not(:first-child) {
    padding-top: var(--feature-row-padding-top-next, 3.5rem); // 56px

    border-top: 1px solid var(--dark-blue-20);

    @include a.mobile {
      padding-top: 40px;
    }
  }
}

.feature-list__number {
  color: var(--dark-blue-50);

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.feature-list__title {
  color: var(--dark-blue);

  @include t.h3;

  @include a.mobile {
    @include t.h5;
  }
}

.feature-list__text {
  margin-top: 16px;

  color: var(--dark-blue);

  @include t.body-m-medium;

  @include a.mobile {
    margin-top: 12px;

    @include t.body-s-medium;
  }
}
</style>
