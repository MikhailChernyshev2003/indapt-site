<script setup lang="ts">
import type { ScatterCardPositions, ServiceFeatureItem } from '@l-services/types';

const {
  items,
  positions,
  cardWidth = 540,
  minHeight = 0,
  minHeightTablet,
} = defineProps<{
  /** Карточки в порядке наложения: следующая перекрывает предыдущую */
  items: ServiceFeatureItem[];
  /** Координаты карточек по брейкпоинтам, индексы совпадают с items */
  positions: ScatterCardPositions;
  /** Ширина карточки на десктопе и планшете */
  cardWidth?: number;
  /** Карточки вынуты из потока и высоту не задают — она приходит из макета */
  minHeight?: number;
  /** По умолчанию равна десктопной */
  minHeightTablet?: number;
}>();

// html font-size в проекте тянется от ширины экрана, а px в стилях postcss
// переводит в rem. Инлайновый style мимо postcss не проходит, поэтому
// переводим сами: иначе карточки остались бы в жёстких px и разъехались бы
// относительно паддингов контейнера на любой ширине, кроме макетной
const toRem = (px: number) => `${px / 16}rem`;

const rootStyle = computed(() => ({
  '--scatter-card-width': toRem(cardWidth),
  '--scatter-min-height': toRem(minHeight),
  '--scatter-min-height-tablet': toRem(minHeightTablet ?? minHeight),
}));

/** Карточка без координат остаётся в левом верхнем углу секции */
const cardStyle = (idx: number) => {
  const [x = 0, y = 0] = positions.desktop[idx] ?? [];
  const [tabletX = x, tabletY = y] = positions.tablet[idx] ?? [];

  return {
    '--scatter-card-x': toRem(x),
    '--scatter-card-y': toRem(y),
    '--scatter-card-x-tablet': toRem(tabletX),
    '--scatter-card-y-tablet': toRem(tabletY),
  };
};
</script>

<template>
  <section class="scatter-cards" :style="rootStyle">
    <div v-if="$slots.decor" class="scatter-cards__decor">
      <slot name="decor" />
    </div>
    <article
      v-for="(item, idx) in items"
      :key="item.title"
      class="scatter-cards__card"
      :style="cardStyle(idx)"
    >
      <h3 class="scatter-cards__title" v-html="item.title" />
      <p class="scatter-cards__text" v-html="item.text" />
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

.scatter-cards {
  position: relative;

  min-height: var(--scatter-min-height, 0);

  @include s.base-container;

  @include a.tablet {
    min-height: var(--scatter-min-height-tablet, 0);
  }

  @include a.mobile {
    // Карточки возвращаются в поток и складываются в столбец

    display: flex;
    flex-direction: column;
    gap: var(--scatter-gap, 1.625rem); // 26px
    min-height: auto;
  }
}

.scatter-cards__decor {
  position: absolute;
  inset: 0;

  z-index: 0;
}

.scatter-cards__card {
  position: absolute;
  top: var(--scatter-card-y, 0);
  left: var(--scatter-card-x, 0);

  // z-index нужен и на мобильном: у flex-элемента он создаёт контекст
  // наложения даже при position: static, иначе декор перекроет карточку

  z-index: 1;

  width: var(--scatter-card-width, 33.75rem); // 540px
  padding: 28px;

  color: var(--dark-blue);

  // Фон полупрозрачный — сквозь карточку виден декор

  background: var(--scatter-bg, var(--white));
  border: 1px solid var(--scatter-border, var(--dark-blue-20));
  border-radius: var(--scatter-radius, 0.75rem); // 12px

  @include a.tablet {
    top: var(--scatter-card-y-tablet, 0);
    left: var(--scatter-card-x-tablet, 0);
  }

  @include a.mobile {
    position: static;

    width: 100%;
    padding: 16px;
  }
}

.scatter-cards__title {
  @include t.lead-m-medium;

  @include a.mobile {
    @include t.body-l-medium;
  }
}

.scatter-cards__text {
  margin-top: 16px;

  @include t.body-m-medium;

  @include a.mobile {
    margin-top: 12px;

    @include t.body-s-medium;
  }
}
</style>
