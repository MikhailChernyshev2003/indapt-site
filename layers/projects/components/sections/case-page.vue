<script setup lang="ts">
import type { ProjectCaseItem, ProjectTechBubble, ProjectTechRing } from '@l-projects/types';

const { caseItem } = defineProps<{
  /** Кейс из реестра */
  caseItem: ProjectCaseItem;
  /** Размер логотипа в шапке по макету, px */
  heroLogo: [number, number];
  /** Диаграмма инфраструктуры кейса */
  infra: string;
  /** Пузыри и кольца сцены технологий */
  bubbles: ProjectTechBubble[];
  rings: ProjectTechRing[];
}>();

const { t, te, rt, tm } = useI18n();

const contentKey = computed(() => `projects.${caseItem.i18nKey}.content`);

/** Абзацы проблемы: в локали их переменное число, пустые пропускаются */
const issueTexts = computed(() => {
  const texts = tm(`${contentKey.value}.issue.texts`) as Record<string, unknown>;

  return Object.keys(texts)
    .sort()
    .map(key => rt(texts[key] as string))
    .filter(Boolean);
});

/** Шаги решения; у единственного шага лейбл (info), как в макете */
const solutions = computed(() => {
  const items: { label: string; title: string; text: string }[] = [];

  for (let idx = 1; te(`${contentKey.value}.solution.solution_${idx}.title`); idx++) {
    items.push({
      label: '',
      title: t(`${contentKey.value}.solution.solution_${idx}.title`),
      text: t(`${contentKey.value}.solution.solution_${idx}.text`),
    });
  }

  return items.map((item, idx) => ({
    ...item,
    label: items.length > 1 ? `(${String(idx + 1).padStart(2, '0')})` : '(info)',
  }));
});

const blockRef = useTemplateRef<HTMLElement>('blockRef');

useRiseReveal(blockRef, '.case-page__issue-text, .case-page__infra, .case-page__solution-item');
</script>

<template>
  <div class="case-page">
    <projects-sections-case-hero
      :case-item="caseItem"
      :logo-width="heroLogo[0]"
      :logo-height="heroLogo[1]"
    />
    <div class="case-page__body">
      <div ref="blockRef" class="case-page__block">
        <projects-molecules-case-row :label="t('projects.general.problem')">
          <div class="case-page__issue">
            <p
              v-for="text in issueTexts"
              :key="text"
              class="case-page__issue-text"
              v-html="text"
            />
          </div>
          <img
            class="case-page__infra"
            :src="infra"
            width="985"
            height="357"
            alt=""
            loading="lazy"
          />
        </projects-molecules-case-row>
        <projects-molecules-case-row
          class="case-page__solution"
          :label="t('projects.general.solution')"
        >
          <div
            v-for="solution in solutions"
            :key="solution.label"
            class="case-page__solution-item"
          >
            <div class="case-page__solution-head">
              <span class="case-page__solution-label">{{ solution.label }}</span>
              <h3 class="case-page__solution-title" v-html="solution.title" />
            </div>
            <p class="case-page__solution-text" v-html="solution.text" />
          </div>
        </projects-molecules-case-row>
      </div>
      <projects-sections-case-tech
        :bubbles="bubbles"
        :rings="rings"
        :ring-color="caseItem.techColor"
      />
      <section class="case-page__results">
        <h2 class="case-page__results-title" v-html="t('projects.general.results')" />
        <slot name="results" />
      </section>
    </div>
    <projects-sections-other-cases
      class="case-page__other"
      :current-slug="caseItem.slug"
    />
    <projects-sections-cta-banner class="case-page__cta" />
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.case-page__body {
  display: flex;
  flex-direction: column;
  gap: 120px;
  margin-top: 72px;

  @include s.base-container;

  @include a.tablet {
    gap: 80px;
    margin-top: 56px;
  }

  @include a.mobile {
    gap: 56px;
    margin-top: 40px;
  }
}

.case-page__block {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.case-page__issue {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-page__issue-text {
  max-width: 873px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.body-l-medium;
  }
}

.case-page__infra {
  width: 100%;
  height: auto;

  border-radius: 16px;

  @include a.mobile {
    // На мобильном полоса ниже — диаграмма обрезается по центру

    height: 160px;
    object-fit: cover;
  }
}

.case-page__solution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:not(:first-child) {
    margin-top: 28px;
  }
}

.case-page__solution-head {
  display: flex;
  gap: 16px;
  align-items: baseline;
}

.case-page__solution-label {
  color: var(--dark-blue-60);

  @include t.caption-l-semi;

  @include a.mobile {
    @include t.caption-s-semi-128;
  }
}

.case-page__solution-title {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.body-l-semi;
  }
}

.case-page__solution-text {
  max-width: 873px;

  color: var(--dark-blue-80);

  @include t.body-l-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}

.case-page__results {
  display: flex;
  flex-direction: column;
  gap: 60px;

  @include a.mobile {
    gap: 32px;
  }
}

.case-page__results-title {
  color: var(--dark-blue);

  @include t.h2;

  @include a.mobile {
    font-size: 32px;
  }
}

.case-page__other {
  margin-top: 120px;

  @include a.tablet {
    margin-top: 80px;
  }

  @include a.mobile {
    margin-top: 56px;
  }
}

.case-page__cta {
  margin-top: 120px;
  padding-bottom: 120px;

  @include a.tablet {
    margin-top: 80px;
    padding-bottom: 80px;
  }

  @include a.mobile {
    margin-top: 56px;
    padding-bottom: 96px;
  }
}
</style>
