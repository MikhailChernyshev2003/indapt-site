<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg';
import { PROJECT_CASES, getProjectHref } from '@l-projects/configs';
import type { ProjectTabKey } from '@l-projects/types';

const { t } = useI18n();

/** Ключи категорий в порядке макета */
const TABS: ProjectTabKey[] = [
  'all',
  'science',
  'transport',
  'trade',
  'health',
  'fintech',
  'industry',
];

/** Активная категория живёт в query — фильтр можно шарить ссылкой */
const activeTab = useRouteQuery<ProjectTabKey>('tab', 'all', {
  transform: value => (TABS.includes(value as ProjectTabKey) ? value : 'all') as ProjectTabKey,
});

const items = computed(() =>
  activeTab.value === 'all'
    ? PROJECT_CASES
    : PROJECT_CASES.filter(item => item.tab === activeTab.value));

const rootRef = useTemplateRef<HTMLElement>('rootRef');

useRiseReveal(rootRef, '.cases-list__row', 0.08);
</script>

<template>
  <!-- Список кейсов с фильтром по отраслям. Ховер строки подращивает
       карточку логотипа — ряд плавно становится выше -->
  <section ref="rootRef" class="cases-list">
    <div class="cases-list__tabs">
      <button
        v-for="tab in TABS"
        :key="tab"
        class="cases-list__tab"
        :class="{ 'cases-list__tab_active': tab === activeTab }"
        type="button"
        @click="activeTab = tab"
      >
        {{ t(`projects.tabs.${tab}`) }}
      </button>
    </div>
    <transition-group
      class="cases-list__rows"
      name="cases-list"
      tag="div"
    >
      <nuxt-link
        v-for="item in items"
        :key="item.slug"
        class="cases-list__row"
        :to="getProjectHref(item.slug)"
      >
        <span class="cases-list__card">
          <img
            class="cases-list__logo"
            :src="item.logo"
            :alt="t(`projects.${item.i18nKey}.title`)"
            :style="{
              width: `${item.logoSize[0] / 16}rem`,
              height: `${item.logoSize[1] / 16}rem`,
            }"
            loading="lazy"
          />
        </span>
        <span class="cases-list__info">
          <span class="cases-list__name" v-html="t(`projects.${item.i18nKey}.title`)" />
          <span class="cases-list__desc" v-html="t(`projects.${item.i18nKey}.text`)" />
          <projects-molecules-case-tag class="cases-list__tag">
            {{ t(`projects.tabs.${item.tab}`) }}
          </projects-molecules-case-tag>
        </span>
        <arrow-up-right-icon class="cases-list__arrow" />
      </nuxt-link>
    </transition-group>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.cases-list {
  @include s.base-container;
}

.cases-list__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @include a.mobile {
    flex-wrap: nowrap;
    margin-right: -20px;
    padding-right: 20px;
    overflow-x: auto;

    @include s.no-scrollbar;
  }
}

.cases-list__tab {
  padding: 12px 24px;

  color: var(--dark-blue);
  white-space: nowrap;

  border: 1px solid var(--dark-blue-20);
  border-radius: 200px;

  @include t.caption-s-semi-140;
  @include s.default-transition(background-color, color, border-color);

  @include s.hover {
    border-color: var(--dark-blue-60);
  }

  &_active {
    color: var(--white);

    background-color: var(--dark-blue);
    border-color: var(--dark-blue);
  }
}

.cases-list__rows {
  display: flex;
  flex-direction: column;
  margin-top: 48px;

  @include a.mobile {
    margin-top: 32px;
  }
}

.cases-list__row {
  position: relative;

  display: flex;
  gap: 32px;
  align-items: center;
  padding: 0;

  @include a.mobile {
    // На мобильном ряд складывается в колонку с широкой карточкой

    flex-direction: column;
    gap: 24px;
    align-items: stretch;
  }

  @include s.hover {
    .cases-list__card {
      width: 488px;
      height: 329px;
    }

    .cases-list__logo {
      transform: scale(1.25);
    }

    .cases-list__desc {
      color: var(--dark-blue);
    }

    .cases-list__arrow {
      transform: rotate(45deg);
    }
  }

  // Разделитель как в макете: тонкая линия между рядами

  &:not(:first-child) {
    border-top: 1px solid var(--dark-blue-20);
  }

  &:not(:first-child) .cases-list__card {
    margin-top: 32px;
  }

  &:not(:first-child) .cases-list__info {
    padding-top: 32px;
  }
}

.cases-list__card {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 445px;
  height: 300px;
  margin: 32px 0;

  background-color: var(--white);
  border-radius: 16px;

  transition: width 0.4s v.$easing, height 0.4s v.$easing;

  @include a.tablet {
    width: 240px;
    height: 240px;
  }

  @include a.mobile {
    width: 100%;
    height: 280px;
    margin: 24px 0 0;
  }
}

.cases-list__logo {
  object-fit: contain;

  transition: transform 0.4s v.$easing;

  @include a.tablet {
    transform: scale(0.81);
  }

  @include a.mobile {
    transform: scale(0.94);
  }
}

.cases-list__info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  max-width: 480px;
  padding: 20px 0;

  @include a.mobile {
    gap: 12px;
    max-width: none;
    padding: 0 0 24px;
  }
}

.cases-list__name {
  color: var(--dark-blue);

  @include t.h5;

  @include a.mobile {
    @include t.body-l-semi;
  }
}

.cases-list__desc {
  color: var(--dark-blue-80);

  @include s.default-transition(color);
  @include t.body-l-medium;

  @include a.mobile {
    @include t.body-xs-medium;
  }
}

.cases-list__tag {
  margin-top: 12px;

  @include a.mobile {
    margin-top: 12px;
  }
}

.cases-list__arrow {
  flex: none;
  width: 32px;
  height: 32px;
  margin-left: auto;

  color: var(--dark-blue);

  transition: transform 0.3s v.$easing;

  @include a.mobile {
    // Стрелка встаёт в ряд с тегом у нижнего края карточки

    position: absolute;
    right: 0;
    bottom: 24px;
  }
}

// Плавная смена набора при фильтрации

.cases-list-enter-active,
.cases-list-leave-active,
.cases-list-move {
  transition: opacity 0.3s, transform 0.3s;
}

.cases-list-leave-active {
  position: absolute;
}

.cases-list-enter-from,
.cases-list-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>
