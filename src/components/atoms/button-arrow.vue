<script setup lang="ts">
import ArrowIcon from 'assets/icons/arrow-up.svg';
</script>

<template>
  <button class="button-arrow">
    <arrow-icon class="button-arrow__icon" />
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/shared" as s;

.button-arrow {
  position: relative;

  display: none;

  width: 64px;
  height: 64px;
  padding: 16px;

  background-color: var(--white);
  border: 1px solid rgb(12 29 79 / 10%);

  border-radius: 50%;

  transition: box-shadow 0.3s ease, backdrop-filter 0.3s ease;

  @include a.mobile {
    width: 48px;
    height: 48px;
    padding: 12px;
  }

  @include s.hover {
    box-shadow: 0 0 20px 0 rgb(10 15 47 / 14%);
    backdrop-filter: blur(30px);
  }

  @include a.desktop-only {
    display: block;
  }

  &__icon {
    width: 100%;

    height: 100%;

    svg {
      position: absolute;
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);
    }
  }
}
</style>
