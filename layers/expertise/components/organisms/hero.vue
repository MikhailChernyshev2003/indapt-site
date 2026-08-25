<script setup lang="ts">
import KvImage from '@l-expertise/assets/images/kv.svg';
import KvImageT from '@l-expertise/assets/images/kv-t.svg';
import KvImageM from '@l-expertise/assets/images/kv-m.svg';

const { t, locale } = useI18n();
</script>

<template>
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title" v-html="t('expertise.title')" />
      <p class="hero__text" v-html="t('expertise.text')" />
    </div>

    <kv-image class="hero__kv hero__kv_d" filled />
    <kv-image-t class="hero__kv hero__kv_t" filled />
    <kv-image-m class="hero__kv hero__kv_m" filled />
  </section>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.hero {
  position: relative;
  z-index: 1;

  width: 100%;
  padding-top: 158px;

  background: linear-gradient(255deg, rgb(13 63 244 / 15%) 20.7%, rgb(47 240 254 / 15%) 76.76%), #FFFFFF;
}

.hero__content {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 355px;
  padding: 24px 60px 48px;

  @include a.tablet {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 680px;
    padding: 24px 40px 0;
  }

  @include a.mobile {
    height: 425px;
    padding: 10px 20px 0;
  }
}

.hero__title {
  max-width: 980px;

  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  };
}

.hero__text {
  max-width: 730px;
  margin-top: 20px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    margin-top: 10px;

    @include t.body-s-medium-135;
  };
}

.hero__kv {
  position: absolute;

  inset-inline-end: 0;

  bottom: 0;
  z-index: 1;

  width: 456px !important;
  height: auto !important;

  @include a.tablet {
    &_d {
      display: none;
    }
  }
}

.hero__kv_t {
  display: none;

  @include a.tablet {
    display: block;

    width: 766px !important;
    height: auto !important;
  }

  @include a.mobile {
    display: none;
  }
}

.hero__kv_m {
  display: none;

  @include a.mobile {
    display: block;
    width: 374px !important;
  }
}

html[dir="rtl"] .hero__kv {
  transform: scaleX(-1);
}
</style>
