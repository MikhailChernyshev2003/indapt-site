<script setup lang="ts">
import { PROJECT_TECH, getProjectCase } from '@l-projects/configs';
import Infra from '@l-projects/assets/images/infra/kassir.webp';
import InfraMobile from '@l-projects/assets/images/infra/kassir-mobile.webp';

const SLUG = 'kassir';
const I18N_KEY = `projects.${SLUG}`;

const { t } = useI18n();

const caseItem = getProjectCase(SLUG)!;
const tech = PROJECT_TECH[SLUG];

useSeoMeta({
  title: () => `${t(`${I18N_KEY}.title`)}`,
});

/** Строки результатов слева: ключи локали в порядке макета,
 * последняя подпись в макете набрана на всю ширину строки */
const ROW_RESULTS = [
  { key: 'result_1' },
  { key: 'result_3' },
  { key: 'result_4', wide: true },
];

// Жёлтые стрелки-тренды — цвет кейса
const TREND_COLOR = '#ffc627';
</script>

<template>
  <projects-sections-case-page
    class="case-kassir"
    :case-item="caseItem"
    :hero-logo="[207, 207]"
    :infra="{ src: Infra, mobile: InfraMobile, tabletPosition: '34%' }"
    :bubbles="tech.bubbles"
    :rings="tech.rings"
  >
    <template #results>
      <div class="case-kassir__results">
        <div class="case-kassir__rows">
          <projects-molecules-stat-row
            v-for="row in ROW_RESULTS"
            :key="row.key"
            :text="t(`${I18N_KEY}.content.results.${row.key}.text`)"
            :value="t(`${I18N_KEY}.content.results.${row.key}.value`)"
            :color="TREND_COLOR"
            :wide="row.wide"
          />
        </div>
        <article class="case-kassir__chart-card">
          <p class="case-kassir__chart-text" v-html="t(`${I18N_KEY}.content.results.result_2.text`)" />
          <projects-molecules-chart-compare
            before-value="10%"
            after-value="50%"
            :badge="t(`${I18N_KEY}.content.results.badge`)"
            color="#ffc627"
          />
        </article>
      </div>
    </template>
  </projects-sections-case-page>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.case-kassir {
  // Палитра кейса: жёлтый «Кассира»
  --project-hero-from: rgb(255 198 39 / 40%);
  --project-hero-to: rgb(255 198 39 / 4%);
  --project-hero-logo-radius: 32px;
  --projects-cta-bg: rgb(140 171 253 / 20%);

  background-color: #fffdf2;
}

.case-kassir__results {
  display: flex;
  gap: 8px;

  @include a.tablet {
    flex-direction: column;
  }
}

.case-kassir__rows {
  display: flex;
  flex: 1 1 763px;
  flex-direction: column;
  gap: 8px;

  @include a.tablet {
    flex: none;
  }
}

.case-kassir__chart-card {
  display: flex;
  flex: 1 1 549px;
  flex-direction: column;
  gap: 19px;
  justify-content: space-between;
  min-height: 489px;
  padding: 40px;

  background-color: var(--white);
  border-radius: 16px;

  @include a.tablet {
    // На планшете и мобильном карточка с графиком идёт первой

    flex: none;
    order: -1;
  }

  @include a.mobile {
    gap: 60px;
    min-height: 0;
    padding: 24px;
  }
}

.case-kassir__chart-text {
  max-width: 469px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.tablet {
    max-width: none;
  }

  @include a.mobile {
    @include t.lead-s-medium;
  }
}
</style>
