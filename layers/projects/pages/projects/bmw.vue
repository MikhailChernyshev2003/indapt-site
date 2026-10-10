<script setup lang="ts">
import { PROJECT_TECH, getProjectCase } from '@l-projects/configs';
import Infra from '@l-projects/assets/images/infra/bmw.webp';
import InfraMobile from '@l-projects/assets/images/infra/bmw-mobile.webp';

const SLUG = 'bmw';
const I18N_KEY = `projects.${SLUG}`;

const { t } = useI18n();

const caseItem = getProjectCase(SLUG)!;
const tech = PROJECT_TECH[SLUG];

useSeoMeta({
  title: () => `${t(`${I18N_KEY}.title`)}`,
});

/** Строки результатов слева: ключи локали в порядке макета.
 * Стрелки по смыслу: снижение издержек — синяя вниз, рост — зелёная вверх */
const ROW_RESULTS: { key: string; trend: 'down' | 'up'; color: string; wide?: boolean }[] = [
  { key: 'result_1', trend: 'down', color: '#1764f6' },
  { key: 'result_3', trend: 'up', color: '#71f21a' },
  { key: 'result_4', trend: 'up', color: '#71f21a', wide: true },
];
</script>

<template>
  <projects-sections-case-page
    class="case-bmw"
    :case-item="caseItem"
    :hero-logo="[182, 181]"
    :infra="{ src: Infra, mobile: InfraMobile, tabletPosition: '14%' }"
    :bubbles="tech.bubbles"
    :rings="tech.rings"
  >
    <template #results>
      <div class="case-bmw__results">
        <div class="case-bmw__rows">
          <projects-molecules-stat-row
            v-for="row in ROW_RESULTS"
            :key="row.key"
            :text="t(`${I18N_KEY}.content.results.${row.key}.text`)"
            :value="t(`${I18N_KEY}.content.results.${row.key}.value`)"
            :trend="row.trend"
            :color="row.color"
            :wide="row.wide"
          />
        </div>
        <projects-molecules-stat-big-card
          class="case-bmw__big"
          :text="t(`${I18N_KEY}.content.results.result_2.text`)"
          :preposition="t(`${I18N_KEY}.content.results.result_2.preposition`)"
          :value="t(`${I18N_KEY}.content.results.result_2.value`)"
          color="#1764f6"
          :column-height="386"
          :mobile-column-height="315"
          :bar-height="75"
        />
      </div>
    </template>
  </projects-sections-case-page>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.case-bmw {
  // Палитра кейса: синий BMW
  --project-hero-from: rgb(23 100 246 / 40%);
  --project-hero-to: rgb(23 100 246 / 4%);
  --projects-cta-bg: rgb(140 171 253 / 20%);

  background-color: var(--bg);
}

.case-bmw__results {
  display: flex;
  gap: 8px;

  @include a.tablet {
    flex-direction: column;
  }
}

.case-bmw__rows {
  display: flex;
  flex: 1 1 763px;
  flex-direction: column;
  gap: 8px;

  @include a.tablet {
    flex: none;
  }
}

.case-bmw__big {
  flex: 1 1 549px;

  @include a.tablet {
    // На планшете и мобильном большая карточка идёт первой

    flex: none;
    order: -1;
  }
}
</style>
