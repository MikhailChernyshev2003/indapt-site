<script setup lang="ts">
import type { ProjectCaseItem, ProjectTechBubble, ProjectTechRing } from '@l-projects/types';

const { caseItem } = defineProps<{
  /** Кейс из реестра */
  caseItem: ProjectCaseItem;
  /** Размер логотипа в шапке по макету, px */
  heroLogo: [number, number];
  /** Иллюстрация инфраструктуры: десктопная, отдельная мобильная из макета
   * и кадр на планшете — object-position по горизонтали */
  infra: { src: string; mobile: string; tabletPosition: string };
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
          <picture
            class="case-page__infra"
            :style="{ '--infra-tablet-position': infra.tabletPosition }"
          >
            <source
              media="(max-width: 576px)"
              :srcset="infra.mobile"
              width="335"
              height="160"
            />
            <img
              class="case-page__infra-img"
              :src="infra.src"
              width="985"
              height="357"
              alt=""
              loading="lazy"
            />
          </picture>
        </projects-molecules-case-row>
        <projects-molecules-case-row
          class="case-page__solution"
          :label="t('projects.general.solution')"
        >
          <div class="case-page__solutions">
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

// Кольца сцены технологий по макету выходят за правый край экрана:
// их должен резать край страницы, а не растягивать документ

.case-page {
  overflow-x: clip;
}

.case-page__body {
  display: flex;
  flex-direction: column;
  gap: 120px;
  margin-top: 72px;

  @include s.base-container;

  @include a.tablet {
    margin-top: 60px;
  }

  @include a.mobile {
    gap: 80px;
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

  @include a.mobile {
    gap: 10px;
  }
}

// Текст проблемы в макете набран Involve, как заголовки

.case-page__issue-text {
  max-width: 873px;

  color: var(--dark-blue);

  @include t.h5;

  @include a.mobile {
    @include t.h6;
  }
}

.case-page__infra {
  display: block;
  overflow: hidden;

  border-radius: 16px;
}

.case-page__infra-img {
  display: block;
  width: 100%;
  height: auto;

  @include a.tablet {
    // На планшете плашка той же высоты, что на десктопе, а сцена
    // кадрируется по ширине — у каждого кейса свой кадр из макета

    height: 357px;
    object-fit: cover;
    object-position: var(--infra-tablet-position, 0) center;
  }

  @include a.mobile {
    // На мобильном своя картинка из макета под плашку 335x160

    height: auto;
  }
}

.case-page__solutions {
  display: flex;
  flex-direction: column;
  gap: 28px;

  @include a.mobile {
    gap: 24px;
  }
}

.case-page__solution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @include a.mobile {
    gap: 6px;
  }
}

.case-page__solution-head {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @include a.mobile {
    // На мобильном номер шага стоит отдельной строкой над заголовком

    flex-direction: column;
    gap: 20px;
  }
}

.case-page__solution-label {
  flex: none;

  color: var(--dark-blue-60);

  @include t.caption-l-semi;
}

.case-page__solution-title {
  color: var(--dark-blue);

  @include t.h5;

  @include a.mobile {
    @include t.h6;
  }
}

.case-page__solution-text {
  max-width: 873px;

  color: var(--dark-blue-80);

  @include t.body-l-medium;
}

.case-page__results {
  display: flex;
  flex-direction: column;
  gap: 60px;

  @include a.mobile {
    // В макете у заголовка в две строки рамка ниже текста — по видимому
    // тексту до карточек 32px

    gap: 32px;
  }
}

.case-page__results-title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.tablet {
    @include t.h2;
  }

  @include a.mobile {
    @include t.h3;
  }
}

.case-page__other {
  margin-top: 120px;

  @include a.mobile {
    margin-top: 80px;
  }
}

.case-page__cta {
  margin-top: 120px;
  padding-bottom: 120px;

  @include a.mobile {
    margin-top: 80px;
    padding-bottom: 96px;
  }
}
</style>
