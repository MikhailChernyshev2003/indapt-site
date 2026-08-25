<script setup lang="ts">
const {
  disabled,
  href,
} = defineProps<{
  disabled?: boolean;
  href?: string;
}>();

const nuxtLink = resolveComponent('nuxt-link');
</script>

<template>
  <component
    :is="href ? nuxtLink : 'button'"
    :to="href"
    :target="href ? '_blank' : undefined"
    :disabled="disabled"
    class="button-icon"
  >
    <slot />
  </component>
</template>

<style lang="scss">
@use "assets/styles/adaptive" as a;
@use "assets/styles/variables" as v;
@use "assets/styles/shared" as s;

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;

  color: var(--dark-blue);

  border: 1px solid var(--dark-blue);
  border-radius: 50%;

  transition: color v.$timing, background v.$timing;

  @include a.mobile {
    width: 50px;
    height: 50px;
  }

  @include s.hover {
    color: var(--white);

    background: var(--dark-blue);
  }

  &:disabled {
    opacity: 0.4;

    pointer-events: none;
  }

  .nuxt-icon {
    width: 40px;
    height: 40px;

    @include a.mobile {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
