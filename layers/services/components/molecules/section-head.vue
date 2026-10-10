<script setup lang="ts">
import type { SectionHeadSize } from '@l-services/types';

const {
  title,
  desc,
  size = 'h1',
  titleMaxWidth,
  descMaxWidth,
} = defineProps<{
  /** Готовая разметка заголовка */
  title: string;
  /** Готовая разметка подводки */
  desc?: string;
  /** Кегль заголовка */
  size?: SectionHeadSize;
  /** Ширина, по которой переносится заголовок, в px по макету, например 760 */
  titleMaxWidth?: number;
  /** Ширина, по которой переносится подводка, в px по макету */
  descMaxWidth?: number;
}>();

// html font-size в проекте тянется от ширины экрана, а px в стилях
// postcss переводит в rem. Инлайновый style мимо postcss не проходит,
// поэтому переводим сами — иначе ширина переноса перестанет
// масштабироваться вместе с кеглем (ср. max-width: 760px в expertise.vue)
const toRem = (px?: number) => (px === undefined ? undefined : `${px / 16}rem`);

// Незаданный проп Vue пропускает, поэтому в CSS остаётся значение по умолчанию
const maxWidths = computed(() => ({
  '--section-head-title-max-width': toRem(titleMaxWidth),
  '--section-head-desc-max-width': toRem(descMaxWidth),
}));
</script>

<template>
  <services-molecules-text-reveal class="section-head" :style="maxWidths">
    <h2
      class="section-head__title"
      :class="`section-head__title_${size}`"
      data-reveal="title"
      v-html="title"
    />
    <p
      v-if="desc"
      class="section-head__desc"
      data-reveal="text"
      v-html="desc"
    />
  </services-molecules-text-reveal>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.section-head__title {
  max-width: var(--section-head-title-max-width, none);

  color: var(--dark-blue);

  // Модификаторы кегля идут после базового правила и перебили бы
  // мобильный размер, поэтому он задан внутри каждого из них

  &_h1 {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &_h2 {
    @include t.h2;

    @include a.mobile {
      @include t.h4;
    }
  }
}

.section-head__desc {
  max-width: var(--section-head-desc-max-width, none);
  margin-top: 16px;

  color: var(--dark-blue-80);

  @include t.body-m-medium;

  @include a.mobile {
    margin-top: 9px;

    @include t.body-s-medium;
  }
}
</style>
