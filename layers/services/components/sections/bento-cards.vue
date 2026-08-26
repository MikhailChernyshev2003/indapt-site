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
</script>

<template>
  <!-- Сброс наведения висит на секции, а не на карточке: раскрытая карточка
       занимает две колонки и, если стояла в последней, переезжает на строку
       ниже — из-под курсора. mouseleave на самой карточке в этот момент
       свернул бы её обратно под курсор, и так по кругу -->
  <section class="bento-cards" @mouseleave="hoveredIdx = -1">
    <!-- Ячейку рисуем всегда: по макету карточки начинаются со второй колонки,
         даже когда декор не передали -->
    <div class="bento-cards__decor">
      <slot name="decor" />
    </div>
    <article
      v-for="(item, idx) in items"
      :key="item.title"
      class="bento-cards__card"
      :class="{ 'bento-cards__card_expanded': isExpanded(idx) }"
      @mouseenter="hoveredIdx = idx"
    >
      <span class="bento-cards__label">{{ isExpanded(idx) ? '(info)' : itemNumber(idx) }}</span>
      <div class="bento-cards__content">
        <h3 class="bento-cards__title" v-html="item.title" />
        <p
          v-if="isExpanded(idx)"
          class="bento-cards__text"
          v-html="item.text"
        />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

// Значения по умолчанию внутри var() записаны в rem: postcss-pxtorem
// не заходит внутрь var(), поэтому px там остался бы жёстким, тогда как
// остальная вёрстка тянется от html font-size. В скобках размер по макету

.bento-cards {
  position: relative;

  display: grid;
  grid-auto-rows: var(--bento-row-height, 22.5rem); // 360px
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @include s.base-container;

  @include a.tablet {
    grid-auto-rows: auto;

    // Карточки складываются в столбец и тянутся по содержимому

    grid-template-columns: 1fr;
  }

  @include a.mobile {
    gap: 12px;
  }
}

.bento-cards__decor {
  grid-area: 1 / 1;

  @include a.tablet {
    // В одну колонку декор не занимает ряд, а лежит за карточками во всю секцию.
    // grid-area обязательно снять: для абсолютного потомка грид-контейнера
    // содержащим блоком становится его же грид-ячейка, и с grid-area: 1 / 1
    // inset: 0 растянул бы декор от левого верхнего угла контентной области
    // до правого нижнего края паддингов, а не на всю секцию

    position: absolute;
    inset: 0;

    grid-area: auto;
  }
}

.bento-cards__card {
  // Позиционирование нужно, чтобы карточка перекрывала декор: на планшете он
  // вынут из потока и иначе оказался бы поверх текста

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;

  background-color: var(--bento-card-bg, var(--dark-blue-5));
  border: 1px solid var(--dark-blue-10);
  border-radius: var(--bento-card-radius, 0.75rem); // 12px

  @include s.default-transition(background-color, border-color);

  @include a.tablet {
    // Высота по содержимому, поэтому распорку заменяет фиксированный отступ

    gap: 40px;
  }

  @include a.mobile {
    gap: 24px;
    padding: 16px;
  }

  &_expanded {
    border-color: var(--dark-blue-20);

    @include a.desktop-only {
      grid-column: span 2;

      background-color: var(--white);
    }
  }
}

.bento-cards__label {
  color: var(--dark-blue-60);

  @include t.lead-s-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
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
  margin-top: 24px;

  color: var(--dark-blue-80);

  @include t.body-l-medium;

  @include a.tablet {
    margin-top: 16px;
  }

  @include a.mobile {
    margin-top: 12px;

    @include t.body-s-medium;
  }
}
</style>
