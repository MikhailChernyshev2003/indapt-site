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
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

// Блочная, а не строчная: иначе строка родителя добавляет снизу пару px
// и ряд под кнопкой съезжает относительно макета

.back-button {
  display: flex;
  gap: 16px;
  align-items: center;
  width: fit-content;

  color: var(--dark-blue);

  @include s.default-transition(opacity);

  @include s.hover {
    opacity: 0.7;
  }

  @include a.mobile {
    gap: 10px;
  }
}

.back-button__icon {
  width: 24px;
  height: 24px;

  @include a.mobile {
    width: 18px;
    height: 18px;
  }
}

.back-button__text {
  @include t.lead-s-medium;

  @include a.mobile {
    @include t.caption-s-medium;
  }
}
</style>
