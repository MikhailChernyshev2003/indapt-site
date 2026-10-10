<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let trustTimeline: gsap.core.Timeline | null = null;
let trustTimer = 0;

useGsap(() => {
  trustTimer = window.setTimeout(() => {
    trustTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-page__trust-relative',
        start: 'top bottom+=20%',
        end: '+=200px',
        scrub: 2,
      },
    });

    trustTimeline.to('.about-page__trust-relative-decor', {
      opacity: 0.5,
      scale: 1,
    });
  }, 1000);
});

// Таймлайн создаётся по таймеру, мимо контекста useGsap, поэтому гасим его
// сами: иначе его триггер переживал переход на другую страницу
onBeforeUnmount(() => {
  clearTimeout(trustTimer);
  trustTimeline?.scrollTrigger?.kill();
  trustTimeline?.kill();
  trustTimeline = null;
});

onMounted(async () => {
  document.body.classList.remove('after-init');

  await nextTick();

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 200);

  setTimeout(() => {
    document.body.classList.add('after-init');
    // Триггеры (пин owners) мерились, пока body был fixed и полосы прокрутки не было;
    // с обычным скроллбаром (Windows) pin-spacer оставался шире окна и давал горизонтальный скролл
    ScrollTrigger.refresh();
  }, 1300);
});
</script>

<template>
  <div class="about-page">
    <about-sections-hero />
    <about-sections-owners />
    <about-sections-bio class="about-page__bio" />
    <about-sections-advantages class="about-page__advantages" />
    <about-sections-partrners class="about-page__partners" />
    <div class="about-page__trust-relative">
      <img
        class="about-page__trust-relative-decor"
        src="@l-about/assets/images/partners/decor.png"
        alt="decor"
      />
      <about-sections-trust class="about-page__trust" />
    </div>
    <about-sections-structure class="about-page__structure" />
    <about-sections-smi-about class="about-page__smi-about" />
    <div class="about-page__mail">
      <about-sections-mail />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.about-page {
  padding: 0 0 120px;

  @include a.mobile {
    padding: 0 0 104px;
  }

  &__bio {
    position: relative;
    z-index: 10;
  }

  &__bio,
  &__trust,
  &__structure,
  &__smi-about {
    margin-top: 120px;

    @include a.tablet {
      margin-top: 108px;
    }
  }

  &__bio, &__partners, &__structure {
    padding: 0 60px;

    @include a.tablet {
      padding: 0 40px;
    }

    @include a.mobile {
      padding: 0 20px;
    }
  }

  &__advantages {
    padding: 40px 60px 120px;

    @include a.tablet {
      padding: 142px 40px;
    }

    @include a.mobile {
      padding: 104px 20px;
    }
  }

  &__mail {
    margin-top: 120px;
    padding: 0 60px;

    @include a.tablet {
      margin-top: 108px;
      padding: 0 40px;
    }

    @include a.mobile {
      margin-top: 80px;
      padding: 0 20px;
    }
  }

  &__trust-relative {
    position: relative;
    z-index: 0;

    &-decor {
      position: absolute;
      top: -149%;
      left: -16;
      z-index: 1;

      height: 275%;

      transform: scale(0.3);
      transform-origin: left center;
      opacity: 0;

      @include a.tablet {
        top: -120%;
        left: -60%;

        height: 225%;
      }

      @include a.mobile {
        top: -100%;
        left: -96%;

        height: 200%;
      }
    }
  }
}
</style>
