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
// соседний desc-services.vue с похожими отступами тянется от html
// font-size. В скобках размер по макету

.feature-list__item {
  display: grid;

  // Колонки макета: текст начинается в 445px от края контейнера и занимает
  // 763px, справа остаётся пустое место. По этой ширине строки переносятся
  // так же, как в макете

  grid-template-columns: 445px 763px;
  padding-top: var(--feature-row-padding-top, 2.5rem); // 40px

  // По макету текст отбит от разделителя на 52px с обеих сторон

  padding-bottom: var(--feature-row-padding-bottom, 3.25rem); // 52px

  // На планшете текст по макету начинается в 118px от края — колонка
  // 570px, по ней переносятся заголовки

  @include a.tablet {
    grid-template-columns: 118px 1fr;
  }

  @include a.mobile {
    grid-template-columns: 52px 1fr;
    padding-top: 32px;
    padding-bottom: 24px;
  }

  // Сверху у блока разделитель, поэтому по макету поле больше, чем у первого

  &:not(:first-child) {
    padding-top: var(--feature-row-padding-top-next, 3.25rem); // 52px

    border-top: 1px solid var(--dark-blue-20);

    @include a.mobile {
      padding-top: 24px;
    }
  }

  // Первый блок страница может выделить: в макете дизайна его текст шире
  // колонки (до правого края сетки) и сильнее отбит от заголовка

  &:first-child {
    @include a.desktop-only {
      grid-template-columns: 445px var(--feature-lead-width, 47.6875rem); // 763px
    }

    .feature-list__text {
      margin-top: var(--feature-lead-gap, 1rem); // 16px

      @include a.mobile {
        margin-top: var(--feature-text-gap-mobile, 0.75rem); // 12px
      }
    }
  }
}

// На мобильном колонка текста в макете чуть уже доступной ширины —
// от этого зависят переносы заголовков

.feature-list__content {
  @include a.mobile {
    max-width: 277px;
  }
}

.feature-list__number {
  color: var(--dark-blue-60);

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

  // Описание по макету приглушено относительно заголовка

  color: var(--dark-blue-80);

  @include t.body-m-medium;

  @include a.mobile {
    margin-top: var(--feature-text-gap-mobile, 0.75rem); // 12px

    @include t.body-s-medium;
  }
}
</style>
