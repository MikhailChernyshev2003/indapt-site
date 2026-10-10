<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => `${t('projects.title')}`,
});
</script>

<template>
  <div class="projects-page">
    <projects-sections-listing-hero />
    <projects-sections-cases-list class="projects-page__list" />
    <projects-sections-cta-banner class="projects-page__cta" />
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.projects-page {
  background-color: var(--bg);
}

.projects-page__list {
  margin-top: 120px;

  @include a.tablet {
    margin-top: 60px;
  }

  @include a.mobile {
    margin-top: 40px;
  }
}

.projects-page__cta {
  margin-top: 120px;
  padding-bottom: 120px;

  // На мобильном в макете отступ до футера вдвое меньше, чем до списка

  @include a.mobile {
    margin-top: 80px;
    padding-bottom: 40px;
  }
}
</style>
