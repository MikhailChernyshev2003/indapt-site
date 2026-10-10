<script setup lang="ts">
import { PROJECT_TECH, getProjectCase } from '@l-projects/configs';
import Infra from '@l-projects/assets/images/infra/gazprom.webp';
import InfraMobile from '@l-projects/assets/images/infra/gazprom-mobile.webp';

const SLUG = 'gazprom';
const I18N_KEY = `projects.${SLUG}`;

const { t } = useI18n();

const caseItem = getProjectCase(SLUG)!;
const tech = PROJECT_TECH[SLUG];

useSeoMeta({
  title: () => `${t(`${I18N_KEY}.title`)}`,
});

/** Карточки с линейными графиками: ключ и форма кривой из макета */
const LINE_RESULTS = [
  { key: 'result_1', variant: 'dip' },
  { key: 'result_3', variant: 'step' },
] as const;

// Высоты столбцов правой карточки из макета
const COLUMNS = [60, 80, 70, 120, 130, 140, 150, 170, 200];
</script>

<template>
  <projects-sections-case-page
    class="case-gazprom"
    :case-item="caseItem"
    :hero-logo="[115, 193]"
    :infra="{ src: Infra, mobile: InfraMobile, tabletPosition: '44%' }"
    :bubbles="tech.bubbles"
    :rings="tech.rings"
  >
    <template #results>
      <div class="case-gazprom__results">
        <div class="case-gazprom__lines">
          <projects-molecules-stat-line-card
            v-for="line in LINE_RESULTS"
            :key="line.key"
            :text="t(`${I18N_KEY}.content.results.${line.key}.text`)"
            :value="t(`${I18N_KEY}.content.results.${line.key}.value`)"
            color="#0095ef"
            :variant="line.variant"
          />
        </div>
        <article class="case-gazprom__columns-card">
          <p class="case-gazprom__columns-text" v-html="t(`${I18N_KEY}.content.results.result_2.text`)" />
          <projects-molecules-chart-columns
            :heights="COLUMNS"
            color="#0095ef"
            line-color="#1764f6"
          />
        </article>
      </div>
    </template>
  </projects-sections-case-page>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.case-gazprom {
  // Палитра кейса: голубой «Газпромнефти»
  --project-hero-from: rgb(0 149 239 / 40%);
  --project-hero-to: rgb(0 149 239 / 4%);
  --projects-cta-bg: rgb(140 171 253 / 20%);

  background-color: var(--bg);
}

.case-gazprom__results {
  display: flex;
  gap: 8px;

  @include a.tablet {
    flex-direction: column;
  }
}

.case-gazprom__lines {
  display: flex;
  flex: 1 1 652px;
  flex-direction: column;
  gap: 8px;

  @include a.tablet {
    flex: none;
  }
}

.case-gazprom__columns-card {
  display: flex;
  flex: 1 1 660px;
  flex-direction: column;
  gap: 66px;
  justify-content: space-between;
  min-height: 460px;
  padding: 40px;
  overflow: hidden;

  background-color: var(--white);
  border-radius: 16px;

  @include a.tablet {
    // На планшете и мобильном карточка со столбиками идёт первой

    flex: none;
    order: -1;
  }

  @include a.mobile {
    gap: 40px;
    min-height: 0;
    padding: 24px;
  }
}

.case-gazprom__columns-text {
  color: var(--dark-blue);

  @include t.lead-l-medium-120;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}
</style>
