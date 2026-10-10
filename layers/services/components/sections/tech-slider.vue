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
const headRef = useTemplateRef<HTMLElement>('headRef');

// Swiper считает смещения и зазоры в px, а вёрстка тянется от html font-size:
// с постоянными 60/40/20px лента на ширинах между макетными съезжала
// с колонки заголовка (на 1920 — на 20px, на 1024 — на 17px). Смещение
// берём у паддинга контейнера заголовка — функцию swiper зовёт на каждом
// пересчёте, в том числе на ресайзе. Зазор — в процентах: swiper берёт их
// от ширины ленты за вычетом смещений, то есть от колонки контейнера,
// а она растёт вместе с rem
const containerOffset = () =>
  (headRef.value ? Number.parseFloat(getComputedStyle(headRef.value).paddingLeft) : 0);

/** Зазор макета в процентах колонки контейнера макета (335, 688 или 1320) */
const gap = (px: number, columnWidth: number) => `${(px / columnWidth) * 100}%`;

const slideParams = (spaceBetween: string) => ({
  spaceBetween,
  slidesOffsetBefore: containerOffset,
  slidesOffsetAfter: containerOffset,
});

// Кнопки перелистывания свои, swiper находит их по классу
const NAV_DIRECTIONS = ['prev', 'next'] as const;

const navigation = {
  prevEl: '.tech-slider__nav-button_prev',
  nextEl: '.tech-slider__nav-button_next',
};

// Swiper не наследует параметры соседних брейкпоинтов: он берёт только
// подошедший и накладывает его на исходные параметры. Поэтому полный набор
// повторён в каждом, и мобильные значения тоже заданы брейкпоинтом — от нуля
const breakpoints = {
  [BREAKPOINTS.MOBILE]: slideParams(gap(8, 335)),
  [BREAKPOINTS.TABLET]: slideParams(gap(16, 688)),
  [BREAKPOINTS.DESKTOP]: slideParams(gap(16, 1320)),
};
</script>

<template>
  <section class="tech-slider">
    <div ref="headRef" class="tech-slider__head">
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

// На десктопе в макете лента лежит на белой полосе во всю ширину экрана:
// сверху она начинается вровень с заголовком, снизу под подписями слайдов
// остаётся поле. На планшете и мобильном полосы нет — блок лежит на фоне
// страницы, и отступ до следующей секции задаёт сама страница

.tech-slider {
  @include a.desktop-only {
    padding-bottom: var(--tech-slider-padding-bottom, 6.8125rem); // 109px

    background: var(--tech-slider-bg, var(--white));
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

  // Ряд по макету держит высоту раскрытой карточки (405px), чтобы блок
  // под лентой не прыгал, пока картинка растёт. Растёт она только
  // от наведения, то есть на десктопе

  @include a.desktop-only {
    min-height: var(--tech-slider-row-height, 25.3125rem); // 405px
  }

  @include a.mobile {
    margin-top: 32px;
  }
}

// Ширина слайда по макету, на мобильном равна ширине контейнера

.tech-slider__slide {
  width: 418px;

  @include a.mobile {
    width: 335px;
  }

  // По макету («Саrds», варианты hover) при наведении растёт картинка
  // карточки: 290 → 324px, подписи сдвигаются следом. По комментарию
  // в макете карточка, уходящая при пролистывании, наоборот, уменьшается —
  // класс на предыдущем слайде ставит swiper. Только на десктопе: на тач-
  // экранах карточки листаются пальцем, наведения нет

  @include a.desktop-only {
    @include s.hover {
      .tech-slider__image {
        height: var(--tech-slider-image-height-hover, 20.25rem); // 324px
      }
    }

    &.swiper-slide-prev .tech-slider__image {
      height: var(--tech-slider-image-height-prev, 16rem); // 256px
    }
  }
}

.tech-slider__image {
  display: block;
  width: 100%;

  // Высота картинки фиксирована по макету и меняется при наведении;
  // сама иллюстрация подстраивается под рамку

  height: var(--tech-slider-image-height, 18.125rem); // 290px
  object-fit: cover;

  border-radius: 16px;

  @include s.default-transition(height);

  @include a.mobile {
    height: var(--tech-slider-image-height-mobile, 15.75rem); // 252px
  }
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
