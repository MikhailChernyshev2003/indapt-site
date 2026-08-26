<script setup lang="ts">
import type { ArchitectureCardItem } from '@l-services/types';

const { items } = defineProps<{
  /** Карточки в порядке вывода */
  items: ArchitectureCardItem[];
}>();

const { isDesktop } = useDevice();

const hoveredIdx = ref(-1);

const itemNumber = (idx: number) => `(${String(idx + 1).padStart(2, '0')})`;

/** На планшете и мобильном раскрыты все карточки, на десктопе — только наведённая */
const isExpanded = (idx: number) => !isDesktop.value || hoveredIdx.value === idx;

// Продолжение склеивается с началом в один абзац: в русской локали text
// продолжает предложение и начинается со знака препинания («. По результатам…»),
// в английской это самостоятельное предложение. Пробел ставим только во втором
// случае, иначе перед точкой появился бы отбив
const cardText = (item: ArchitectureCardItem, idx: number) => {
  if (!isExpanded(idx)) return item.shortText;

  const separator = /^[A-Za-zА-Яа-яЁё]/.test(item.text) ? ' ' : '';

  return `${item.shortText}${separator}${item.text}`;
};
</script>

<template>
  <section class="architecture-cards">
    <article
      v-for="(item, idx) in items"
      :key="item.title"
      class="architecture-cards__card"
      @mouseenter="hoveredIdx = idx"
      @mouseleave="hoveredIdx = -1"
    >
      <h3 class="architecture-cards__title" v-html="item.title" />
      <div class="architecture-cards__content">
        <span class="architecture-cards__number">{{ itemNumber(idx) }}</span>
        <p class="architecture-cards__text" v-html="cardText(item, idx)" />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.architecture-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @include s.base-container;
}

.architecture-cards__card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 32px;

  background-color: var(--architecture-card-bg, var(--white));
  border-radius: 16px;

  @include s.default-transition(background-color);

  // Наведение работает только на десктопе: на планшете и мобильном карточки
  // и так раскрыты, подсвечивать там нечего

  @include a.desktop-only {
    @include s.hover {
      background-color: var(--architecture-card-bg-hover, var(--light-blue));
    }
  }

  @include a.tablet {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @include a.mobile {
    gap: 16px;
    padding: 16px;
  }
}

.architecture-cards__title {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.body-l-medium;
  }
}

.architecture-cards__number {
  display: block;

  color: var(--dark-blue-50);

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.architecture-cards__text {
  margin-top: 12px;

  color: var(--dark-blue);

  @include t.body-m-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}
</style>
