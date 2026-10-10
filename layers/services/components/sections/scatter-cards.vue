<script setup lang="ts">
import { gsap } from 'gsap';
import type {
  FigurePlacements,
  ScatterCardPositions,
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
  /** Размещение фигуры из слота decor по макету относительно сцены */
  decor?: FigurePlacements;
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

const stageRef = useTemplateRef<HTMLElement>('stageRef');

// По комментарию в макете блок не статичный: плашки и паттерн выплывают
// при скролле по очереди. Прогресс привязан к прокрутке (scrub), а не к запуску
// твина: одноразовый триггер успевал отработать вхолостую на mount, пока
// картинки не загрузились и позиции считались по короткой странице.
// Триггер у каждой плашки свой: плашки разложены по сцене на сотни пикселей,
// и от общего триггера нижняя успевала проявиться, пока была за экраном.
// Очередь задаёт небольшой сдвиг диапазона по порядку. Паттерн появляется
// сам, как фигура на главной (см. figure)
const REVEAL_STEP = 4;
const REVEAL_LENGTH = 25;

// Переходы держим, чтобы снять их вместе с компонентом: useGsap ничего
// не убирает, а при возврате на страницу второй набор триггеров сбрасывал бы
// уже проигранное в исходное состояние
const tweens: gsap.core.Tween[] = [];

const revealAnimation = () => {
  const stage = stageRef.value;

  if (!stage) return;

  const targets = stage.querySelectorAll<HTMLElement>('.scatter-cards__card');

  targets.forEach((target, idx) => {
    const offset = idx * REVEAL_STEP;

    gsap.set(target, { opacity: 0, y: 48 });

    tweens.push(gsap.to(target, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: `top bottom-=${offset}%`,
        end: `top bottom-=${offset + REVEAL_LENGTH}%`,
        scrub: true,
      },
    }));
  });
};

useGsap(revealAnimation);

onBeforeUnmount(() => {
  tweens.forEach(tween => tween.scrollTrigger?.kill());
  tweens.length = 0;
});

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
      <services-molecules-figure
        v-if="$slots.decor"
        class="scatter-cards__decor"
        :placement="decor"
      >
        <slot name="decor" />
      </services-molecules-figure>
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

  // Фон полупрозрачный — сквозь карточку виден размытый декор

  background: var(--scatter-bg, var(--white));
  border: 1px solid var(--scatter-border, var(--dark-blue-20));
  border-radius: var(--scatter-radius, 0.75rem); // 12px
  backdrop-filter: blur(35px);

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

  // По макету описание приглушено относительно заголовка

  color: var(--dark-blue-80);

  @include t.body-m-medium;

  @include a.mobile {
    margin-top: 12px;

    @include t.body-s-medium;
  }
}
</style>
