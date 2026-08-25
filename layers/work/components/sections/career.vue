<script setup lang="ts">
import DiagramDesktop from '@l-work/assets/images/career/diagram-desktop.png';
import DiagramTablet from '@l-work/assets/images/career/diagram-tablet.png';
import DiagramMobile from '@l-work/assets/images/career/diagram-mobile.png';
import EducationIcon from '../../assets/icons/career/education.svg';
import GrowthIcon from '../../assets/icons/career/growth.svg';
import GlobalIcon from '../../assets/icons/career/global.svg';
import gsap from 'gsap';

const { isDesktop, isTablet } = useDevice();

const { t } = useI18n();

const cards = computed(() => [
  {
    title: t('workPage.career.card1.title'),
    text: t('workPage.career.card1.text'),
    icon: EducationIcon,
  },
  {
    title: t('workPage.career.card2.title'),
    text: t('workPage.career.card2.text'),
    icon: GrowthIcon,
  },
  {
    title: t('workPage.career.card3.title'),
    text: t('workPage.career.card3.text'),
    icon: GlobalIcon,
  },
]);

const animation = () => {
  gsap.set('.career__diagram-card', {
    opacity: 0,
    y: 40,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.career__diagram',
      start: 'center+=30% bottom',
      end: 'bottom+=10% bottom',
      scrub: 1,
    },
  });

  tl.to('.career__diagram-card', {
    delay: 3,
  });

  tl.to('.career__diagram-card', {
    opacity: 1,
    y: 0,
    stagger: 6,
    duration: 10,
  });
};

useGsap(animation);
</script>

<template>
  <section class="career">
    <div class="career__wrapper">
      <div class="career__head">
        <h2 class="career__title" v-html="t('workPage.career.title')" />
        <p class="career__text" v-html="t('workPage.career.text')" />
      </div>
      <div class="career__diagram">
        <atoms-picture class="career__diagram-bg" :src="isDesktop ? DiagramDesktop : isTablet ? DiagramTablet : DiagramMobile" />
        <p class="career__diagram-title">{{ t('workPage.career.startCareer') }}</p>
        <div
          v-for="(card, idx) in cards"
          :key="card.title"
          :class="`career__diagram-card career__diagram-card-${idx + 1}`"
        >
          <component :is="card.icon" class="career__diagram-card-icon" />
          <div class="career__diagram-card-content">
            <p class="career__diagram-card-title" v-html="card.title" />
            <p class="career__diagram-card-text" v-html="card.text" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;
@use "@styles/typography" as t;
@use "@styles/shared" as s;

.career {
  &__wrapper {
    color: var(--dark-blue);
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    @include a.tablet {
      display: block;
    }
  }

  &__title {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__text {
    max-width: 652px;

    @include t.lead-m-medium;

    @include a.tablet {
      margin-top: 10px;
    }

    @include a.mobile {
      margin-top: 20px;

      @include t.body-m-medium;
    }
  }

  &__diagram {
    position: relative;
    z-index: 1;

    height: 540px;
    margin-top: 60px;

    @include a.tablet {
      height: 700px;
      margin-top: 45px;
    }

    @include a.mobile {
      height: 604px;
      margin-top: 32px;
    }

    &-bg {
      position: absolute;
      z-index: 1;

      width: 100%;
      height: 100%;
      object-fit: contain;

      pointer-events: none;
    }

    &-title {
      padding: 26px;

      @include t.lead-s-semi;

      @include a.tablet {
        padding: 48px 4px;
      }

      @include a.mobile {
        padding: 6px 0;

        @include t.body-xs-medium;
      }
    }

    &-card {
      position: absolute;
      z-index: 1;

      display: flex;
      width: 547px;
      padding: 24px;

      color: var(--dark-blue);

      background: rgb(140 171 253 / 10%);
      border: 1px solid var(--dark-blue-10);
      border-radius: 16px;
      backdrop-filter: blur(15px);

      @include a.tablet {
        width: 460px;
      }

      @include a.mobile {
        width: 340px;
        padding: 18px;
      }

      &-1 {
        bottom: 43px;
        left: 30px;

        @include a.tablet {
          bottom: 66px;
          left: 24px;
        }

        @include a.mobile {
          bottom: 43px;
          left: 0;
        }
      }

      &-2 {
        bottom: 173px;
        left: 421px;

        @include a.tablet {
          bottom: 277px;
          left: 162px;
        }

        @include a.mobile {
          bottom: 208px;
          left: 0;
        }
      }

      &-3 {
        bottom: 325px;
        left: 733px;

        @include a.tablet {
          bottom: 496px;
          left: 223px;
        }

        @include a.mobile {
          bottom: 397px;
          left: 0;
        }
      }

      &-icon {
        flex-shrink: 0;
        width: 30px;
        height: 30px;

        @include a.mobile {
          width: 24px;
          height: 27px;
        }
      }

      &-content {
        margin-left: 20px;

        @include a.mobile {
          margin-left: 12px;
        }
      }

      &-title {
        @include t.lead-m-medium;

        @include a.mobile {
          @include t.lead-s-medium;
        }
      }

      &-text {
        margin-top: 8px;

        color: var(--dark-blue-80);

        @include t.body-m-medium;

        @include a.mobile {
          margin-top: 6px;

          @include t.body-s-medium;
        }
      }
    }
  }
}
</style>
