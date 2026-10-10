<script setup lang="ts">
const { hero = false } = defineProps<{
  /** Вариант из шапки кейса: светлее и на градиентной подложке */
  hero?: boolean;
}>();
</script>

<template>
  <span class="case-tag" :class="{ 'case-tag_hero': hero }">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.case-tag {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;

  color: var(--dark-blue);
  white-space: nowrap;

  border: 1px solid var(--dark-blue-20);
  border-radius: 200px;

  // По макету текст тега — Medium, не SemiBold

  @include t.body-l-medium;

  @include a.mobile {
    padding: 8px 16px;

    @include t.caption-s-semi-128;
  }

  &_hero {
    // Высота тега шапки по макету: 42px на десктопе и 44px ниже

    padding: 7px 24px;

    background: linear-gradient(90deg, var(--white) 0%, var(--white-40) 100%);
    border-color: var(--dark-blue-10);
    border-radius: 50px;

    @include a.tablet {
      padding: 9px 24px;

      @include t.caption-s-medium;
    }

    @include a.mobile {
      padding: 12px 24px;

      @include t.caption-xs-medium;
    }
  }
}
</style>
