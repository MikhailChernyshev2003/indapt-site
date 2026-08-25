<script setup lang="ts">
import LayerKv1 from '@l-work/assets/images/hero/1.png';
import LayerKv2 from '@l-work/assets/images/hero/2.png';
import LayerKv3 from '@l-work/assets/images/hero/3.png';
import LayerKvDecor from '@l-work/assets/images/hero/decor.png';
import gsap from 'gsap';

const { isAppLoading } = useAppLoader();

const { t } = useI18n();

const desktopAnim = () => {
  gsap.set('.hero__kv-item', {
    scale: 0.8,
  });

  gsap.to('.hero__kv-item', {
    opacity: 1,
    scale: 1,
    duration: 0.65,
    stagger: 0.2,
  });
};

onMounted(async () => {
  await nextTick();

  const checkAndRunAnimation = () => {
    if (!isAppLoading.value) {
      desktopAnim();
    }
    else {
      setTimeout(checkAndRunAnimation, 300);
    }
  };
  checkAndRunAnimation();
});
</script>

<template>
  <section class="hero">
    <div class="hero__wrapper">
      <div class="hero__kv">
        <atoms-picture
          class="hero__kv-item hero__kv-item_1"
          :src="LayerKv1"
        />
        <atoms-picture
          class="hero__kv-item hero__kv-item_2"
          :src="LayerKv2"
        />
        <atoms-picture
          class="hero__kv-item hero__kv-item_3"
          :src="LayerKv3"
        />
        <atoms-picture
          class="hero__kv-item hero__kv-item_decor"
          :src="LayerKvDecor"
        />
      </div>
      <div class="hero__content">
        <h1 class="hero__title">{{ t('workPage.hero.title') }}</h1>
        <div class="hero__texts">
          <p class="hero__text">
            <span class="hero__text_caption">(info)</span>
            <span v-html="t('workPage.hero.text1')" />
          </p>
          <p class="hero__text" v-html="t('workPage.hero.text2')" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;
@use "@styles/typography" as t;
@use "@styles/shared" as s;

.hero {
  &__wrapper {
    display: flex;
    align-items: center;

    @include a.tablet {
      display: block;
    }
  }

  &__kv {
    position: relative;
    z-index: 1;

    width: 601px;
    height: 412px;

    pointer-events: none;

    @include a.tablet {
      margin: 0 auto;
    }

    @include a.mobile {
      width: 335px;
      height: 300px;
    }

    &-item_1 {
      position: absolute;
      top: 129px;
      left: 135px;
      z-index: 3;

      width: 331px;

      opacity: 0;

      @include a.mobile {
        top: 106px;
        left: 65px;

        width: 205px;
        height: 90px;
      }
    }

    &-item_2 {
      position: absolute;
      top: 9px;
      left: 230px;
      z-index: 2;

      width: 130px;

      opacity: 0;

      @include a.mobile {
        top: 30px;
        left: 121px;

        width: 90px;
        height: 239px;
      }
    }

    &-item_3 {
      position: absolute;
      top: 35px;
      left: 52px;
      z-index: 1;

      width: 497px;

      opacity: 0;

      @include a.mobile {
        top: 47px;
        left: 12.5px;

        width: 310px;
        height: 208px;
      }
    }

    &-item_decor {
      top: 0;
      left: 76px;

      width: 450px;

      opacity: 0;

      @include a.mobile {
        top: 26px;
        left: 27px;

        width: 280px;
        height: 244px;
      }
    }
  }

  &__content {
    position: relative;
    z-index: 1;

    width: 654px;
    margin-left: 65px;

    color: var(--dark-blue);

    @include a.tablet {
      width: 100%;
      margin-top: 40px;
      margin-left: 0;
    }
  }

  &__title {
    margin-bottom: 20px;

    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__text {
    max-width: 654px;

    @include t.lead-m-medium;

    @include a.mobile {
      @include t.body-m-medium;
    }

    &_caption {
      display: inline-block;
      margin-right: 32px;

      @include t.caption-m-medium;

      @include a.mobile {
        margin-right: 12px;

        @include t.caption-xs-medium;
      }
    }

    &:not(:first-child) {
      max-width: 560px;
      margin-top: 12px;

      @include a.mobile {
        margin-top: 8px;
      }
    }
  }
}
</style>
