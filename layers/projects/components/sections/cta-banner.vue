<script setup lang="ts">
import { RING_SHAPES } from '@l-services/configs';
import type { FigurePlacements } from '@l-services/types';
import { FOOTER_SOCIAL_URLS_RU } from '~/shared/constants/footer-social';

const { t } = useI18n();

/**
 * Кольца — тот же шестиугольник, что в паттернах услуг, но у экземпляра
 * «паттерн 3» в баннере свой градиент (синий слева, бирюза справа)
 * и плотность колец 10%, ядро 8%
 */
const RINGS = RING_SHAPES.hexagon;
const RING_OPACITY = 0.1;
const CORE_OPACITY = 0.08;

/**
 * Паттерн в баннере: экземпляр «паттерн 3» относительно карточки
 * (десктоп 9112:8937, планшет 9112:9358, мобильный 9112:9692).
 * Ядро у правого края, кольца режет карточка
 */
const PATTERN: FigurePlacements = {
  desktop: { x: 2226, y: 659, width: 1640, rotate: 172.2 },
  tablet: { x: 1404, y: 597, width: 1149, rotate: 172.2 },
  mobile: { x: 1025, y: 515, width: 887, rotate: 172.2 },
};

const gradientId = `cta-banner-rings-${useId()}`;
</script>

<template>
  <!-- Баннер «кейсы пополняются»: приглашение в telegram
       с синим шестиугольным паттерном за текстом -->
  <section class="cta-banner">
    <div class="cta-banner__card">
      <services-molecules-figure class="cta-banner__decor" :placement="PATTERN">
        <svg
          class="cta-banner__pattern"
          :viewBox="`0 0 ${RINGS.viewBox[0]} ${RINGS.viewBox[1]}`"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              :id="gradientId"
              x1="0.864"
              y1="0.468"
              x2="0.215"
              y2="0.705"
            >
              <stop offset="0" stop-color="#0d3ff4" />
              <stop offset="1" stop-color="#2ff0fe" />
            </linearGradient>
          </defs>
          <path
            v-for="(ring, idx) in RINGS.rings"
            :key="ring.path"
            data-ring
            :d="ring.path"
            :transform="`translate(${ring.x} ${ring.y})`"
            :fill="`url(#${gradientId})`"
            :fill-opacity="idx === RINGS.rings.length - 1 ? CORE_OPACITY : RING_OPACITY"
          />
        </svg>
      </services-molecules-figure>
      <div class="cta-banner__content">
        <div class="cta-banner__head">
          <h2 class="cta-banner__title" v-html="t('projects.general.subscribe.title')" />
          <p class="cta-banner__text" v-html="t('projects.general.subscribe.text')" />
        </div>
        <a
          class="cta-banner__button"
          :href="FOOTER_SOCIAL_URLS_RU.telegram"
          target="_blank"
          rel="noopener"
        >
          <span class="cta-banner__button-text">{{ t('projects.general.subscribe.button') }}</span>
          <span class="cta-banner__button-dot" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.cta-banner {
  @include s.base-container;
}

// Высоту карточки задаёт контент: 258px на десктопе, 320px на планшете
// и 240px на мобильном, как в макете

.cta-banner__card {
  position: relative;

  padding: 46px;
  overflow: hidden;

  background-color: var(--projects-cta-bg, #dfe8ff);
  border-radius: 16px;

  @include a.mobile {
    padding: 24px;
  }
}

// Паттерн лежит под контентом

.cta-banner__decor {
  z-index: 0;
}

.cta-banner__pattern {
  display: block;
  width: 100%;
  height: auto;
}

.cta-banner__content {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
}

// На планшете колонка узкая: заголовок и текст в две строки

.cta-banner__head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 663px;

  @include a.tablet {
    max-width: 312px;
  }

  @include a.mobile {
    max-width: none;
  }
}

.cta-banner__title {
  color: var(--dark-blue);

  @include t.h2;

  @include a.tablet {
    @include t.h3;
  }

  @include a.mobile {
    @include t.h5;
  }
}

.cta-banner__text {
  color: var(--dark-blue);

  @include t.lead-s-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}

// Кнопка из макета: обводка, блюр-подложка и точка после текста.
// Рамка в макете внутри размеров, поэтому паддинги на 1px меньше

.cta-banner__button {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 13px 27px 15px;

  color: var(--dark-blue);

  background-color: var(--white-20);
  border: 1px solid var(--dark-blue);
  border-radius: 100px;
  backdrop-filter: blur(5px);

  @include t.caption-l-semi;
  @include s.default-transition(background-color);

  @include a.mobile {
    @include t.button-s-semi;
  }

  @include s.hover {
    background-color: var(--white-60);
  }
}

.cta-banner__button-dot {
  width: 8px;
  height: 8px;
  margin-top: 3px;

  background-color: var(--dark-blue);
  border-radius: 50%;
}
</style>
