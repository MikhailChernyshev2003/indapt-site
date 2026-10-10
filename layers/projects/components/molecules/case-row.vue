<script setup lang="ts">
defineProps<{
  /** Лейбл в левой колонке, например «Проблема клиента» */
  label: string;
}>();
</script>

<template>
  <!-- Ряд кейса: узкий лейбл слева, содержимое в правой колонке -->
  <div class="case-row">
    <p class="case-row__label">{{ label }}</p>
    <div class="case-row__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.case-row {
  display: flex;
  gap: 20px;
  justify-content: space-between;

  @include a.tablet {
    flex-direction: column;
  }

  @include a.mobile {
    gap: 28px;
  }
}

.case-row__label {
  flex: none;
  width: 315px;

  color: var(--dark-blue);

  @include t.body-l-medium;

  @include a.tablet {
    width: auto;
  }

  @include a.mobile {
    @include t.body-s-medium;
  }
}

.case-row__content {
  display: flex;
  flex-direction: column;
  gap: 32px;

  // Правая колонка по макету

  width: 985px;
  max-width: 100%;

  @include a.tablet {
    width: auto;
  }

  @include a.mobile {
    gap: 20px;
  }
}
</style>
