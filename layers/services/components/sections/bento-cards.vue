<script setup lang="ts">
import type { ServiceFeatureItem } from '@l-services/types';

const { items } = defineProps<{
  /** Карточки в порядке вывода */
  items: ServiceFeatureItem[];
}>();

const { isDesktop } = useDevice();

const hoveredIdx = ref(-1);

const itemNumber = (idx: number) => `(${String(idx + 1).padStart(2, '0')})`;

/** На планшете и мобильном раскрыты все карточки, на десктопе — только наведённая */
const isExpanded = (idx: number) => !isDesktop.value || hoveredIdx.value === idx;

// Ряды по три слота, как в макете: первый слот первого ряда занимает декор.
// Ряды нужны как flex-контейнеры — внутри них ширина карточки перетекает
// плавно (по правкам: анимация по аналогии с блоком партнёрства на /about),
// а не скачет переносом на другую строку, как в общей сетке
const rows = computed(() => {
  const chunks: { item: ServiceFeatureItem; idx: number }[][] = [];
  const list = items.map((item, idx) => ({ item, idx }));

  chunks.push(list.slice(0, 2));

  for (let i = 2; i < list.length; i += 3) {
    chunks.push(list.slice(i, i + 3));
  }

  return chunks;
});
</script>

<template>
  <section class="bento-cards" @mouseleave="hoveredIdx = -1">
    <div
      v-for="(row, rowIdx) in rows"
      :key="rowIdx"
      class="bento-cards__row"
    >
      <!-- Ячейку рисуем всегда: по макету карточки начинаются со второй колонки -->
      <div v-if="rowIdx === 0" class="bento-cards__decor">
        <slot name="decor" />
      </div>
      <article
        v-for="{ item, idx } in row"
        :key="item.title"
        class="bento-cards__card"
        :class="{ 'bento-cards__card_expanded': isExpanded(idx) }"
        @mouseenter="hoveredIdx = idx"
      >
        <span class="bento-cards__label">
          <span
            class="bento-cards__label-text"
            :class="{ 'bento-cards__label-text_hidden': isExpanded(idx) }"
          >{{ itemNumber(idx) }}</span>
          <span
            class="bento-cards__label-text bento-cards__label-text_info"
            :class="{ 'bento-cards__label-text_hidden': !isExpanded(idx) }"
          >(info)</span>
        </span>
        <div class="bento-cards__content">
          <h3 class="bento-cards__title" v-html="item.title" />
          <p class="bento-cards__text" v-html="item.text" />
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

// Значения по умолчанию внутри var() записаны в rem: postcss-pxtorem
// не заходит внутрь var(), поэтому px там остался бы жёстким, тогда как
// остальная вёрстка тянется от html font-size. В скобках размер по макету

.bento-cards {
  position: relative;

  @include s.base-container;
}

.bento-cards__row {
  display: flex;
  gap: 16px;
  height: var(--bento-row-height, 22.5rem); // 360px

  // Карточки складываются в столбец и тянутся по содержимому

  @include a.tablet {
    display: block;
    height: auto;
  }

  &:not(:first-child) {
    margin-top: 16px;

    @include a.mobile {
      margin-top: 12px;
    }
  }
}

.bento-cards__decor {
  // Треть ряда за вычетом двух жёлобов, как колонка сетки макета.
  // Shrink разрешён: когда соседняя карточка раскрывается и ряду не хватает
  // места, декор уступает ей ширину первым

  flex: 0 1 calc((100% - 32px) / 3);
  min-width: 0;
  overflow: hidden;

  @include a.tablet {
    // В одну колонку декор не занимает ряд, а лежит за карточками во всю секцию

    position: absolute;
    inset: 0;
  }
}

.bento-cards__card {
  // Позиционирование нужно, чтобы карточка перекрывала декор: на планшете он
  // вынут из потока и иначе оказался бы поверх текста

  position: relative;

  display: flex;

  // Треть ряда, как колонка сетки макета. Basis анимируется, а разрешённый
  // shrink даёт соседу плавно ужиматься, когда раскрытой не хватает места

  flex: 0 1 calc((100% - 32px) / 3);
  flex-direction: column;
  justify-content: space-between;

  // Ниже сосед раскрытой карточки не ужимается — заголовок остаётся читаемым

  min-width: 12.5rem; // 200px
  padding: 24px;
  overflow: hidden;

  background-color: var(--bento-card-bg, var(--dark-blue-5));
  border: 1px solid var(--dark-blue-10);
  border-radius: var(--bento-card-radius, 0.75rem); // 12px

  // Ширина перетекает плавно — как у карточек партнёрства на /about

  transition: flex-basis 0.5s v.$easing, background-color 0.5s, border-color 0.5s;

  @include a.tablet {
    // Высота по содержимому, поэтому распорку заменяет фиксированный отступ

    gap: 40px;

    transition: none;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }

  @include a.mobile {
    gap: 24px;
    padding: 16px;

    &:not(:first-child) {
      margin-top: 12px;
    }
  }

  &_expanded {
    border-color: var(--dark-blue-20);

    @include a.desktop-only {
      // Две колонки сетки вместе с жёлобом между ними

      flex-basis: calc((100% - 32px) / 3 * 2 + 16px);
      flex-shrink: 0;

      background-color: var(--white);

      .bento-cards__text {
        max-height: none;
        margin-top: 24px;

        opacity: 1;

        // Текст ждёт, пока карточка доедет до полной ширины, — как в партнёрстве

        transition-delay: 0.35s;
      }
    }
  }
}

.bento-cards__label {
  position: relative;

  color: var(--dark-blue-60);

  @include t.lead-s-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.bento-cards__label-text {
  transition: opacity 0.3s;

  &_info {
    position: absolute;
    top: 0;
    left: 0;
  }

  &_hidden {
    @include a.desktop-only {
      opacity: 0;
    }

    // На планшете и мобильном номер спрятан насовсем: там всегда (info)

    &:not(.bento-cards__label-text_info) {
      @include a.tablet {
        display: none;
      }
    }
  }
}

.bento-cards__title {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

.bento-cards__text {
  max-height: 0;
  margin-top: 0;

  color: var(--dark-blue-80);

  opacity: 0;

  transition: opacity 0.3s;

  @include t.body-l-medium;

  @include a.tablet {
    max-height: none;
    margin-top: 16px;

    opacity: 1;
  }

  @include a.mobile {
    margin-top: 12px;

    @include t.body-s-medium;
  }
}
</style>
