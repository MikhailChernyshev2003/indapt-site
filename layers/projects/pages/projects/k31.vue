<script setup lang="ts">
import { PROJECT_TECH, getProjectCase } from '@l-projects/configs';
import Infra from '@l-projects/assets/images/infra/k31.webp';
import InfraMobile from '@l-projects/assets/images/infra/k31-mobile.webp';

const SLUG = 'k31';
const I18N_KEY = `projects.${SLUG}`;

const { t } = useI18n();

const caseItem = getProjectCase(SLUG)!;
const tech = PROJECT_TECH[SLUG];

useSeoMeta({
  title: () => `${t(`${I18N_KEY}.title`)}`,
});

// Высоты столбцов графика из макета
const SERIES_PRIMARY = [80, 100, 80, 120, 100, 145, 125, 160, 120, 80, 120, 140, 100];
const SERIES_SECONDARY = [40, 51, 40, 61, 51, 76, 65, 84, 61, 40, 61, 72, 51];
</script>

<template>
  <projects-sections-case-page
    class="case-k31"
    :case-item="caseItem"
    :hero-logo="[186, 86]"
    :infra="{ src: Infra, mobile: InfraMobile, tabletPosition: '20%' }"
    :bubbles="tech.bubbles"
    :rings="tech.rings"
  >
    <template #results>
      <div class="case-k31__results">
        <article class="case-k31__chart-card">
          <div class="case-k31__chart-head">
            <p class="case-k31__chart-text" v-html="t(`${I18N_KEY}.content.results.result_1.text`)" />
            <projects-molecules-stat-value
              :preposition="t(`${I18N_KEY}.content.results.result_1.preposition`)"
              :value="t(`${I18N_KEY}.content.results.result_1.value`)"
            />
          </div>
          <projects-molecules-chart-series
            :primary="SERIES_PRIMARY"
            :secondary="SERIES_SECONDARY"
            color="#ff7f18"
            :mobile-count="6"
          />
        </article>
        <projects-molecules-stat-big-card
          class="case-k31__big"
          :text="t(`${I18N_KEY}.content.results.result_2.text`)"
          :preposition="t(`${I18N_KEY}.content.results.result_2.preposition`)"
          :value="t(`${I18N_KEY}.content.results.result_2.value`)"
          color="#ff7f18"
          :column-height="310"
          :bar-height="91"
          :track-opacity="0.4"
          :fade-to="0.04"
        />
      </div>
    </template>
  </projects-sections-case-page>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.case-k31 {
  // Палитра кейса: оранжевый К+31
  --project-hero-from: rgb(241 132 44 / 40%);
  --project-hero-to: rgb(241 132 44 / 4%);
  --projects-cta-bg: rgb(140 171 253 / 20%);

  background-color: #fffaf4;
}

.case-k31__results {
  display: flex;
  gap: 8px;

  @include a.tablet {
    flex-direction: column;
  }
}

// Карточка с двухрядным графиком: текст и значение в одну строку

.case-k31__chart-card {
  display: flex;
  flex: 1 1 763px;
  flex-direction: column;
  gap: 24px;
  padding: 40px;

  background-color: var(--white);
  border-radius: 16px;

  @include a.tablet {
    flex: none;
  }

  @include a.mobile {
    padding: 24px;
  }
}

// Значение по макету: на десктопе сразу за колонкой текста, на планшете у правого края

.case-k31__chart-head {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @include a.tablet {
    justify-content: space-between;
  }

  @include a.mobile {
    flex-direction: column;
  }
}

.case-k31__chart-text {
  flex: 0 1 401px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.tablet {
    flex-basis: 326px;
  }

  @include a.mobile {
    flex: none;

    @include t.lead-s-medium;
  }
}

.case-k31__big {
  flex: 1 1 549px;

  @include a.tablet {
    flex: none;
  }
}
</style>
