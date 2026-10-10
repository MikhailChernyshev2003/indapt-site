<script setup lang="ts">
import { PROJECT_TECH, getProjectCase } from '@l-projects/configs';
import Infra from '@l-projects/assets/images/infra/university.webp';
import InfraMobile from '@l-projects/assets/images/infra/university-mobile.webp';
import Decor from '@l-projects/assets/images/university-decor.svg?url';

const SLUG = 'university';
const I18N_KEY = `projects.${SLUG}`;

const { t } = useI18n();

const caseItem = getProjectCase(SLUG)!;
const tech = PROJECT_TECH[SLUG];

useSeoMeta({
  title: () => `${t(`${I18N_KEY}.title`)}`,
});
</script>

<template>
  <projects-sections-case-page
    class="case-university"
    :case-item="caseItem"
    :hero-logo="[158, 194]"
    :infra="{ src: Infra, mobile: InfraMobile, tabletPosition: '51%' }"
    :bubbles="tech.bubbles"
    :rings="tech.rings"
  >
    <template #results>
      <div class="case-university__results">
        <projects-molecules-stat-big-card
          class="case-university__card"
          :text="t(`${I18N_KEY}.content.results.result_1.text`)"
          :preposition="t(`${I18N_KEY}.content.results.result_1.preposition`)"
          :value="t(`${I18N_KEY}.content.results.result_1.value`)"
          color="#0081ff"
          :column-height="310"
          :mobile-column-height="304"
          :bar-height="75"
          :fade-to="0.1"
        />
        <article class="case-university__decor-card">
          <div class="case-university__lead">
            <p class="case-university__text" v-html="t(`${I18N_KEY}.content.results.result_2.text`)" />
            <projects-molecules-stat-value
              class="case-university__value"
              :preposition="t(`${I18N_KEY}.content.results.result_2.preposition`)"
              :value="t(`${I18N_KEY}.content.results.result_2.value`)"
            />
          </div>
          <img
            class="case-university__decor"
            :src="Decor"
            alt=""
            loading="lazy"
          />
        </article>
      </div>
    </template>
  </projects-sections-case-page>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.case-university {
  // Палитра кейса: синий Сеченовского
  --project-hero-from: rgb(0 129 255 / 40%);
  --project-hero-to: rgb(0 129 255 / 4%);
  --projects-cta-bg: rgb(140 171 253 / 20%);

  background-color: var(--bg);
}

.case-university__results {
  display: flex;
  gap: 8px;

  @include a.tablet {
    flex-direction: column;
  }
}

.case-university__card {
  flex: 1 1 656px;

  @include a.tablet {
    flex: none;
  }
}

// Вторая карточка: значение и сфера-диаграмма 310×310 из макета целиком
// справа; на мобильном всё в столбик: текст, сфера во всю ширину, значение

.case-university__decor-card {
  display: flex;
  flex: 1 1 656px;
  gap: 24px;
  justify-content: space-between;
  min-height: 390px;
  padding: 40px;

  background-color: var(--white);
  border-radius: 16px;

  @include a.tablet {
    flex: none;
  }

  @include a.mobile {
    flex-direction: column;
    min-height: 0;
    padding: 24px;
  }
}

.case-university__lead {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
  min-width: 0;

  @include a.mobile {
    display: contents;
  }
}

.case-university__text {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

.case-university__value {
  @include a.mobile {
    order: 2;
  }
}

.case-university__decor {
  flex: none;
  align-self: flex-start;
  width: 310px;
  height: 310px;

  @include a.mobile {
    order: 1;

    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
}
</style>
