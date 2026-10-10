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

// Как в макете: предлог стоит вровень с верхом цифр, а под цифрами
// остаётся 10px до низа блока — лишний интерлиньяж срезан отступами

.stat-value__preposition {
  color: var(--dark-blue-60);

  @include t.h3;

  @include a.mobile {
    @include t.h5;
  }
}

// Крупная цифра из макета: 100px (на мобильном 80px), в миксинах такого нет

.stat-value__number {
  margin: -11px 0 -14px;

  font-weight: 500;
  font-size: 100px;
  font-family: v.$font-involve;
  line-height: 1.1;
  letter-spacing: -0.01em;

  @include a.mobile {
    margin: -9px 0;

    font-size: 80px;
  }
}
</style>
