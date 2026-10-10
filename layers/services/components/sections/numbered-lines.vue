<script setup lang="ts">
import type { NumberedLineItem } from '@l-services/types';

const {
  items,
  columns = 2,
  tabletColumns = 1,
  textSize = 'body',
  revealOnHover = false,
} = defineProps<{
  /** Пункты в порядке вывода */
  items: NumberedLineItem[];
  /** Колонок на десктопе */
  columns?: 2 | 3;
  /** Колонок на планшете */
  tabletColumns?: 1 | 2;
  /** Кегль текста: lead — 24px, body — 18px */
  textSize?: 'lead' | 'body';
  /** Текст пункта показывается только при наведении, и только на десктопе */
  revealOnHover?: boolean;
}>();

const itemNumber = (idx: number) => `(${String(idx + 1).padStart(2, '0')})`;
</script>

<template>
  <section
    class="numbered-lines"
    :class="{
      'numbered-lines_reveal': revealOnHover,
      'numbered-lines_lead': textSize === 'lead',
    }"
    :style="{ '--lines-columns': columns, '--lines-columns-tablet': tabletColumns }"
  >
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="numbered-lines__item"
    >
      <span class="numbered-lines__number">{{ itemNumber(idx) }}</span>
      <div class="numbered-lines__line" />
      <span
        v-if="item.label"
        class="numbered-lines__label"
        v-html="item.label"
      />
      <p
        v-if="item.text"
        class="numbered-lines__text"
        :class="{ 'numbered-lines__text_lead': textSize === 'lead' }"
        v-html="item.text"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

// Значения по умолчанию внутри var() записаны в rem: postcss-pxtorem
// не заходит внутрь var(). В скобках размер по макету. Через переменные
// страница подстраивает блок под свой макет: ширину текста, шаг рядов,
// высоту пункта и цвет разделителя

.numbered-lines {
  display: grid;
  grid-template-columns: repeat(var(--lines-columns, 2), 1fr);
  gap: var(--lines-row-gap, 2.5rem) 16px; // 40px

  @include s.base-container;

  @include a.tablet {
    grid-template-columns: repeat(var(--lines-columns-tablet, 1), 1fr);
    row-gap: var(--lines-row-gap-tablet, 3.25rem); // 52px
  }

  @include a.mobile {
    grid-template-columns: 1fr;
    row-gap: var(--lines-row-gap-mobile, 2.5rem); // 40px
  }

  &_reveal {
    // Сценарий из макета: по умолчанию видны только номер, дивайдер
    // и заголовок с прозрачностью 80%. При наведении появляется текст,
    // дивайдер подсвечивается градиентом, заголовок доводится до 100%.
    // Текст прячет прозрачность, а не display: none: место под него
    // остаётся занятым, иначе ряды сетки прыгали бы при наведении
    @include a.desktop-only {
      .numbered-lines__line {
        background-image: linear-gradient(
          90deg,
          var(--service-accent) 0%,
          transparent 100%
        );
        background-repeat: no-repeat;
        background-size: 0% 100%;

        @include s.default-transition(background-size);
      }

      .numbered-lines__label {
        opacity: 0.8;

        @include s.default-transition(opacity);
      }

      .numbered-lines__text {
        opacity: 0;

        @include s.default-transition(opacity);
      }

      .numbered-lines__item {
        @include s.hover {
          .numbered-lines__line {
            background-size: 100% 100%;
          }

          .numbered-lines__label {
            opacity: 1;
          }

          .numbered-lines__text {
            opacity: 1;
          }
        }
      }
    }
  }
}

.numbered-lines__item {
  min-height: var(--lines-item-min-height, auto);
}

.numbered-lines__number {
  display: block;

  color: var(--dark-blue-60);

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;

    & {
      font-size: var(--lines-number-size-mobile, 0.875rem); // 14px
    }
  }
}

.numbered-lines__line {
  height: 1px;
  margin: 16px 0;

  background-color: var(--lines-line-color, var(--dark-blue-20));

  // Крупный текст без подписи на мобильном стоит к линии плотнее

  @include a.mobile {
    .numbered-lines_lead & {
      margin: 12px 0;
    }
  }
}

.numbered-lines__label {
  display: block;

  color: var(--dark-blue);

  @include t.body-l-medium;

  @include a.mobile {
    @include t.body-m-medium;
  }
}

// Описание под подписью по макету приглушено до 60%, крупный текст без
// подписи остаётся основного цвета

.numbered-lines__text {
  max-width: var(--lines-text-max-width, none);

  color: var(--dark-blue-60);

  @include t.body-m-medium;

  @include a.mobile {
    max-width: none;

    @include t.body-s-medium;
  }

  &_lead {
    color: var(--dark-blue);

    @include t.lead-m-medium;

    @include a.mobile {
      @include t.body-m-medium;
    }
  }
}

// Подписи может не быть — тогда текст отбивает от линии её собственный отступ

.numbered-lines__label + .numbered-lines__text {
  margin-top: 12px;
}
</style>
