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
</script>

<template>
  <!-- Шапка кейса: акцентный градиент, жалюзи, кнопка возврата,
       название с тегом и карточка логотипа клиента -->
  <section class="case-hero">
    <projects-molecules-blinds
      class="case-hero__blinds"
      :color="caseItem.heroColor"
      :top="-509"
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

  // Палитру задаёт страница кейса через переменные --project-hero-*

  background:
    linear-gradient(180deg, var(--project-hero-from) 0%, var(--project-hero-to) 100%),
    var(--white);
}

.case-hero__blinds {
  top: 95px;

  height: 382px;

  @include a.tablet {
    display: none;
  }
}

.case-hero__wrapper {
  position: relative;

  // Под фиксированной шапкой сайта: 88px шапки и 24px отступа по макету

  padding-top: 112px;
  padding-bottom: 40px;

  @include s.base-container;

  @include a.tablet {
    padding-top: 104px;
  }

  @include a.mobile {
    padding-top: 92px;
    padding-bottom: 24px;
  }
}

.case-hero__back {
  position: relative;
  z-index: 1;
}

.case-hero__row {
  position: relative;
  z-index: 1;

  display: flex;

  // Ряд по макету идёт сразу за кнопкой возврата, заголовок прижат к низу

  align-items: flex-end;
  justify-content: space-between;

  @include a.tablet {
    margin-top: 24px;
  }

  @include a.mobile {
    // На мобильном логотип встаёт под заголовок во всю ширину

    flex-direction: column;
    gap: 32px;
    align-items: stretch;
  }
}

.case-hero__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;

  @include a.mobile {
    gap: 16px;
  }
}

.case-hero__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

// Карточка логотипа: белая, со свечением-подложкой из макета

.case-hero__logo {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;

  background-color: var(--white);
  border: 1px solid var(--white-20);
  border-radius: var(--project-hero-logo-radius, 8px);
  box-shadow: 0 5px 40px rgb(12 29 79 / 6%);

  @include a.tablet {
    width: 250px;
    height: 250px;
  }

  @include a.mobile {
    // По макету карточка занимает всю ширину экрана

    width: 100%;
    height: 250px;

    border-radius: 13px;
  }
}

.case-hero__logo-img {
  max-width: 70%;
  max-height: 76%;
  object-fit: contain;
}
</style>
