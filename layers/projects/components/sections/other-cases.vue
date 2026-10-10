<script setup lang="ts">
import type { ProjectCaseItem } from '@l-projects/types';
import { PROJECT_CASES, getProjectCase, getProjectHref } from '@l-projects/configs';
import { BREAKPOINTS } from '~/shared/constants';

const { currentSlug } = defineProps<{
  /** Слаг текущего кейса — исключается из ленты */
  currentSlug: string;
}>();

const { t } = useI18n();
const { isMobile } = useDevice();

/** Порядок ленты из макета каждого кейса (сам кейс в ленту не попадает) */
const ORDER: Record<string, string[]> = {
  kassir: ['zaslon', 'gazprom', 'k31', 'bmw', 'university'],
  zaslon: ['k31', 'gazprom', 'kassir', 'bmw', 'university'],
  bmw: ['zaslon', 'gazprom', 'k31', 'kassir', 'university'],
  k31: ['zaslon', 'gazprom', 'kassir', 'bmw', 'university'],
  gazprom: ['zaslon', 'k31', 'kassir', 'bmw', 'university'],
  university: ['zaslon', 'k31', 'gazprom', 'kassir', 'bmw'],
};

const items = computed(() =>
  (ORDER[currentSlug] ?? PROJECT_CASES.map(item => item.slug))
    .filter(slug => slug !== currentSlug)
    .map(slug => getProjectCase(slug))
    .filter((item): item is ProjectCaseItem => Boolean(item)));

// Лента вылезает за край экрана, выравнивание по контейнеру держат
// смещения слайдов — как в tech-slider услуг. Swiper считает их в px,
// а вёрстка тянется от html font-size: с постоянными 60/40/20px лента
// на ширинах между макетными съезжала с колонки заголовка (на 1920 — на 20px,
// на 1024 — на 17px). Смещение берём у паддинга контейнера заголовка, зазор —
// в процентах колонки контейнера (так swiper считает проценты)
const headRef = useTemplateRef<HTMLElement>('headRef');

const containerOffset = () =>
  (headRef.value ? Number.parseFloat(getComputedStyle(headRef.value).paddingLeft) : 0);

/** Зазор макета в процентах колонки контейнера макета (335, 688 или 1320) */
const gap = (px: number, columnWidth: number) => `${(px / columnWidth) * 100}%`;

const slideParams = (spaceBetween: string) => ({
  spaceBetween,
  slidesOffsetBefore: containerOffset,
  slidesOffsetAfter: containerOffset,
});

const NAV_DIRECTIONS = ['prev', 'next'] as const;

const navigation = {
  prevEl: '.other-cases__nav-button_prev',
  nextEl: '.other-cases__nav-button_next',
};

// Брейкпоинт swiper не наследует соседние, поэтому полный набор
// в каждом, мобильный — тоже брейкпоинтом, от нуля
const breakpoints = {
  [BREAKPOINTS.MOBILE]: slideParams(gap(8, 335)),
  [BREAKPOINTS.TABLET]: slideParams(gap(16, 688)),
  [BREAKPOINTS.DESKTOP]: slideParams(gap(16, 1320)),
};

// Жалюзи карточки: ряд 1556x800 повёрнут вокруг своего центра, а в макете
// у каждой карточки одинаковая рамка повёрнутого ряда (-324, -409, 1710x1175).
// Центр ряда — на 205px правее центра карточки и на 179px ниже её верха
const BLINDS_TOP = -221;
const blindsLeft = computed(() => (isMobile.value ? 335 : 652) / 2 + 205 - 1556 / 2);
</script>

<template>
  <!-- Лента остальных кейсов: карточки с жалюзи в цвете кейса -->
  <section class="other-cases">
    <div ref="headRef" class="other-cases__head">
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
        :navigation="navigation"
        :breakpoints="breakpoints"
      >
        <swiper-slide
          v-for="item in items"
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
              :left="blindsLeft"
              :top="BLINDS_TOP"
            />
            <span class="other-cases__glow" aria-hidden="true" />
            <span class="other-cases__row">
              <projects-molecules-case-tag class="other-cases__tag">
                {{ t(`projects.tabs.${item.tab}`) }}
              </projects-molecules-case-tag>
              <span class="other-cases__logo">
                <img
                  class="other-cases__logo-img"
                  :src="item.logo"
                  :alt="t(`projects.${item.i18nKey}.title`)"
                  :style="{
                    '--logo-width': `${item.logoSizeSmall[0] / 16}rem`,
                    '--logo-height': `${item.logoSizeSmall[1] / 16}rem`,
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

.other-cases {
  position: relative;

  // На мобильном стрелки по макету под лентой: 20px отступ + кнопка 44px

  @include a.mobile {
    padding-bottom: 64px;
  }
}

.other-cases__head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include s.base-container;
}

.other-cases__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.tablet {
    @include t.h2;
  }

  @include a.mobile {
    @include t.h3;
  }
}

.other-cases__nav {
  display: flex;
  gap: 18px;

  @include a.mobile {
    position: absolute;
    bottom: 0;
    left: 50%;

    gap: 20px;

    transform: translateX(-50%);
  }
}

.other-cases__nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;

  color: var(--dark-blue);

  background-color: rgb(140 171 253 / 20%);
  border-radius: 50%;

  @include s.default-transition(background-color, color);

  @include s.hover {
    background-color: rgb(140 171 253 / 30%);
  }

  @include a.mobile {
    width: 44px;
    height: 44px;
  }

  &_prev {
    transform: scaleX(-1);
  }

  // Край ленты: swiper ставит disabled и класс, в макете стрелка бледнее

  &:disabled,
  &.swiper-button-disabled {
    color: var(--dark-blue-40);

    background-color: rgb(140 171 253 / 15%);

    pointer-events: none;
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
    margin-top: 40px;
  }
}

.other-cases__slide {
  width: 652px;

  @include a.mobile {
    width: 335px;
  }
}

// Тег и логотип прижаты к верху карточки, название с описанием — к низу

.other-cases__card {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  align-items: flex-start;
  justify-content: space-between;
}

// На мобильном в макете в карточке только логотип, без тега

.other-cases__tag {
  @include a.mobile {
    display: none;
  }
}

.other-cases__logo {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;

  background-color: var(--white);
  border-radius: 16px;
  box-shadow: 0 5px 24px rgb(12 29 79 / 8%);

  @include a.mobile {
    width: 100px;
    height: 100px;
  }
}

.other-cases__logo-img {
  width: var(--logo-width);
  height: var(--logo-height);
  object-fit: contain;

  // Плашка на мобильном 100 вместо 120 — логотип уменьшается с ней

  @include a.mobile {
    width: calc(var(--logo-width) * 5 / 6);
    height: calc(var(--logo-height) * 5 / 6);
  }
}

.other-cases__info {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.other-cases__name {
  color: var(--dark-blue);

  @include t.h2;

  @include a.mobile {
    @include t.h4;
  }
}

.other-cases__text {
  color: var(--dark-blue);

  @include t.body-s-medium;
}
</style>
