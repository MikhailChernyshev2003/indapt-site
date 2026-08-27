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

const itemNumber = (idx: number) => `(${String(idx + 1).padStart(2, '0')})`;

/** На планшете и мобильном раскрыты все карточки, на десктопе — только наведённая */
const isExpanded = (idx: number) => !isDesktop.value || hoveredIdx.value === idx;

const cardsRef = useTemplateRef<HTMLElement[]>('cardsRef');

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
    // Инлайновую высоту от прерванного перехода снимаем, иначе замер вернёт
    // её же, а не ту, которую карточка займёт с новым текстом
    card.style.height = '';

    const after = card.offsetHeight;

    if (before[idx] === after) return;

    gsap.fromTo(
      card,
      { height: before[idx] },
      { ...HEIGHT_TWEEN, height: after, overwrite: true, clearProps: 'height' },
    );
  });
};

watch(hoveredIdx, animateHeights);

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
      ref="cardsRef"
      :key="item.title"
      class="architecture-cards__card"
      :class="{ 'architecture-cards__card_expanded': isExpanded(idx) }"
      @mouseenter="hoveredIdx = idx"
      @mouseleave="hoveredIdx = -1"
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
