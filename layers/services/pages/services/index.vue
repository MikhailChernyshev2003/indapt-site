<script setup lang="ts">
import { SERVICES } from '@l-services/configs';

const { t } = useI18n();

useSeoMeta({
  title: t('services.seoTitle'),
});
</script>

<template>
  <div class="services-page">
    <div class="services-page__head">
      <h1 class="services-page__title">{{ t('services.pageTitle') }}</h1>
    </div>
    <div class="services-page__list">
      <services-molecules-service-tile
        v-for="service in SERVICES"
        :key="service.slug"
        :service="service"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.services-page {
  padding-bottom: 120px;

  @include a.tablet {
    padding-bottom: 108px;
  }

  @include a.mobile {
    padding-bottom: 80px;
  }
}

.services-page__head {
  padding-top: 160px;

  @include s.base-container;

  @include a.tablet {
    padding-top: 144px;
  }

  @include a.mobile {
    padding-top: 104px;
  }
}

.services-page__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

.services-page__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 48px;

  @include s.base-container;

  @include a.tablet {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 40px;
  }

  @include a.mobile {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 24px;
  }
}
</style>
