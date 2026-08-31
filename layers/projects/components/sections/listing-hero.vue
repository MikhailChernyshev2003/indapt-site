<script setup lang="ts">
import HeroIllustration from '@l-projects/assets/images/listing-hero.svg?url';

const { t } = useI18n();
</script>

<template>
  <!-- Шапка разводящей: заголовок с подводкой и синяя полоса
       со стеклянной иллюстрацией, выходящей за её верх -->
  <section class="listing-hero">
    <div class="listing-hero__head">
      <h1 class="listing-hero__title" v-html="t('projects.title')" />
      <p class="listing-hero__desc" v-html="t('projects.description')" />
    </div>
    <div class="listing-hero__band">
      <img
        class="listing-hero__img"
        :src="HeroIllustration"
        alt=""
        fetchpriority="high"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.listing-hero {
  padding-top: 160px;

  @include a.tablet {
    padding-top: 114px;
  }

  @include a.mobile {
    padding-top: 96px;
  }
}

.listing-hero__head {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  justify-content: space-between;

  @include s.base-container;

  @include a.tablet {
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
  }
}

.listing-hero__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

.listing-hero__desc {
  max-width: 731px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}

// Полоса с иллюстрацией: картинка стоит правее центра
// и поднимается над верхним краем полосы, как в макете

.listing-hero__band {
  position: relative;

  height: 366px;
  margin-top: 52px;

  background-color: rgb(140 171 253 / 10%);

  @include a.tablet {
    height: 303px;
    margin-top: 40px;
  }

  @include a.mobile {
    height: 173px;
    margin-top: 24px;
  }
}

.listing-hero__img {
  position: absolute;
  top: -127px;
  left: 487px;

  width: 506px;

  @include a.tablet {
    top: -54px;
    left: 208px;

    width: 405px;
  }

  @include a.mobile {
    top: -34px;
    left: 79px;

    width: 236px;
  }
}
</style>
