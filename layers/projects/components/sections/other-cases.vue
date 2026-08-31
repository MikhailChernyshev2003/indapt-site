<script setup lang="ts">
import { PROJECT_CASES, getProjectHref } from '@l-projects/configs';
import { BREAKPOINTS } from '~/shared/constants';

const { currentSlug } = defineProps<{
  /** Слаг текущего кейса — исключается из ленты */
  currentSlug: string;
}>();

const { t } = useI18n();

const items = computed(() =>
  PROJECT_CASES.filter(item => item.slug !== currentSlug));

// Лента вылезает за край экрана, выравнивание по контейнеру держат
// смещения слайдов — как в tech-slider услуг
const OFFSETS = {
  mobile: 20,
  tablet: 40,
  desktop: 60,
};

const NAV_DIRECTIONS = ['prev', 'next'] as const;

const navigation = {
  prevEl: '.other-cases__nav-button_prev',
  nextEl: '.other-cases__nav-button_next',
};

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

/** Жалюзи сшиты в одно поле: каждая карточка сдвигает ряд на свой шаг */
const blindsLeft = (idx: number) => -324 - idx * 668;
</script>

<template>
  <!-- Лента остальных кейсов: карточки с жалюзи в цвете кейса -->
  <section class="other-cases">
    <div class="other-cases__head">
      <h2 class="other-cases__title" v-html="t('projects.general.other')" />
      <div class="other-cases__nav">
        <button
          v-for="direction in NAV_DIRECTIONS"
          :key="direction"
          class="other-cases__nav-button"
          :class="`other-cases__nav-button_${direction}`"
          type="button"
        >
          <svg
            class="other-cases__nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L16 12L9 19"
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
        class="other-cases__slider"
        :slides-per-view="'auto'"
        :rewind="true"
        :space-between="8"
        :slides-offset-before="OFFSETS.mobile"
        :slides-offset-after="OFFSETS.mobile"
        :navigation="navigation"
        :breakpoints="breakpoints"
      >
        <swiper-slide
          v-for="(item, idx) in items"
          :key="item.slug"
          class="other-cases__slide"
        >
          <nuxt-link
            class="other-cases__card"
            :to="getProjectHref(item.slug)"
            :style="{ backgroundColor: item.cardBg }"
          >
            <projects-molecules-blinds
              :color="item.accent"
              :strip-width="65"
              :row-width="1556"
              :row-height="800"
              :left="blindsLeft(idx)"
              :top="-409"
            />
            <span class="other-cases__glow" aria-hidden="true" />
            <span class="other-cases__row">
              <projects-molecules-case-tag>
                {{ t(`projects.tabs.${item.tab}`) }}
              </projects-molecules-case-tag>
              <span
                class="other-cases__logo"
                :style="{
                  borderColor: item.logoStroke[1],
                  background: `linear-gradient(var(--white), var(--white)) padding-box,
                    linear-gradient(135deg, ${item.logoStroke[0]}, ${item.logoStroke[1]}) border-box`,
                }"
              >
                <img
                  class="other-cases__logo-img"
                  :src="item.logo"
                  :alt="t(`projects.${item.i18nKey}.title`)"
                  :style="{
                    width: `${item.logoSizeSmall[0] / 16}rem`,
                    height: `${item.logoSizeSmall[1] / 16}rem`,
                  }"
                  loading="lazy"
                />
              </span>
            </span>
            <span class="other-cases__info">
              <span class="other-cases__name" v-html="t(`projects.${item.i18nKey}.title`)" />
              <span class="other-cases__text" v-html="t(`projects.${item.i18nKey}.text`)" />
            </span>
          </nuxt-link>
        </swiper-slide>
      </swiper-container>
    </client-only>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.other-cases__head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include s.base-container;
}

.other-cases__title {
  color: var(--dark-blue);

  @include t.h2;

  @include a.mobile {
    @include t.h5;
  }
}

.other-cases__nav {
  display: flex;
  gap: 18px;

  @include a.mobile {
    display: none;
  }
}

.other-cases__nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;

  color: var(--dark-blue);

  background-color: rgb(140 171 253 / 15%);
  border-radius: 50%;

  @include s.default-transition(background-color);

  @include s.hover {
    background-color: rgb(140 171 253 / 30%);
  }

  &_prev {
    transform: scaleX(-1);
  }
}

.other-cases__nav-icon {
  width: 24px;
  height: 24px;
}

.other-cases__slider {
  display: block;
  margin-top: 60px;

  @include a.mobile {
    margin-top: 32px;
  }
}

.other-cases__slide {
  width: 652px;

  @include a.mobile {
    width: 300px;
  }
}

.other-cases__card {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 458px;
  padding: 32px;
  overflow: hidden;

  border-radius: 16px;

  @include a.mobile {
    padding: 24px;
  }
}

// Белое свечение из макета: две мягкие области у нижнего края

.other-cases__glow {
  position: absolute;
  right: -10%;
  bottom: -55%;
  left: -20%;

  height: 100%;

  background:
    radial-gradient(50% 50% at 65% 45%, rgb(255 255 255 / 75%) 0%, rgb(255 255 255 / 0%) 100%),
    radial-gradient(55% 45% at 25% 65%, rgb(255 255 255 / 90%) 0%, rgb(255 255 255 / 0%) 100%);

  pointer-events: none;
}

.other-cases__row {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.other-cases__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;

  border: 1px solid transparent;
  border-radius: 16px;
  box-shadow: 0 5px 24px rgb(12 29 79 / 8%);

  @include a.mobile {
    width: 100px;
    height: 100px;
  }
}

.other-cases__logo-img {
  object-fit: contain;
}

.other-cases__info {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.other-cases__name {
  color: var(--dark-blue);

  @include t.h5;

  @include a.mobile {
    font-size: 30px;
  }
}

.other-cases__text {
  color: var(--dark-blue);

  @include t.body-s-medium;
}
</style>
