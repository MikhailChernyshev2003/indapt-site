<script setup lang="ts">
import type { TimelineStepItem } from '@l-services/types';

const { items } = defineProps<{
  /** Пункты таймлайна в порядке вывода */
  items: TimelineStepItem[];
}>();

const itemNumber = (idx: number) => String(idx + 1).padStart(2, '0');
</script>

<template>
  <section class="timeline-steps">
    <article
      v-for="(item, idx) in items"
      :key="item.title"
      class="timeline-steps__item"
    >
      <div class="timeline-steps__marker">
        <span
          class="timeline-steps__pin"
          :class="{ 'timeline-steps__pin_active': idx === 0 }"
        >
          {{ itemNumber(idx) }}
        </span>
        <div class="timeline-steps__line" />
      </div>
      <div class="timeline-steps__content">
        <h3 class="timeline-steps__title" v-html="item.title" />
        <p class="timeline-steps__text" v-html="item.text" />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.timeline-steps {
  @include s.base-container;
}

// Контент отбит от края контейнера на 86px на всех брейкпоинтах,
// в оставшемся месте стоит колонка меток

.timeline-steps__item {
  display: grid;
  grid-template-columns: 86px 1fr;

  // У последнего пункта нет ни линии вниз, ни отбивки до следующего

  &:last-child {
    .timeline-steps__line {
      display: none;
    }

    .timeline-steps__content {
      padding-bottom: 0;
    }
  }
}

// Метка шире линии, поэтому колонка выровнена по центру.
// Поля в 6px опускают метку до верхней линии заголовка и на столько же
// не доводят линию до низа пункта — так в макете

.timeline-steps__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 49px;
  margin-left: 3px;
  padding-block: 6px;
}

.timeline-steps__pin {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 43px;

  color: var(--timeline-pin-number, var(--dark-blue-60));

  background-color: var(--timeline-pin-bg, #c9dbfd);
  border-radius: var(--timeline-pin-radius, 0.875rem); // 14px

  @include t.caption-s-medium;

  &_active {
    color: var(--white);

    background-color: var(--timeline-pin-active-bg, #3e5eff);
  }
}

// Линия занимает остаток колонки, а колонка тянется на всю высоту ряда —
// поэтому линия проходит и через отбивку до следующего пункта

.timeline-steps__line {
  flex-grow: 1;
  width: 4px;
  margin-top: 16px;

  background-color: var(--timeline-line, #dfeafe);
}

// Ширина, по которой переносится текст: дальше в макете идёт иллюстрация.
// Значение по умолчанию внутри var() записано в rem: postcss-pxtorem
// не заходит внутрь var(), и px там не тянулся бы от html font-size

.timeline-steps__content {
  max-width: var(--timeline-content-max-width, 37.5rem); // 600px
  padding-bottom: 64px;

  @include a.tablet {
    max-width: var(--timeline-content-max-width-tablet, 24.375rem); // 390px
  }

  @include a.mobile {
    // Планшетная ширина унаследовалась бы, снимаем её явно

    max-width: none;
  }
}

.timeline-steps__title {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

.timeline-steps__text {
  margin-top: 16px;

  color: var(--dark-blue-80);

  @include t.body-s-medium;

  @include a.mobile {
    margin-top: 12px;
  }
}
</style>
