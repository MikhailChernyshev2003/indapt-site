<script setup lang="ts">
import ArrowRightIcon from 'assets/icons/arrow-right-long.svg';
import ArrowUpRightIcon from 'assets/icons/arrow-up-right.svg';

const {
  activeColor = 'transparent',
} = defineProps<{
  links: {
    label: string;
    href: string;
  }[];
  activeColor?: string;
}>();
</script>

<template>
  <div class="links-list">
    <nuxt-link
      v-for="(link, idx) in links"
      :key="idx"
      :href="link.href"
      class="links-list__item"
    >
      <arrow-right-icon class="links-list__item-arrow-right" />
      <span class="links-list__item-label">{{ link.label }}</span>
      <arrow-up-right-icon class="links-list__item-arrow-top" />
    </nuxt-link>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.links-list {
  display: grid;
}

.links-list__item {
  display: flex;
  align-items: center;
  padding: 16px 12px;
  overflow: hidden;

  color: var(--dark-blue);

  border-bottom: 1px solid var(--dark-blue-30);

  transition: background-color .2s ease;

  @include a.tablet {
    padding: 15.5px 12px;
  }

  @include s.hover {
    background-color: v-bind(activeColor);

    .links-list__item-arrow-right {
      margin-inline-start: 0;

      opacity: 1;
    }
  }

  &-arrow-right {
    width: 34px;
    margin-inline: -44px 10px;

    opacity: 0;

    transition: .2s ease;
    transition-property: margin, opacity;
  }

  &-label {
    @include t.body-m-medium;
  }

  // По макету иконка 20×20 и стоит по верху строки, а не по центру

  &-arrow-top {
    flex-shrink: 0;
    align-self: flex-start;
    width: 20px;
    height: 20px;
    margin-inline-start: auto;
  }
}
</style>
