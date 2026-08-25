<script setup lang="ts">
import { computed, useSlots } from 'vue';

const {
  headingLevel = '3',
} = defineProps<{
  section?: boolean;
  headingLevel?: '3' | '4';
}>();

const slots = useSlots();
const hasHeading = computed(() => Boolean(slots.heading));
</script>

<template>
  <component :is="section ? 'section' : 'div'" class="grid">
    <div class="grid__content" :class="{ 'grid__content_no-heading': !hasHeading }">
      <component
        :is="`h${headingLevel}`"
        v-if="hasHeading"
        class="grid__heading"
        :class="`grid-heading_level_${headingLevel}`"
      >
        <slot name="heading" />
      </component>

      <div class="grid__right">
        <slot name="right" />
      </div>
    </div>

    <div v-if="$slots.body" class="grid__body">
      <slot name="body" />
    </div>
  </component>
</template>

<style scoped lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;

.grid__content {
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 429px 875px;

  @include a.tablet {
    grid-gap: 14px;
    grid-template-columns: 104px 1fr;
  }

  @include a.mobile {
    grid-template-columns: 40px 1fr;

    &:not(:has(.grid-heading_level_4)) {
      grid-gap: 12px;
    }
  }
}

.grid__content_no-heading {
  grid-template-columns: 1fr;

  @include a.tablet {
    grid-template-columns: 1fr;
  }

  @include a.mobile {
    grid-template-columns: 1fr;
  }
}

.grid-heading {
  &_level {
    &_3 {
      color: var(--dark-blue);

      @include t.caption-m-medium;

      @include a.mobile {
        @include t.caption-xs-medium;
      }
    }

    &_4 {
      color: var(--dark-blue-60);

      @include t.caption-l-semi;

      @include a.mobile {
        @include t.caption-xs-medium;
      }
    }
  }
}
</style>
