<script setup lang="ts">
import { SERVICE_EXPERTISE_LINKS } from '@l-services/configs';

const { t } = useI18n();

const links = computed(() =>
  SERVICE_EXPERTISE_LINKS.map(({ href, i18nKey }) => ({
    href,
    label: t(i18nKey),
  })),
);
</script>

<template>
  <section class="service-expertise">
    <h2 class="service-expertise__title" v-html="t('services.expertise.title')" />
    <organisms-links-list
      class="service-expertise__list"
      :links="links"
      active-color="var(--service-row-hover)"
    />
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.service-expertise {
  @include s.base-container;
}

.service-expertise__title {
  // Перенос как в макете: «Экспертиза» / «для различных отраслей».
  // Вторая строка занимает 722px, вся фраза в одну строку — 794px

  max-width: 760px;

  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

.service-expertise__list {
  margin-top: 64px;

  @include a.mobile {
    margin-top: 32px;
  }
}
</style>
