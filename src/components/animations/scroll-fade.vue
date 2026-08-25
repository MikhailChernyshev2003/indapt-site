<script setup lang="ts">
import { gsap } from 'gsap';

const {
  is = 'div',
  initialOpacity = 0,
  disabledTablet,
  disabledMobile,
  start = 'top bottom-=18%',
  end = 'top+=150px bottom-=18%',
} = defineProps<{
  is?: string;
  initialOpacity?: number;
  disabledTablet?: boolean;
  disabledMobile?: boolean;
  start?: string;
  end?: string;
}>();

const scrollFadeRef = useTemplateRef<HTMLElement>('scrollFadeRef');

const animation = () => {
  if (!scrollFadeRef.value) return;

  gsap.set(scrollFadeRef.value, {
    opacity: initialOpacity,
  });

  gsap.to(scrollFadeRef.value, {
    opacity: 1,
    duration: 0.4,
    scrollTrigger: {
      trigger: scrollFadeRef.value,
      start,
      scrub: end ? 1 : undefined,
      end,
    },
  });
};

useGsap({
  desktop: () => animation(),
  tablet: !disabledTablet ? () => animation() : undefined,
  mobile: !disabledMobile ? () => animation() : undefined,
});
</script>

<template>
  <component
    :is="is"
    ref="scrollFadeRef"
    class="scroll-fade"
    :class="{
      'scroll-fade_disabled-tablet': disabledTablet,
      'scroll-fade_disabled-mobile': disabledMobile,
    }"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;

.scroll-fade {
  @include a.desktop-only {
    opacity: v-bind(initialOpacity);
  }

  &:not(.scroll-fade_disabled-tablet) {
    @include a.tablet {
      opacity: v-bind(initialOpacity);
    }
  }

  &:not(.scroll-fade_disabled-mobile) {
    @include a.mobile {
      opacity: v-bind(initialOpacity);
    }
  }
}
</style>
