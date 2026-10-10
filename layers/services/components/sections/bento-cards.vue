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

// Ряды по три слота, как в макете: первый слот первого ряда пустой — под ним
// лежит фигура из слота decor.
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
    <!-- Фигура из макета лежит за карточками и размещается относительно секции -->
    <slot name="decor" />
    <div
      v-for="(row, rowIdx) in rows"
      :key="rowIdx"
      class="bento-cards__row"
    >
      <!-- Ячейку рисуем всегда: по макету карточки начинаются со второй колонки -->
      <div v-if="rowIdx === 0" class="bento-cards__spacer" />
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
        </div>
        <p class="bento-cards__text" v-html="item.text" />
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

.bento-cards__spacer {
  // Треть ряда за вычетом двух жёлобов, как колонка сетки макета.
  // Когда карточка рядом раскрывается на две колонки, ряду не хватает места,
  // и первой его отдаёт пустая ячейка — большой shrink забирает почти всё
  // сжатие на неё, соседняя карточка остаётся своей ширины, как в макете

  flex: 0 100 calc((100% - 32px) / 3);
  min-width: 0;

  @include a.tablet {
    // В одну колонку пустой ячейки нет

    display: none;
  }
}

.bento-cards__card {
  // Позиционирование нужно, чтобы карточка лежала поверх фигуры

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

  // Карточка по макету полупрозрачная и размывает фигуру под собой

  background-color: var(--bento-card-bg, var(--dark-blue-5));
  border: 1px solid var(--dark-blue-10);
  border-radius: var(--bento-card-radius, 0.75rem); // 12px
  backdrop-filter: blur(35px);

  // Ширина перетекает плавно — как у карточек партнёрства на /about

  transition: flex-basis 0.5s v.$easing, background-color 0.5s, border-color 0.5s;

  @include a.tablet {
    // Высота по содержимому, поэтому распорку заменяют отступы
    // заголовка и текста (см. ниже)

    transition: none;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }

  @include a.mobile {
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

      // Заголовок поднимается transform'ом — раскладка карточки не меняется

      .bento-cards__content {
        transform: translateY(-8.75rem); // 140px
      }

      .bento-cards__text {
        opacity: 1;

        // Текст ждёт, пока карточка доедет до полной ширины, — как в партнёрстве

        transition-delay: 0.5s;
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

    // Номер на планшете и мобильном спрятан, и метка должна сама держать
    // высоту строки — иначе заголовок прилипает к ней

    @include a.tablet {
      position: static;
    }
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

.bento-cards__content {
  transition: transform 0.5s v.$easing;

  @include a.tablet {
    margin-top: 40px;

    transition: none;
  }

  @include a.mobile {
    margin-top: 24px;
  }
}

.bento-cards__title {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

// Текст вынут из потока, как в партнёрстве: его появление не двигает
// ни заголовок, ни соседние карточки — только opacity

.bento-cards__text {
  position: absolute;
  right: 24px;
  bottom: 24px;
  left: 24px;

  color: var(--dark-blue-80);

  opacity: 0;

  transition: opacity 0.2s;

  @include t.body-l-medium;

  @include a.tablet {
    position: static;

    margin-top: 16px;

    opacity: 1;

    transition: none;
  }

  @include a.mobile {
    margin-top: 12px;

    @include t.body-s-medium;
  }
}
</style>
