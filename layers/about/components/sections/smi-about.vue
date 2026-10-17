<script setup lang="ts">
import NavButton from '@l-about/assets/icons/nav-button.svg';
import { BREAKPOINTS } from '~/shared/constants';
import TaglineImg from '@l-about/assets/icons/tagline.png';

const { isMobile } = useDevice();
const { t, locale } = useI18n();

const testObj = computed(() => ({
  name: 'Tagline',
  title: t('aboutPage.smi.taglineTitle'),
  text: t('aboutPage.smi.taglineText'),
  link: t('aboutPage.smi.articleLink'),
  logo: TaglineImg,
}));

// Лента изданий: на русской версии — российские СМИ, на английской — зарубежные (порядок — из ТЗ)
const mediaRu = import.meta.glob<string>('../../assets/images/media/ru/*.{svg,png}', { eager: true, query: '?url', import: 'default' });
const mediaEn = import.meta.glob<string>('../../assets/images/media/en/*.{svg,png}', { eager: true, query: '?url', import: 'default' });

// h — высота логотипа в px: подобрана по пропорциям файла так, чтобы у всех была примерно одинаковая
// площадь, — иначе широкие надписи («Российская газета») перевешивают квадратные знаки (ТАСС)
type Media = { file: string; name: string; h: number };
const MEDIA_RU: Media[] = [
  { file: 'forbes', name: 'Forbes', h: 34 },
  { file: 'rbc', name: 'РБК', h: 35 },
  { file: 'kommersant', name: 'Коммерсантъ', h: 25 },
  { file: 'vedomosti', name: 'Ведомости', h: 30 },
  { file: 'tass', name: 'ТАСС', h: 44 },
  { file: 'interfax', name: 'Интерфакс', h: 38 },
  { file: 'izvestia', name: 'Известия', h: 37 },
  { file: 'rg', name: 'Российская газета', h: 22 },
  { file: 'lenta', name: 'Lenta.ru', h: 28 },
  { file: 'rambler', name: 'Рамблер', h: 33 },
  { file: 'secret-firmy', name: 'Секрет фирмы', h: 44 },
  { file: 'expert', name: 'Эксперт', h: 25 },
  { file: 'inc', name: 'Inc.', h: 40 },
  { file: 'vc', name: 'vc.ru', h: 44 },
  { file: 'sostav', name: 'Sostav', h: 35 },
  { file: 'skillbox-media', name: 'Skillbox Media', h: 23 },
  { file: 'netology-media', name: 'Медиа Нетологии', h: 33 },
  { file: 'hi-tech-mail', name: 'Hi-Tech Mail', h: 39 },
];

const MEDIA_EN: Media[] = [
  { file: 'forbes', name: 'Forbes', h: 34 },
  { file: 'bloomberg-technology', name: 'Bloomberg', h: 29 },
  { file: 'mit-technology-review', name: 'MIT Technology Review', h: 44 },
  { file: 'techcrunch', name: 'TechCrunch', h: 44 },
  { file: 'business-insider', name: 'Business Insider', h: 22 },
  { file: 'wired', name: 'Wired', h: 30 },
  { file: 'venturebeat', name: 'VentureBeat', h: 24 },
  { file: 'rest-of-world', name: 'Rest of World', h: 30 },
  { file: 'entrepreneur', name: 'Entrepreneur', h: 30 },
  { file: 'inc', name: 'Inc.', h: 40 },
  { file: 'tech-in-asia', name: 'Tech in Asia', h: 28 },
  { file: 'the-national', name: 'The National', h: 44 },
  { file: 'arab-news', name: 'Arab News', h: 26 },
  { file: 'wamda', name: 'Wamda', h: 33 },
  { file: 'techcabal', name: 'TechCabal', h: 32 },
  { file: 'itweb-africa', name: 'ITWeb Africa', h: 44 },
  { file: 'fintech-news-network', name: 'Fintech News Network', h: 44 },
];

const findUrl = (files: Record<string, string>, name: string) =>
  Object.entries(files).find(([path]) => /\/([^/]+)\.(svg|png)$/.exec(path)?.[1] === name)?.[1];

const media = computed(() => {
  const isRu = locale.value === 'ru';
  const files = isRu ? mediaRu : mediaEn;

  return (isRu ? MEDIA_RU : MEDIA_EN)
    .map(item => ({ ...item, src: findUrl(files, item.file) }))
    .filter(item => item.src);
});
</script>

<template>
  <div class="smi-about">
    <div class="smi-about__wrapper">
      <services-molecules-text-reveal class="smi-about__header">
        <div class="smi-about__head">
          <h2
            class="smi-about__title"
            data-reveal="title"
            v-html="t('aboutPage.smi.title')"
          />
          <p
            class="smi-about__lead"
            data-reveal="paragraph"
            v-html="t('aboutPage.smi.lead')"
          />
        </div>
        <div v-if="!isMobile" class="smi-about__nav">
          <button class="smi-about__nav-button smi-about__nav-button_prev">
            <NavButton class="smi-about__nav-button-icon" />
          </button>
          <button class="smi-about__nav-button smi-about__nav-button_next">
            <NavButton class="smi-about__nav-button-icon" />
          </button>
        </div>
      </services-molecules-text-reveal>

      <!-- Лента изданий: список повторён дважды, чтобы бесшовно прокручиваться по кругу -->
      <div class="smi-about__media">
        <div class="smi-about__media-track">
          <img
            v-for="(item, i) in media.concat(media)"
            :key="`${item.file}-${i}`"
            :src="item.src"
            :alt="item.name"
            :aria-hidden="i >= media.length"
            class="smi-about__media-logo"
            :style="{ '--logo-h': `${item.h / 16}rem` }"
            loading="lazy"
          />
        </div>
      </div>
      <client-only>
        <swiper-container
          ref="sliderRef"
          :space-between="12"
          :slides-offset-after="20"
          :slides-offset-before="20"
          :slides-per-view="'auto'"
          :navigation="{
            prevEl: '.smi-about__nav-button_prev',
            nextEl: '.smi-about__nav-button_next',
          }"
          :breakpoints="{
            [BREAKPOINTS.TABLET]: {
              slidesPerView: 1.8,
              slidesOffsetAfter: 40,
              slidesOffsetBefore: 40,
            },
            [BREAKPOINTS.DESKTOP]: {
              freeMode: true,
              slidesOffsetAfter: 60,
              spaceBetween: 16,
              slidesOffsetBefore: 60,
            },
          }"
          class="smi-about__slider"
        >
          <swiper-slide
            v-for="idx in 9"
            ref="slidesRef"
            :key="idx"
            class="smi-about__slide"
          >
            <about-organisms-smi-about-card v-bind="testObj" />
          </swiper-slide>
        </swiper-container>
      </client-only>
      <!-- <div v-if="isMobile" class="smi-about__nav-mobile">
        <button class="smi-about__nav-button smi-about__nav-button_prev">
          <NavButton class="smi-about__nav-button-icon" />
        </button>
        <button class="smi-about__nav-button smi-about__nav-button_next">
          <NavButton class="smi-about__nav-button-icon" />
        </button>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.smi-about {
  &__wrapper {
  }

  .swiper-button-disabled {
    opacity: 0.4;
    pointer-events: none
  }

  &__title {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__header {
    display: flex;
    gap: 40px;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 60px;

    @include a.tablet {
      padding: 0 40px;
    }

    @include a.mobile {
      padding: 0 20px;
    }
  }

  &__lead {
    max-width: 857px;
    margin-top: 20px;

    @include t.lead-m-medium;

    @include a.mobile {
      margin-top: 16px;

      @include t.body-m-medium;
    }
  }

  // Лента логотипов: как строки «Нам доверяют» — бесконечная прокрутка, пауза при наведении.
  // Логотипы в оттенках серого, цвет — при наведении на конкретное издание

  &__media {
    width: 100%;
    margin-top: 52px;
    overflow: hidden;

    @include a.mobile {
      margin-top: 32px;
    }

    @include s.hover {
      .smi-about__media-track {
        animation-play-state: paused;
      }
    }
  }

  &__media-track {
    display: flex;
    flex-wrap: nowrap;
    gap: 80px;
    align-items: center;
    width: max-content;
    padding-left: 80px;

    animation: smi-marquee 60s linear infinite;

    will-change: transform;

    @include a.mobile {
      gap: 48px;
      padding-left: 48px;

      animation-duration: 45s;
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  &__media-logo {
    flex-shrink: 0;
    width: auto;
    height: var(--logo-h, 34px);

    filter: grayscale(1);
    opacity: 0.75;

    transition: filter 0.3s, opacity 0.3s;

    @include a.mobile {
      height: calc(var(--logo-h, 34px) * 0.78);
    }

    @include s.hover {
      filter: none;
      opacity: 1;
    }
  }

  @keyframes smi-marquee {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }

  &__nav {
    flex-shrink: 0;
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__nav-mobile {
    display: flex !important;
    justify-content: space-between;
    width: 100%;
    margin-top: 24px;
    padding: 0 20px;
  }

  &__nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;

    background: rgba(#ffffff, 0.2);
    border-radius: 50%;

    path {
      transition: opacity 0.3s;
      color: #000;
    }

    &:hover {
      .smi-about__nav-button-icon {
        opacity: 0.6;
      }
    }

    &_disabled {
      pointer-events: none;

      path {
        opacity: 0.4;
      }
    }

    @include a.mobile {
      width: 44px;
      height: 44px;
    }

    &_prev {
      transform: rotate(180deg);
    }
  }

  &__nav-button-icon {
    width: 24px;
    height: 24px;
    transition: opacity 0.3s;

    color: var(--dark-blue);
  }

  &__slider {
    padding-top: 52px;

    @include a.mobile {
      padding-top: 32px;
    }
  }

  &__slide {
    width: 100% !important;
    max-width: 430px;
    height: 410px;

    @include a.mobile {
      max-width: 315px;
      height: 480px;
    }

    // box-shadow: 0 4px 14px 0 rgba(12, 29, 79, 0.15);
  }
}
</style>
