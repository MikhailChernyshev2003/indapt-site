<script setup lang="ts">
import HeroIllustration from '@l-projects/assets/images/listing-hero.svg?url';

const { t } = useI18n();
</script>

<template>
  <!-- Шапка разводящей: заголовок с подводкой и синяя полоса
       со стеклянной иллюстрацией, стоящей на её нижнем крае -->
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
    padding-top: 112px;
  }

  @include a.mobile {
    padding-top: 96px;
  }
}

// Подводка стоит сразу за заголовком: в макете у заголовка своя
// колонка 318px, а не растяжка на всю ширину

.listing-hero__head {
  display: flex;
  gap: 16px;
  align-items: flex-end;

  @include s.base-container;

  @include a.tablet {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  @include a.mobile {
    gap: 10px;
  }
}

.listing-hero__title {
  flex: none;
  width: 318px;

  color: var(--dark-blue);

  @include t.h1;

  @include a.tablet {
    width: auto;

    @include t.h2;
  }

  @include a.mobile {
    @include t.h4;
  }
}

.listing-hero__desc {
  max-width: 731px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.body-s-medium-135;
  }
}

// Полоса с иллюстрацией: картинка правее центра, низ подставки
// обрезан нижним краем полосы (экспорт из макета уже обрезан)

.listing-hero__band {
  position: relative;

  height: 366px;
  margin-top: 52px;

  background-color: rgb(140 171 253 / 10%);

  @include a.tablet {
    height: 303px;
    margin-top: 24px;
  }

  @include a.mobile {
    height: 173px;
    margin-top: 24px;
  }
}

.listing-hero__img {
  position: absolute;
  bottom: 0;
  left: 487px;

  width: 506px;

  @include a.tablet {
    left: 208px;

    width: 405px;
  }

  @include a.mobile {
    left: 78px;

    width: 236px;
  }
}
</style>
