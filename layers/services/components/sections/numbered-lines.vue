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
    :class="{ 'numbered-lines_reveal': revealOnHover }"
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

.numbered-lines {
  display: grid;
  grid-template-columns: repeat(var(--lines-columns, 2), 1fr);
  gap: 40px 16px;

  @include s.base-container;

  @include a.tablet {
    grid-template-columns: repeat(var(--lines-columns-tablet, 1), 1fr);
  }

  @include a.mobile {
    grid-template-columns: 1fr;
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

.numbered-lines__number {
  display: block;

  color: var(--dark-blue-50);

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.numbered-lines__line {
  height: 1px;
  margin: 16px 0 20px;

  background-color: var(--dark-blue-20);

  @include a.mobile {
    margin-bottom: 16px;
  }
}

.numbered-lines__label {
  display: block;

  color: var(--dark-blue);

  @include t.body-l-medium;
}

.numbered-lines__text {
  color: var(--dark-blue);

  @include t.body-m-medium;

  &_lead {
    @include t.lead-m-medium;
  }
}

// Подписи может не быть — тогда текст отбивает от линии её собственный отступ

.numbered-lines__label + .numbered-lines__text {
  margin-top: 16px;

  @include a.mobile {
    margin-top: 12px;
  }
}
</style>
