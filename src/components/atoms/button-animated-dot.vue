<script setup lang="ts">
const emits = defineEmits<{
  click: [];
}>();

defineProps<{
  text?: string;
  disabled?: boolean;
  href?: string;
}>();
</script>

<template>
  <component
    :is="href ? 'nuxt-link' : 'button'"
    :to="href"
    :target="href ? '_blank' : undefined"
    :disabled="disabled"
    class="button"
    @click="emits('click')"
  >
    <span class="button__dot" />

    <span class="button__text">
      <slot />
    </span>
  </component>
</template>

<style scoped lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.button {
  display: flex;
  align-items: center;

  color: var(--dark-blue);

  transition: opacity 0.3s;

  @include s.hover {
    opacity: 0.6;

    .button__dot {
      transform: scale(1.5);
    }
  }

  &__dot {
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    margin-top: 0;

    background-color: currentcolor;
    border-radius: 50%;
    margin-inline-end: 10px;

    transform: scale(1);
    transform-origin: center center;

    transition: transform 0.3s ease;
  }

  &__text {
    color: currentcolor;

    @include t.button-s-semi;
  }
}
</style>
