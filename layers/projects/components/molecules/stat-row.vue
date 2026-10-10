<script setup lang="ts">
const { value, trend = 'down' } = defineProps<{
  /** Описание показателя */
  text: string;
  /** Значение, например «40%» */
  value: string;
  /** Направление тренд-стрелки: снижение или рост */
  trend?: 'down' | 'up';
  /** Цвет стрелки — по макету зависит от кейса и смысла показателя */
  color?: string;
  /** Широкая подпись: в макете последняя строка набрана на всю ширину */
  wide?: boolean;
}>();

const valueRef = useTemplateRef<HTMLElement>('valueRef');

useCountUp(valueRef, () => value);
</script>

<template>
  <!-- Строка результата: тренд-стрелка, описание и крупное значение.
       На мобильном стрелка уходит под текст к значению (сетка областей) -->
  <article class="stat-row" :class="{ 'stat-row_wide': wide }">
    <svg
      class="stat-row__icon"
      :class="{ 'stat-row__icon_up': trend === 'up' }"
      :style="color ? { color } : undefined"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.87 12.75L22.87 18.75C22.87 19.05 22.75 19.33 22.54 19.54C22.33 19.75 22.05 19.87 21.75 19.87L15.75 19.87C15.45 19.87 15.17 19.75 14.96 19.54C14.75 19.33 14.62 19.05 14.62 18.75C14.62 18.45 14.75 18.17 14.96 17.96C15.17 17.75 15.45 17.62 15.75 17.62L19.03 17.62L12.75 11.35L9.79 14.3C9.69 14.4 9.57 14.49 9.43 14.54C9.29 14.6 9.15 14.63 9 14.63C8.85 14.63 8.71 14.6 8.57 14.54C8.43 14.49 8.31 14.4 8.2 14.3L1.45 7.55C1.24 7.34 1.12 7.05 1.12 6.75C1.12 6.6 1.15 6.46 1.21 6.32C1.27 6.19 1.35 6.06 1.45 5.96C1.56 5.85 1.68 5.77 1.82 5.71C1.96 5.65 2.1 5.62 2.25 5.62C2.55 5.62 2.84 5.74 3.05 5.96L9 11.91L11.96 8.95C12.06 8.85 12.18 8.77 12.32 8.71C12.46 8.65 12.6 8.62 12.75 8.62C12.9 8.62 13.04 8.65 13.18 8.71C13.32 8.77 13.45 8.85 13.55 8.95L20.62 16.03L20.62 12.75C20.62 12.45 20.74 12.17 20.96 11.96C21.17 11.74 21.45 11.62 21.75 11.62C22.05 11.62 22.33 11.74 22.54 11.96C22.75 12.17 22.87 12.45 22.87 12.75Z"
        fill="currentColor"
      />
    </svg>
    <p class="stat-row__text" v-html="text" />
    <p ref="valueRef" class="stat-row__value">{{ value }}</p>
  </article>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

// Как в макете: 24px между стрелкой и текстом, а широкая подпись
// доходит вплотную до значения

.stat-row {
  display: grid;
  grid-template-areas: "icon text value";
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  min-height: 150px;
  padding: 40px;

  background-color: var(--white);
  border-radius: 16px;

  @include a.mobile {
    // На мобильном подпись сверху, под ней стрелка и значение в одну линию

    grid-template-areas:
      "text text"
      "icon value";
    grid-template-columns: 56px 1fr;
    row-gap: 24px;

    min-height: 0;
    padding: 24px;
  }
}

.stat-row__icon {
  grid-area: icon;
  width: 40px;
  height: 40px;

  color: var(--dark-blue);

  // Рост — та же стрелка, отражённая по вертикали, как в макете

  &_up {
    transform: scaleY(-1);
  }
}

.stat-row__text {
  grid-area: text;
  max-width: 328px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    max-width: none;

    @include t.lead-s-medium;
  }

  .stat-row_wide & {
    max-width: none;
  }
}

// Значение из макета: Involve 64px (на мобильном 54px), миксинов таких размеров нет

.stat-row__value {
  grid-area: value;

  color: var(--dark-blue);
  font-weight: 500;
  font-size: 64px;
  font-family: v.$font-involve;
  line-height: 1.1;
  letter-spacing: 1px;
  white-space: nowrap;
  text-align: right;

  @include a.mobile {
    font-size: 54px;
    text-align: left;
  }
}
</style>
