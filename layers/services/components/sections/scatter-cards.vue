<script setup lang="ts">
import { gsap } from 'gsap';
import type {
  ScatterCardPositions,
  ScatterDecorPlacement,
  ScatterDecorPositions,
  ServiceFeatureItem,
} from '@l-services/types';

const {
  items,
  positions,
  decor,
  cardWidth = 540,
  minHeight = 0,
  minHeightTablet,
} = defineProps<{
  /** Карточки в порядке наложения: следующая перекрывает предыдущую */
  items: ServiceFeatureItem[];
  /** Координаты карточек по брейкпоинтам, индексы совпадают с items */
  positions: ScatterCardPositions;
  /** Размещение фигуры в слоте decor; без него фигура тянется на всю сцену */
  decor?: ScatterDecorPositions;
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

const decorVars = (placement: ScatterDecorPlacement | undefined, suffix: string) => {
  if (!placement) return {};

  const [x, y, size] = placement;

  return {
    [`--scatter-decor-x${suffix}`]: toRem(x),
    [`--scatter-decor-y${suffix}`]: toRem(y),
    [`--scatter-decor-size${suffix}`]: toRem(size),
  };
};

const rootStyle = computed(() => {
  const tablet = decor?.tablet ?? decor?.desktop;

  return {
    '--scatter-card-width': toRem(cardWidth),
    '--scatter-min-height': toRem(minHeight),
    '--scatter-min-height-tablet': toRem(minHeightTablet ?? minHeight),
    ...decorVars(decor?.desktop, ''),
    ...decorVars(tablet, '-tablet'),
    ...decorVars(decor?.mobile ?? tablet, '-mobile'),
  };
});

const stageRef = useTemplateRef<HTMLElement>('stageRef');

// По комментарию в макете блок не статичный: плашки и паттерн выплывают
// при скролле по очереди. Очередь задаёт сама вёрстка — у каждой карточки
// свой триггер, а лежат они на разной высоте, поэтому и проявляются подряд
const revealAnimation = () => {
  const stage = stageRef.value;

  if (!stage) return;

  const targets = stage.querySelectorAll<HTMLElement>('.scatter-cards__decor, .scatter-cards__card');

  targets.forEach((target) => {
    gsap.set(target, { opacity: 0, y: 40 });

    gsap.to(target, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'top bottom-=25%',
        scrub: 0.3,
      },
    });
  });
};

useGsap(revealAnimation);

/** Карточка без координат остаётся в левом верхнем углу сцены */
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
    <!-- Сцена повторяет колонку контейнера, чтобы координаты карточек
         совпадали с макетом: у абсолютного позиционирования точка отсчёта —
         внешний край padding, а в макете он же — край контента -->
    <div ref="stageRef" class="scatter-cards__stage">
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
    </div>
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
  @include s.base-container;
}

.scatter-cards__stage {
  position: relative;

  min-height: var(--scatter-min-height, 0);

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
  top: var(--scatter-decor-y, 0);
  left: var(--scatter-decor-x, 0);

  z-index: 0;

  width: var(--scatter-decor-size, 100%);

  @include a.tablet {
    top: var(--scatter-decor-y-tablet, 0);
    left: var(--scatter-decor-x-tablet, 0);

    width: var(--scatter-decor-size-tablet, 100%);
  }

  @include a.mobile {
    top: var(--scatter-decor-y-mobile, 0);
    left: var(--scatter-decor-x-mobile, 0);

    width: var(--scatter-decor-size-mobile, 100%);
  }
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
