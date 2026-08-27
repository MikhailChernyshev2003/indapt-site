<script setup lang="ts">
import { gsap } from 'gsap';
import type { ArchitectureCardItem } from '@l-services/types';

const { items, mark } = defineProps<{
  /** Карточки в порядке вывода */
  items: ArchitectureCardItem[];
  /** Ромб, выезжающий у наведённой карточки; без пропа карточка остаётся без него */
  mark?: string;
}>();

const { isDesktop } = useDevice();

const hoveredIdx = ref(-1);

const cardsRef = useTemplateRef<HTMLElement[]>('cardsRef');

// Наведение считаем от позиции курсора, а не от mouseenter/mouseleave на
// карточках. Раскрытая карточка сдвигает соседние, и под неподвижным курсором
// меняется то, что под ним лежит: браузер шлёт leave и enter, состояние
// переключается, карточки едут обратно — и так по кругу. pointermove без
// реального движения мыши не приходит, поэтому качелей не возникает
const hitIndex = (event: PointerEvent) => {
  const cards = cardsRef.value;

  if (!cards?.length) return -1;

  return cards.findIndex((card) => {
    const { top, right, bottom, left } = card.getBoundingClientRect();

    return event.clientX >= left && event.clientX <= right
      && event.clientY >= top && event.clientY <= bottom;
  });
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isDesktop.value) return;

  const idx = hitIndex(event);

  // В зазоре между карточками состояние не трогаем: иначе при медленном
  // переезде карточка успевала бы схлопнуться и тут же раскрыться обратно
  if (idx === -1) return;

  hoveredIdx.value = idx;
};

const handlePointerLeave = () => {
  hoveredIdx.value = -1;
};

const itemNumber = (idx: number) => `(${String(idx + 1).padStart(2, '0')})`;

/** На планшете и мобильном раскрыты все карточки, на десктопе — только наведённая */
const isExpanded = (idx: number) => !isDesktop.value || hoveredIdx.value === idx;

const HEIGHT_TWEEN = { duration: 0.35, ease: 'power2.out' };

// Текст подменяется целиком, поэтому высота карточки меняется скачком, а
// соседние карточки прыгают следом. Снимаем высоты до перерисовки, после неё
// снимаем новые и проигрываем переход: при переезде с карточки на карточку
// одна сжимается, вторая раскрывается, и колонка едет плавно
const animateHeights = async () => {
  const cards = cardsRef.value;

  if (!isDesktop.value || !cards?.length) return;

  // Стартуем от того, что видно сейчас: если предыдущий переход не доиграл,
  // это его промежуточная высота, и карточка не дёрнется
  const before = cards.map(card => card.offsetHeight);

  await nextTick();

  cards.forEach((card, idx) => {
    // Предыдущий переход снимаем всегда, даже если высота карточки не меняется.
    // Иначе он остаётся в работе и продолжает тянуть уже свернувшуюся карточку
    // к раскрытой высоте — именно это и выглядело как дёрганье
    gsap.killTweensOf(card);

    // Инлайновую высоту стираем, чтобы замерить ту, которую карточка займёт
    // с новым текстом. Кадр между стиранием и возвратом не отрисовывается —
    // всё происходит в одной задаче
    card.style.height = '';

    const natural = card.offsetHeight;

    if (before[idx] === natural) return;

    // Возвращаем ровно то, что видно сейчас, и дотягиваем до новой высоты.
    // Через fromTo от снятого заранее значения переход стартовал бы заново,
    // с разрывом скорости
    card.style.height = `${before[idx]}px`;

    gsap.to(card, {
      ...HEIGHT_TWEEN,
      height: natural,
      clearProps: 'height',
    });
  });
};

watch(hoveredIdx, animateHeights);

onBeforeUnmount(() => {
  const cards = cardsRef.value;

  if (cards?.length) gsap.killTweensOf(cards);
});

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
  <section
    class="architecture-cards"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <article
      v-for="(item, idx) in items"
      ref="cardsRef"
      :key="item.title"
      class="architecture-cards__card"
      :class="{ 'architecture-cards__card_expanded': isExpanded(idx) }"
    >
      <div class="architecture-cards__head">
        <!-- По макету при наведении слева от заголовка выезжает ромб.
             Обёртка нужна, чтобы анимировать ширину: у самой картинки
             при width: 0 схлопнулась бы и высота -->
        <span v-if="mark" class="architecture-cards__mark">
          <img
            class="architecture-cards__mark-image"
            :src="mark"
            alt=""
            width="236"
            height="236"
          />
        </span>
        <h3 class="architecture-cards__title" v-html="item.title" />
      </div>
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
  overflow: hidden;

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

  &_expanded {
    .architecture-cards__mark {
      width: var(--architecture-mark-size, 6.875rem); // 110px
      height: var(--architecture-mark-size, 6.875rem);
      margin-right: 16px;

      opacity: 1;
    }
  }
}

.architecture-cards__head {
  display: flex;
  align-items: center;
}

// Обёртка едет от нуля по обеим сторонам: свёрнутая она не занимает места
// ни по ширине, ни по высоте, поэтому карточка не подрастает, а заголовок
// сдвигается плавно вместе с появлением ромба

.architecture-cards__mark {
  flex-shrink: 0;

  width: 0;
  height: 0;

  overflow: hidden;

  opacity: 0;

  @include s.default-transition(width, height, opacity, margin-right);

  @include a.tablet {
    display: none;
  }
}

.architecture-cards__mark-image {
  display: block;
  width: var(--architecture-mark-size, 6.875rem); // 110px
  height: auto;
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
