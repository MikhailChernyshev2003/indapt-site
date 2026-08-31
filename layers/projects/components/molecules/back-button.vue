<script setup lang="ts">
import ArrowLeftIcon from '@l-projects/assets/images/arrow-left.svg';
</script>

<template>
  <nuxt-link class="back-button" to="/projects">
    <arrow-left-icon class="back-button__icon" />
    <span class="back-button__text">{{ $t('projects.general.back') }}</span>
  </nuxt-link>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.back-button {
  display: inline-flex;
  gap: 16px;
  align-items: center;

  color: var(--dark-blue);

  @include s.default-transition(opacity);

  @include s.hover {
    opacity: 0.7;
  }
}

.back-button__icon {
  width: 24px;
  height: 24px;
}

.back-button__text {
  @include t.lead-s-medium;
}
</style>
