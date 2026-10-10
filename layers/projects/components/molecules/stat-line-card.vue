<script setup lang="ts">
const { value } = defineProps<{
  /** Описание показателя */
  text: string;
  /** Значение под описанием, например «15%» */
  value: string;
  /** Цвет графика */
  color: string;
  /** Форма кривой из макета: «ступенька» вниз или спад с подъёмом */
  variant?: 'step' | 'dip';
}>();

const valueRef = useTemplateRef<HTMLElement>('valueRef');

useCountUp(valueRef, () => value);
</script>

<template>
  <!-- Карточка результата с линейным графиком справа -->
  <article class="stat-line-card">
    <div class="stat-line-card__lead">
      <p class="stat-line-card__text" v-html="text" />
      <div class="stat-line-card__row">
        <svg
          class="stat-line-card__icon"
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
        <span ref="valueRef" class="stat-line-card__value">{{ value }}</span>
      </div>
    </div>
    <projects-molecules-chart-line
      class="stat-line-card__chart"
      :color="color"
      :variant="variant"
    />
  </article>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.stat-line-card {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  min-height: 226px;
  padding: 40px;
  overflow: hidden;

  background-color: var(--white);
  border-radius: 16px;

  @include a.mobile {
    flex-direction: column;
    gap: 0;
    align-items: stretch;
    min-height: 0;
    padding: 24px;
  }
}

.stat-line-card__lead {
  display: flex;
  flex-direction: column;
  gap: 27px;
  max-width: 245px;

  @include a.mobile {
    position: relative;
    z-index: 1;

    max-width: none;
  }
}

.stat-line-card__text {
  color: var(--dark-blue);
  text-wrap: balance;

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

// Высота строки — по стрелке, как в макете: интерлиньяж цифры её не раздувает

.stat-line-card__row {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 40px;
}

.stat-line-card__icon {
  width: 40px;
  height: 40px;

  color: var(--dark-blue);
}

// Значение из макета: Involve 42px, миксина такого размера нет

.stat-line-card__value {
  color: var(--dark-blue);
  font-weight: 500;
  font-size: 42px;

  font-family: v.$font-involve;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.stat-line-card__chart {
  flex: none;
  width: 294px;

  @include a.mobile {
    // График во всю ширину карточки, до краёв и дна. Отступ сверху
    // кейс может поджать: у части макетов кривая заходит под подпись

    width: calc(100% + 48px);
    margin: var(--stat-line-chart-offset, 1.25rem) -24px -24px; // 20px, в rem: pxtorem не заходит в var()
  }
}
</style>
