<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TimelineStepItem } from '@l-services/types';

const { items } = defineProps<{
  /** Пункты таймлайна в порядке вывода */
  items: TimelineStepItem[];
}>();

const itemNumber = (idx: number) => String(idx + 1).padStart(2, '0');

const itemsRef = useTemplateRef<HTMLElement[]>('itemsRef');

// По правкам активный номер переходит от первого пункта к последнему
// по мере скролла. Активен тот шаг, чья строка сейчас пересекает середину
// экрана; до блока активен первый, после — последний
const activeIdx = ref(0);

let triggers: ScrollTrigger[] = [];

useGsap(() => {
  const els = itemsRef.value;

  if (!els?.length) return;

  const lastIdx = els.length - 1;

  els.forEach((el, idx) => {
    triggers.push(ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) activeIdx.value = idx;
      },
      // Страница может открыться уже ниже блока или посреди него (возврат
      // «назад», перезагрузка, рывок скролла): переключения тогда не было,
      // и снизу был виден первый номер вместо последнего. При рывке через
      // весь шаг срабатывает только onLeave, при пересчёте — onRefresh
      onLeave: idx === lastIdx
        ? () => {
            activeIdx.value = idx;
          }
        : undefined,
      onRefresh: (self) => {
        if (self.isActive || (idx === lastIdx && self.progress === 1)) activeIdx.value = idx;
      },
    }));
  });
});

onBeforeUnmount(() => {
  triggers.forEach(trigger => trigger.kill());
  triggers = [];
});
</script>

<template>
  <section class="timeline-steps">
    <article
      v-for="(item, idx) in items"
      ref="itemsRef"
      :key="item.title"
      class="timeline-steps__item"
    >
      <div class="timeline-steps__marker">
        <span
          class="timeline-steps__pin"
          :class="{ 'timeline-steps__pin_active': idx === activeIdx }"
        >
          <!-- Скруглённый треугольник остриём вниз — контур из макета -->
          <svg
            class="timeline-steps__pin-shape"
            viewBox="0 0 48.52 42.64"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.43 38.8L1.18 12.17C-2.07 6.84 1.77 0 8.01 0H40.51C46.76 0 50.59 6.84 47.34 12.17L31.09 38.8C27.97 43.92 20.55 43.92 17.43 38.8Z" />
          </svg>
          <span class="timeline-steps__pin-number">{{ itemNumber(idx) }}</span>
        </span>
        <div class="timeline-steps__line" />
      </div>
      <!-- По комментарию в макете текст шагов выплывает при скролле -->
      <animations-scroll-enter-bottom class="timeline-steps__content">
        <h3 class="timeline-steps__title" v-html="item.title" />
        <p class="timeline-steps__text" v-html="item.text" />
      </animations-scroll-enter-bottom>
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

  // На мобильном метка по макету вровень с верхом заголовка

  @include a.mobile {
    padding-top: 0;
  }
}

.timeline-steps__pin {
  position: relative;

  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 100%;
  height: 43px;

  // Номер стоит в широкой верхней части треугольника

  padding-top: 6px;

  color: var(--timeline-pin-number, var(--dark-blue-60));

  @include t.body-s-medium-135;

  &_active {
    color: var(--white);
  }
}

.timeline-steps__pin-shape {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  fill: var(--timeline-pin-bg, #c9dbfd);

  .timeline-steps__pin_active & {
    fill: var(--timeline-pin-active-bg, #3e5eff);
  }
}

.timeline-steps__pin-number {
  position: relative;
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
