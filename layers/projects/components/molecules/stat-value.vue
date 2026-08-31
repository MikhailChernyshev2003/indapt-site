<script setup lang="ts">
const { value } = defineProps<{
  /** Предлог перед значением: «на», «до» */
  preposition?: string;
  /** Значение, например «95%» */
  value: string;
}>();

const numberRef = useTemplateRef<HTMLElement>('numberRef');

useCountUp(numberRef, () => value);
</script>

<template>
  <p class="stat-value">
    <span v-if="preposition" class="stat-value__preposition">{{ preposition }}</span>
    <span ref="numberRef" class="stat-value__number">{{ value }}</span>
  </p>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.stat-value {
  display: flex;
  gap: 12px;
  align-items: flex-start;

  color: var(--dark-blue);
}

.stat-value__preposition {
  margin-top: 10px;

  color: var(--dark-blue-60);

  @include t.h5;

  @include a.mobile {
    margin-top: 4px;

    @include t.lead-m-medium;
  }
}

// Крупная цифра из макета: 100px, в миксинах такого нет

.stat-value__number {
  font-weight: 500;
  font-size: 100px;
  font-family: v.$font-involve;
  line-height: 1.1;
  letter-spacing: -0.01em;

  @include a.tablet {
    font-size: 80px;
  }

  @include a.mobile {
    font-size: 56px;
  }
}
</style>
