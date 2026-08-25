<script setup lang="ts">
import NavButton from '@l-about/assets/icons/nav-button.svg';
import { BREAKPOINTS } from '~/shared/constants';
import TaglineImg from '@l-about/assets/icons/tagline.png';

const { isMobile } = useDevice();
const { t } = useI18n();

const testObj = computed(() => ({
  name: 'Tagline',
  title: t('aboutPage.smi.taglineTitle'),
  text: t('aboutPage.smi.taglineText'),
  link: t('aboutPage.smi.articleLink'),
  logo: TaglineImg,
}));
</script>

<template>
  <div class="smi-about">
    <div class="smi-about__wrapper">
      <div class="smi-about__header">
        <h2 class="smi-about__title" v-html="t('aboutPage.smi.title')" />
        <div v-if="!isMobile" class="smi-about__nav">
          <button class="smi-about__nav-button smi-about__nav-button_prev">
            <NavButton class="smi-about__nav-button-icon" />
          </button>
          <button class="smi-about__nav-button smi-about__nav-button_next">
            <NavButton class="smi-about__nav-button-icon" />
          </button>
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
    align-items: center;
    justify-content: space-between;
    padding: 0 60px;

    @include a.tablet {
      padding: 0 40px;
    }

    @include a.mobile {
      padding: 0 20px;
    }
  }

  &__nav {
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
