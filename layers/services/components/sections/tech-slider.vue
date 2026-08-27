<script setup lang="ts">
import type { TechSlideItem } from '@l-services/types';
import { BREAKPOINTS } from '~/shared/constants';

const { title, desc, slides } = defineProps<{
  /** Готовая разметка заголовка */
  title: string;
  /** Готовая разметка подводки */
  desc: string;
  /** Слайды в порядке вывода */
  slides: TechSlideItem[];
}>();

// Лента выходит за правый край экрана, поэтому у неё нет паддингов
// контейнера: их заменяют отступы слайдов, они же держат левый край
// ленты на одной линии с заголовком.
// По комментарию в макете карточки листаются без упора в конец. Полный loop
// здесь не подходит: swiper не совмещает его с slidesOffsetBefore/After —
// лента теряет выравнивание по контейнеру и стартует не с первого слайда.
// rewind даёт тот же бесшовный проход по кругу, сохраняя смещения
const OFFSETS = {
  mobile: 20,
  tablet: 40,
  desktop: 60,
};

// Кнопки перелистывания свои, swiper находит их по классу
const NAV_DIRECTIONS = ['prev', 'next'] as const;

const navigation = {
  prevEl: '.tech-slider__nav-button_prev',
  nextEl: '.tech-slider__nav-button_next',
};

// Swiper не наследует параметры соседних брейкпоинтов: он берёт только
// подошедший и накладывает его на исходные параметры. Всё, что не повторено
// в брейкпоинте, откатывается к значению с самого компонента, поэтому
// spaceBetween продублирован и в десктопном
const breakpoints = {
  [BREAKPOINTS.TABLET]: {
    spaceBetween: 16,
    slidesOffsetBefore: OFFSETS.tablet,
    slidesOffsetAfter: OFFSETS.tablet,
  },
  [BREAKPOINTS.DESKTOP]: {
    spaceBetween: 16,
    slidesOffsetBefore: OFFSETS.desktop,
    slidesOffsetAfter: OFFSETS.desktop,
  },
};
</script>

<template>
  <section class="tech-slider">
    <div class="tech-slider__head">
      <services-molecules-section-head
        :title="title"
        :desc="desc"
        size="h2"
        :desc-max-width="540"
      />
      <div class="tech-slider__nav">
        <button
          v-for="direction in NAV_DIRECTIONS"
          :key="direction"
          class="tech-slider__nav-button"
          :class="`tech-slider__nav-button_${direction}`"
          type="button"
        >
          <svg
            class="tech-slider__nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12H20M13 5L20 12L13 19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
    <client-only>
      <swiper-container
        class="tech-slider__slider"
        :slides-per-view="'auto'"
        :rewind="true"
        :space-between="8"
        :slides-offset-before="OFFSETS.mobile"
        :slides-offset-after="OFFSETS.mobile"
        :navigation="navigation"
        :breakpoints="breakpoints"
      >
        <swiper-slide
          v-for="slide in slides"
          :key="slide.label"
          class="tech-slider__slide"
        >
          <!-- width/height держат место до загрузки: высота картинок
               не фиксирована, и без них лента дёргалась бы -->
          <img
            v-if="slide.image"
            class="tech-slider__image"
            :src="slide.image"
            :width="slide.imageWidth"
            :height="slide.imageHeight"
            alt=""
            loading="lazy"
          />
          <h3 class="tech-slider__label" v-html="slide.label" />
          <p class="tech-slider__text" v-html="slide.text" />
        </swiper-slide>
      </swiper-container>
    </client-only>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

// В макете лента лежит на белой полосе во всю ширину экрана: сверху она
// начинается вровень с заголовком, снизу под подписями слайдов остаётся поле

.tech-slider {
  padding-bottom: var(--tech-slider-padding-bottom, 6.8125rem); // 109px

  background: var(--tech-slider-bg, var(--white));

  @include a.mobile {
    padding-bottom: var(--tech-slider-padding-bottom-mobile, 3.5rem); // 56px
  }
}

.tech-slider__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @include s.base-container;
}

.tech-slider__nav {
  display: flex;
  flex-shrink: 0;
  gap: 8px;

  @include a.mobile {
    display: none;
  }
}

.tech-slider__nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;

  color: var(--dark-blue);

  border: 1px solid var(--dark-blue-20);
  border-radius: 50%;

  @include s.default-transition(border-color);

  @include s.hover {
    border-color: var(--dark-blue);
  }

  &_prev {
    transform: rotate(180deg);
  }

  // Класс на крайних слайдах вешает swiper

  &.swiper-button-disabled {
    color: var(--dark-blue-20);

    pointer-events: none;
  }
}

.tech-slider__nav-icon {
  width: 24px;
  height: 24px;
}

.tech-slider__slider {
  margin-top: 52px;

  @include a.mobile {
    margin-top: 32px;
  }
}

// Ширина слайда по макету, на мобильном равна ширине контейнера

.tech-slider__slide {
  width: 418px;

  // По комментарию в макете карточка растёт под курсором, а уходящая
  // из ленты — уменьшается. Точку масштабирования уводим к правому краю,
  // чтобы уходящий слайд «втягивался» в сторону ленты, а не от неё

  @include s.default-transition(transform);

  @include a.mobile {
    width: 335px;
  }

  @include s.hover {
    transform: scale(1.03);
  }

  // Класс на предыдущем слайде ставит swiper

  &.swiper-slide-prev {
    transform: scale(0.94);
    transform-origin: right center;
  }
}

.tech-slider__image {
  display: block;

  // Высота не фиксирована: по макету иллюстрации слайдов разной высоты,
  // и подписи под ними стоят на разном уровне

  width: 100%;
  height: auto;

  border-radius: 12px;
}

.tech-slider__label {
  color: var(--dark-blue);

  @include t.body-l-medium;
}

// Картинки может не быть — тогда подпись не отбивается сверху

.tech-slider__image + .tech-slider__label {
  margin-top: 16px;
}

.tech-slider__text {
  margin-top: 16px;

  color: var(--dark-blue-60);

  @include t.body-m-medium;
}
</style>
