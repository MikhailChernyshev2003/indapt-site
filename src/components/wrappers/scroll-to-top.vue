<script setup lang="ts">
const route = useRoute();
const props = withDefaults(defineProps<{
  targetSelector?: string | null;
  targetTop?: number | null;
  // Своё действие вместо прокрутки (главная перезапускается с первого экрана)
  action?: (() => void) | null;
}>(), {
  targetSelector: null,
  targetTop: null,
  action: null,
});

const scrollToTop = () => {
  if (props.action) {
    props.action();
    return;
  }

  if (typeof props.targetTop === 'number') {
    window.scrollTo({
      top: props.targetTop,
      behavior: 'smooth',
    });
    return;
  }

  if (props.targetSelector) {
    const target = document.querySelector(props.targetSelector);

    if (target instanceof HTMLElement) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
  <div class="scroll-to-top">
    <slot />
    <atoms-button-arrow
      v-if="!route.path.includes('/in-progress')"
      class="scroll-to-top__button"
      @click="scrollToTop"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.scroll-to-top {
  position: relative;
}

.scroll-to-top__button {
  position: absolute;
  right: 60px;

  bottom: 24px;
  z-index: 2;

  @include a.tablet {
    right: 40px;
  }

  @include a.mobile {
    right: 20px;
  }
}
</style>
