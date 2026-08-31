<script setup lang="ts">
import { PROJECT_TECH, getProjectCase } from '@l-projects/configs';
import Infra from '@l-projects/assets/images/infra/zaslon.svg?url';

const SLUG = 'zaslon';
const I18N_KEY = `projects.${SLUG}`;

const { t } = useI18n();

const caseItem = getProjectCase(SLUG)!;
const tech = PROJECT_TECH[SLUG];

useSeoMeta({
  title: () => `${t(`${I18N_KEY}.title`)}`,
});

/** Карточки с линейными графиками: ключ и маркер на кривой из макета */
const LINE_RESULTS = [
  { key: 'result_2', dotX: 198 },
  { key: 'result_3', dotX: 224 },
];
</script>

<template>
  <projects-sections-case-page
    class="case-zaslon"
    :case-item="caseItem"
    :hero-logo="[202, 193]"
    :infra="Infra"
    :bubbles="tech.bubbles"
    :rings="tech.rings"
  >
    <template #results>
      <div class="case-zaslon__results">
        <projects-molecules-stat-big-card
          class="case-zaslon__big"
          :text="t(`${I18N_KEY}.content.results.result_1.text`)"
          :preposition="t(`${I18N_KEY}.content.results.result_1.preposition`)"
          :value="t(`${I18N_KEY}.content.results.result_1.value`)"
          color="#f32941"
          :column-height="380"
          :bar-height="311"
        />
        <div class="case-zaslon__lines">
          <projects-molecules-stat-line-card
            v-for="line in LINE_RESULTS"
            :key="line.key"
            :text="t(`${I18N_KEY}.content.results.${line.key}.text`)"
            :value="t(`${I18N_KEY}.content.results.${line.key}.value`)"
            color="#f32941"
            :dot-x="line.dotX"
          />
        </div>
      </div>
    </template>
  </projects-sections-case-page>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.case-zaslon {
  // Палитра кейса: красный «Заслона»
  --project-hero-from: rgb(243 41 65 / 25%);
  --project-hero-to: rgb(243 41 65 / 4%);
  --project-hero-logo-radius: 16px;
  --projects-cta-bg: rgb(140 171 253 / 20%);

  background-color: #fdf5f5;
}

.case-zaslon__results {
  display: flex;
  gap: 8px;

  @include a.tablet {
    flex-direction: column;
  }
}

.case-zaslon__big {
  flex: 1 1 660px;

  @include a.tablet {
    flex: none;
  }
}

.case-zaslon__lines {
  display: flex;
  flex: 1 1 652px;
  flex-direction: column;
  gap: 8px;

  @include a.tablet {
    flex: none;
  }
}
</style>
