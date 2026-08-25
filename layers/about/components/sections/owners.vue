<script setup lang="ts">
import DruzinImg from '@l-about/assets/images/druzin.png';
import BitkinImg from '@l-about/assets/images/bitkin.png';
import DruzinTImg from '@l-about/assets/images/druzin-t.png';
import BitkinTImg from '@l-about/assets/images/bitkin-t.png';
import QuoteIcon from '@l-about/assets/icons/quote.svg';
import { disableScroll, enableScroll } from '@/utils';

const { isDesktop, isTablet, isMobile } = useDevice();

const { t } = useI18n();

useSeoMeta({
  title: t('aboutPage.seoTitle'),
});

let tl;

const animationDesktop = async () => {
  gsap.set('.owners__druzin-holder', {
    x: '-70vw',
  });
  gsap.set('.owners__bitkin-holder', {
    x: '70vw',
  });
  gsap.set('.owners__quote_druzin', {
    x: '-70vw',
  });
  gsap.set('.owners__quote_bitkin', {
    x: '70vw',
  });

  const ownersSection = document.querySelector('.about-page .owner');

  await nextTick();

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.owners',
      start: 'top top',
      end: '+=1100px',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onEnter: () => {
        const scrollY = window.scrollY;
        const ownersRect = ownersSection?.getBoundingClientRect();
        const targetScroll = scrollY + (ownersRect?.top || 0) + 750;

        disableScroll('.owners');

        gsap
          .to(window, {
            duration: 1,
            scrollTo: targetScroll,
            ease: 'linear',
          })
          .then(() => {
            enableScroll();
          });
      },
    },
  });

  tl.to('.owners__druzin-holder', {
    x: '-40%',
    duration: 1,
  });
  tl.to(
    '.owners__bitkin-holder',
    {
      x: '41%',
      duration: 1,
    },
    '<',
  );
  tl.to(
    '.owners__kv',
    {
      opacity: 1,
      duration: 0.4,
    },
    '<',
  );
  tl.to(
    '.owners__quote_druzin',
    {
      x: '-136%',
      duration: 1,
      delay: 0.2,
    },
    '<',
  );
  tl.to(
    '.owners__quote_bitkin',
    {
      x: '133%',
      duration: 1,
    },
    '<',
  );
  tl.to('.owners', {
    delay: 1,
    duration: 1.5,
    onReverseComplete: () => {
      disableScroll('.owners');
      gsap.to(window, { scrollTo: 0, duration: 1 }).then(() => {
        enableScroll();
      });
    },
  });
  tl.to('.owners', {
    transformOrigin: 'center bottom',
    scale: 0.9,
    duration: 0.3,
    opacity: 0,
  });
  tl.to(
    '.owners__kv',
    {
      opacity: 0,
      duration: 0.05,
    },
    '<',
  );
  tl.to(
    '.about-page__bio',
    {
      marginTop: '-70vh',
      duration: 1,
    },
    '-=0.3',
  );
};

const animationTablet = async () => {
  gsap.set('.owners__druzin-holder', {
    x: '-95vw',
  });
  gsap.set('.owners__bitkin-holder', {
    x: '95vw',
  });
  gsap.set('.owners__quote_druzin', {
    x: '-80vw',
  });
  gsap.set('.owners__quote_bitkin', {
    x: '80vw',
  });

  const _ownersSection = document.querySelector('.about-page .owner');
  await nextTick();
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.owners',
      start: 'top top',
      end: '+=1000px',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      // onEnter: () => {
      //   const scrollY = window.scrollY;
      //   const ownersRect = ownersSection?.getBoundingClientRect();
      //   const targetScroll = scrollY + (ownersRect?.top || 0) + 620;

      //   disableScroll();

      //   gsap.to(window, {
      //     duration: 1,
      //     scrollTo: targetScroll,
      //     ease: 'linear',
      //   }).then(() => {
      //     enableScroll();
      //   });
      // },
    },
  });

  tl.to('.owners__druzin-holder', {
    x: '-34%',
    duration: 1,
  });
  tl.to(
    '.owners__bitkin-holder',
    {
      x: '39%',
      duration: 1,
    },
    '<',
  );
  tl.to(
    '.owners__kv',
    {
      opacity: 1,
      duration: 0.4,
    },
    '<',
  );
  tl.to(
    '.owners__quote_druzin',
    {
      x: '-48%',
      duration: 1,
      delay: 0.2,
    },
    '<',
  );
  tl.to(
    '.owners__quote_bitkin',
    {
      x: '75%',
      duration: 1,
    },
    '<',
  );
  tl.to('.owners', {
    delay: 1,
    duration: 1.5,
    onReverseComplete: () => {
      disableScroll('.owners');
      gsap.to(window, { scrollTo: 0, duration: 1 }).then(() => {
        enableScroll();
      });
    },
  });
  tl.to('.owners', {
    duration: 0.3,
    opacity: 0,
  });
  tl.to(
    '.owners__kv',
    {
      opacity: 0,
      duration: 0.05,
    },
    '<',
  );
  tl.to(
    '.about-page__bio',
    {
      marginTop: '-70vh',
      duration: 1,
    },
    '-=0.3',
  );
};

const animationMobile = async () => {
  gsap.set('.owners__druzin-holder', {
    x: '-100vw',
  });
  gsap.set('.owners__bitkin-holder', {
    x: '100vw',
  });
  gsap.set('.owners__slider', {
    y: 50,
    opacity: 0,
  });

  const _ownersSection = document.querySelector('.about-page .owner');
  await nextTick();
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.owners',
      start: 'top top',
      end: '+=1100px',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      // onEnter: () => {
      //   const scrollY = window.scrollY;
      //   const ownersRect = ownersSection?.getBoundingClientRect();
      //   const targetScroll = scrollY + (ownersRect?.top || 0) + 675;

      //   disableScroll();

      //   gsap.to(window, {
      //     duration: 0.5,
      //     scrollTo: targetScroll,
      //     ease: 'linear',
      //   }).then(() => {
      //     enableScroll();
      //   });
      // },
    },
  });

  tl.to('.owners__druzin-holder', {
    x: '-37%',
    duration: 1,
  });
  tl.to(
    '.owners__bitkin-holder',
    {
      x: '43%',
      duration: 1,
    },
    '<',
  );
  tl.to(
    '.owners__kv',
    {
      opacity: 1,
      duration: 0.4,
    },
    '<',
  );
  tl.to('.owners__slider', {
    y: 0,
    duration: 1,
    opacity: 1,
  });
  tl.to('.owners', {
    delay: 1,
    duration: 1.5,
    // onReverseComplete: () => {
    //   disableScroll();
    //   gsap.to(window, { scrollTo: 0, duration: 1 }).then(() => {
    //     setTimeout(() => {
    //       enableScroll();
    //     }, 1000);
    //   });
    // },
  });
  tl.to('.owners', {
    duration: 0.3,
    opacity: 0,
  });
  tl.to(
    '.owners__kv',
    {
      opacity: 0,
      duration: 0.05,
    },
    '<',
  );
  tl.to(
    '.about-page__bio',
    {
      marginTop: '-50vh',
      duration: 1,
    },
    '-=0.3',
  );
};

onMounted(async () => {
  await nextTick();
  window.scrollTo(0, 0);
});

useGsap({
  desktop: animationDesktop,
  tablet: animationTablet,
  mobile: animationMobile,
});

onBeforeRouteLeave(() => {
  tl!.kill();
  enableScroll();
});
</script>

<template>
  <section class="owners">
    <div class="owners__wrapper">
      <client-only>
        <img
          class="owners__kv"
          src="@l-about/assets/images/owners-kv.png"
          alt="kv"
          loading="eager"
        />
        <div class="owners__druzin-holder">
          <img
            class="owners__druzin"
            :src="isDesktop ? DruzinImg : isTablet ? DruzinTImg : DruzinImg"
            alt="Друзин"
            loading="eager"
          />
        </div>
        <div class="owners__bitkin-holder">
          <img
            class="owners__bitkin"
            :src="isDesktop ? BitkinImg : isTablet ? BitkinTImg : BitkinImg"
            alt="Биткин"
            loading="eager"
          />
        </div>
      </client-only>
      <div v-if="isMobile" class="owners__gradient" />

      <template v-if="!isMobile">
        <div class="owners__quote owners__quote_druzin owners__quote_zindex-up">
          <QuoteIcon class="owners__quote-icon" />
          <p class="owners__quote-text" v-html="t('aboutPage.owners.druzin.title')" />
          <p class="owners__quote-name">{{ t('aboutPage.owners.druzin.text') }}</p>
        </div>

        <div class="owners__quote owners__quote_bitkin owners__quote_zindex-up">
          <QuoteIcon class="owners__quote-icon" />
          <p class="owners__quote-text" v-html="t('aboutPage.owners.bitkin.title')" />
          <p class="owners__quote-name">{{ t('aboutPage.owners.bitkin.text') }}</p>
        </div>
      </template>
      <template v-else>
        <div class="owners__slider">
          <div class="owners__quote">
            <QuoteIcon class="owners__quote-icon" />
            <p class="owners__quote-text" v-html="t('aboutPage.owners.mobile.druzin.title')" />
            <p class="owners__quote-name">{{ t('aboutPage.owners.mobile.druzin.text') }}</p>
          </div>
          <div class="owners__quote owners__quote_bitkin">
            <QuoteIcon class="owners__quote-icon" />
            <p class="owners__quote-text" v-html="t('aboutPage.owners.mobile.bitkin.title')" />
            <p class="owners__quote-name">{{ t('aboutPage.owners.mobile.bitkin.text') }}</p>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;
@use "@styles/typography" as t;
@use "@styles/shared" as s;

.owners {
  width: 100%;
  min-height: 101svh;
  overflow: hidden;

  &__wrapper {
    position: relative;
    z-index: 1;

    display: flex;
    justify-content: center;
    min-height: 101svh;
  }

  &__druzin {
    &-holder {
      position: absolute;
      bottom: -2px;
      z-index: 5;
      height: max-content;

      @include a.tablet {
        z-index: 3;
      }

      @include a.mobile {
        bottom: 140px;
      }
    }

    height: 90.5vh;
    max-height: 724px;
    aspect-ratio: 0.5922 / 1;

    @include a.tablet {
      max-height: 830px;
      aspect-ratio: 0.55 / 1;
    }

    @include a.mobile {
      max-height: 440px;
      aspect-ratio: 0.59 / 1;
    }
  }

  &__bitkin {
    &-holder {
      position: absolute;
      bottom: -2px;
      z-index: 4;
      height: max-content;

      @include a.mobile {
        bottom: 177px;
      }
    }

    height: 83.6vh;
    max-height: 669px;
    aspect-ratio: 0.709 / 1;

    @include a.tablet {
      max-height: 809px;
      aspect-ratio: 0.5747 / 1;
    }

    @include a.mobile {
      max-height: 400px;
      aspect-ratio: 0.709 / 1;
    }
  }

  &__kv {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    height: 500px;

    opacity: 0;

    pointer-events: none;

    @include a.tablet {
      height: 468px;
    }
  }

  &__slider {
    position: absolute;
    bottom: 100px;
    left: 0;
    z-index: 10;

    display: flex;
    align-items: stretch;
    gap: 16px;
    width: 100%;
    padding: 0 20px;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;

    @include s.no-scrollbar;
  }

  &__quote {
    position: absolute;

    width: 350px;
    height: max-content;
    padding: 32px;

    color: var(--white);

    background: var(--dark-blue);
    border: 1px solid rgb(255 255 255 / 15%);
    border-radius: 16px;

    @include a.tablet {
      width: 320px;
      padding: 26px;
    }

    @include a.mobile {
      position: relative;
      top: 0;
      right: unset;
      left: unset;

      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 315px;
      height: auto;
      padding: 24px;
      scroll-snap-align: center;
    }

    @include t.body-m-regular;

    &_zindex-up {
      z-index: 10;
    }

    &_druzin {
      bottom: 26.5vh;

      @include a.tablet {
        bottom: 8.5vh;
        z-index: 3;
      }
    }

    &_bitkin {
      bottom: 8.5vh;
    }

    &-text {
      margin: 12px 0 20px;

      @include a.tablet {
        font-size: 16px;
        line-height: 120%;
      }

      b {
        font-weight: 600;
      }
    }

    &-name {
      @include a.mobile {
        margin-top: auto;
      }
    }
  }

  &__gradient {
    position: absolute;
    bottom: 0;
    left: -5%;
    z-index: 9;

    width: 110%;
    height: 200px;

    background: linear-gradient(
      180deg,
      rgb(255 255 255 / 100%) 0%,
      #c8e5fe 100%
    );
    filter: blur(10px);
  }
}
</style>
