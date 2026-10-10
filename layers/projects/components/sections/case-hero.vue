<script setup lang="ts">
import type { ProjectCaseItem } from '@l-projects/types';

const { caseItem } = defineProps<{
  /** Кейс из реестра */
  caseItem: ProjectCaseItem;
  /** Размер логотипа в карточке шапки по макету, px */
  logoWidth: number;
  logoHeight: number;
}>();

const { t } = useI18n();

const i18nKey = computed(() => `projects.${caseItem.i18nKey}.content.hero`);

// Ряд жалюзи по макету: на десктопе в полный размер, на планшете
// и мобильном макет уменьшает тот же ряд и сдвигает его
const BLINDS = {
  left: -17,
  top: -246,
  tablet: { left: -12, top: -129, scale: 0.678 },
  mobile: { left: -208, top: -160, scale: 0.712 },
};
</script>

<template>
  <!-- Шапка кейса: акцентный градиент, жалюзи, кнопка возврата,
       название с тегом и карточка логотипа клиента -->
  <section class="case-hero">
    <projects-molecules-blinds
      class="case-hero__blinds"
      :color="caseItem.heroColor"
      :left="BLINDS.left"
      :top="BLINDS.top"
      :tablet="BLINDS.tablet"
      :mobile="BLINDS.mobile"
    />
    <div class="case-hero__wrapper">
      <projects-molecules-back-button class="case-hero__back" />
      <div class="case-hero__row">
        <div class="case-hero__content">
          <h1 class="case-hero__title" v-html="t(`${i18nKey}.title`)" />
          <projects-molecules-case-tag hero>
            {{ t(`${i18nKey}.tags.tag_1`) }}
          </projects-molecules-case-tag>
        </div>
        <div class="case-hero__logo">
          <img
            class="case-hero__logo-img"
            :src="caseItem.logo"
            :alt="t(`projects.${caseItem.i18nKey}.title`)"
            :style="{ width: `${logoWidth / 16}rem`, height: `${logoHeight / 16}rem` }"
            fetchpriority="high"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.case-hero {
  position: relative;

  overflow: hidden;

  // Палитру задаёт страница кейса через переменные --project-hero-*;
  // градиент по макету идёт слева направо почти горизонтально

  background:
    linear-gradient(101deg, var(--project-hero-from) 28.6%, var(--project-hero-to) 98.8%),
    var(--white);
}

// Рамка жалюзи по макету начинается под шапкой сайта и идёт до низа блока

.case-hero__blinds {
  top: 95px;

  @include a.tablet {
    top: 88px;
  }

  @include a.mobile {
    top: 72px;
  }
}

.case-hero__wrapper {
  position: relative;

  // Под фиксированной шапкой сайта: 88px шапки и 24px отступа по макету

  padding-top: 112px;
  padding-bottom: 40px;

  @include s.base-container;

  @include a.tablet {
    // На планшете карточка логотипа стоит вровень с кнопкой возврата,
    // а название прижато к низу карточки — раскладка сеткой

    display: grid;
    grid-template:
      "back logo" auto
      "content logo" 1fr / 1fr auto;
    padding-bottom: 24px;

    column-gap: 20px;
  }

  @include a.mobile {
    // На мобильном карточка логотипа во всю ширину идёт перед названием

    grid-template:
      "back"
      "logo"
      "content" / 100%;
    padding-top: 96px;
  }
}

.case-hero__back {
  position: relative;
  z-index: 1;

  grid-area: back;
  justify-self: start;
}

.case-hero__row {
  display: flex;

  // Ряд по макету идёт сразу за кнопкой возврата, заголовок прижат к низу

  align-items: flex-end;
  justify-content: space-between;

  @include a.tablet {
    display: contents;
  }
}

.case-hero__content {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  grid-area: content;
  gap: 24px;
  align-items: flex-start;
  align-self: end;

  @include a.tablet {
    gap: 16px;
  }

  @include a.mobile {
    gap: 12px;
    margin-top: 32px;
  }
}

.case-hero__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.tablet {
    @include t.h2;
  }

  @include a.mobile {
    @include t.h4;
  }
}

// Карточка логотипа: белая, со свечением-подложкой из макета

.case-hero__logo {
  position: relative;
  z-index: 1;

  display: flex;
  flex: none;
  grid-area: logo;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;

  background-color: var(--white);
  border: 1px solid var(--white-20);
  border-radius: var(--project-hero-logo-radius, 0.5rem); // 8px, в rem: pxtorem не заходит в var()
  box-shadow: 0 5px 40px rgb(12 29 79 / 6%);

  @include a.tablet {
    width: 250px;
    height: 250px;

    // На планшете и мобильном у всех кейсов одинаковое скругление, без тени

    border-radius: 13px;
    box-shadow: none;
  }

  @include a.mobile {
    // По макету карточка во всю ширину экрана и стоит в 24px от строки
    // кнопки возврата; строка кнопки у нас на 4px выше макетной

    width: 100%;
    margin-top: 20px;
  }
}

.case-hero__logo-img {
  max-width: 70%;
  max-height: 76%;
  object-fit: contain;

  @include a.tablet {
    // На планшете и мобильном знак в макете примерно на 7% мельче десктопного

    max-width: none;
    max-height: none;

    transform: scale(0.93);
  }
}
</style>
