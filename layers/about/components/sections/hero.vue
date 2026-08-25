<script setup lang="ts">
import KvDesktop from '@l-about/assets/images/hero-kv.jpg';
import KvTablet from '@l-about/assets/images/hero-kv-tablet.jpg';
import KvMobile from '@l-about/assets/images/hero-kv-mobile.jpg';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { disableScroll, enableScroll } from '@/utils';

const { isDesktop, isTablet } = useDevice();

const { t, tm, rt } = useI18n();

const titleRef = ref<HTMLElement | null>(null);
const isDescriptionOpen = shallowRef(false);

const toggleCollapse = (isOpen: boolean) => {
  isDescriptionOpen.value = isOpen;

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);
};

useGsap(() => {
  gsap.to(window, {
    scrollTrigger: {
      trigger: '.about-hero',
      start: 'bottom+=20% bottom',
      end: '+=10px',
      invalidateOnRefresh: true,
      onEnter: () => {
        disableScroll('.about-hero');
        const el = document.querySelector('.about-hero');
        if (!el) return;
        if (isDesktop.value) {
          gsap.to(window, {
            duration: 0.5,
            scrollTo: el.clientHeight,
          }).then(() => {
            setTimeout(() => {
              enableScroll();
            }, 500);
          });
        }
        else {
          const el = document.querySelector('.about-hero');
          if (!el) return;
          gsap.to(window, {
            duration: 1,
            scrollTo: el.clientHeight + 700,
          }).then(() => {
            setTimeout(() => {
              enableScroll();
            }, 500);
          });
        }
      },
    },
  });
});
</script>

<template>
  <section class="about-hero">
    <div class="about-hero__wrapper">
      <div class="about-hero__kv">
        <img
          :src="isDesktop ? KvDesktop : isTablet ? KvTablet : KvMobile"
          alt="kv"
        />
      </div>
      <div class="about-hero__content">
        <h1
          ref="titleRef"
          class="about-hero__title"
          v-html="t('aboutPage.hero.title')"
        />
        <div class="about-hero__decor" />
        <expertise-molecules-collapse-text
          class="about-hero__collapse"
          :open="isDescriptionOpen"
          @update:open="toggleCollapse"
        >
          <template #label>
            <p class="about-hero__subtitle" v-html="t('aboutPage.hero.text')" />
          </template>
          <template #text>
            <p
              v-for="(text, index) in tm('aboutPage.hero.texts')"
              :key="index"
              class="about-hero__text"
              v-html="rt(text)"
            />
          </template>
        </expertise-molecules-collapse-text>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;
@use "@styles/typography" as t;

.about-hero {
  min-height: 100vh;
  &__wrapper {}

  &__kv {
    width: 100%;
    height: 440px;

    @include a.tablet {
      height: 440px;
    }

    @include a.mobile {
      height: 320px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__content {
    padding: 52px 60px 0;

    @include a.tablet {
      padding: 32px 40px;
    }

    @include a.mobile {
      padding: 32px 20px;
    }
  }

  &__collapse {
    max-width: 875px;
    margin-top: 32px;
    padding-bottom: 0;

    border-top: 1px solid;
    border-image: linear-gradient(90deg, #053478 0%, #8CABFD 52.6%) 1;

    :deep(.collapse-text__head) {
      padding-bottom: 0;
    }

    :deep(.collapse-text__button) {
      margin-top: 16px;

      @include a.mobile {
        margin-top: 25px;
      }
    }
  }

  &__title {
    max-width: 940px;

    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__subtitle {
    max-width: 901px;
    margin-top: 16px;
    margin-bottom: 20px;

    @include t.lead-m-medium;

    @include a.tablet {
      max-width: 628px;
      margin-top: 20px;
      margin-bottom: 24px;
    }

    @include a.mobile {
      margin-top: 24px;
      margin-bottom: 24px;

      @include t.h6;
    }
  }

  &__text {
    max-width: 901px;
    margin-bottom: 12px;

    @include t.body-s-regular;

    @include a.tablet {
      max-width: 628px;
      margin-bottom: 8px;
    }
  }

  :deep(.collapse-text__body-inner) {
    max-width: 815px;
  }

  &__decor {
    background: linear-gradient(90deg, #053478 0%, #8CABFD 52.6%);
    height: 1px;
    max-width: 950px;
    width: 100%;
    margin-top: 32px;
  }
}
</style>
