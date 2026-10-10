<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg';
import { PROJECT_CASES, getProjectHref } from '@l-projects/configs';
import type { ProjectCaseItem, ProjectTabKey } from '@l-projects/types';

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

/**
 * Размеры логотипа по брейкпоинтам уходят в css-переменные: px в инлайновом
 * style мимо postcss не проходят, поэтому сразу в rem
 */
const toRem = (px: number) => `${px / 16}rem`;

const logoStyle = (item: ProjectCaseItem) => ({
  '--logo-w': toRem(item.logoSize[0]),
  '--logo-h': toRem(item.logoSize[1]),
  '--logo-w-tablet': toRem(item.logoSizeTablet[0]),
  '--logo-h-tablet': toRem(item.logoSizeTablet[1]),
  '--logo-w-mobile': toRem(item.logoSizeMobile[0]),
  '--logo-h-mobile': toRem(item.logoSizeMobile[1]),
});

const rootRef = useTemplateRef<HTMLElement>('rootRef');

useRiseReveal(rootRef, '.cases-list__row', 0.08);
</script>

<template>
  <!-- Список кейсов с фильтром по отраслям. Ховер строки подращивает
       карточку логотипа — ряд плавно становится выше, тег едет вниз за ней -->
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
            :style="logoStyle(item)"
            loading="lazy"
          />
        </span>
        <span class="cases-list__info">
          <span class="cases-list__text">
            <span class="cases-list__name" v-html="t(`projects.${item.i18nKey}.title`)" />
            <span class="cases-list__desc" v-html="t(`projects.${item.i18nKey}.text`)" />
          </span>
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

  // С планшета фильтр в одну строку с прокруткой до края экрана

  @include a.tablet {
    flex-wrap: nowrap;
    margin-right: -40px;
    padding-right: 40px;
    overflow-x: auto;

    @include s.no-scrollbar;
  }

  @include a.mobile {
    margin-right: -20px;
    padding-right: 20px;
  }
}

.cases-list__tab {
  flex: none;

  // С рамкой 1px выходит 44px высоты, как у чипсов макета

  padding: 11px 23px;

  color: var(--dark-blue);
  white-space: nowrap;

  border: 1px solid var(--dark-blue-20);
  border-radius: 200px;

  @include t.caption-s-semi-128;
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
}

// Ряд — сетка: карточка, текст и стрелка. Текст тянется на высоту
// карточки, поэтому тег стоит у её нижнего края. На планшете стрелка
// ложится в колонку текста справа от названия, на мобильном — в строку тега

.cases-list__row {
  position: relative;

  display: grid;
  grid-template-columns: auto 480px 1fr;

  column-gap: 32px;

  @include a.tablet {
    grid-template-columns: 240px 1fr;
  }

  @include a.mobile {
    grid-template-columns: 100%;
    row-gap: 24px;
  }

  @include s.hover {
    .cases-list__desc {
      color: var(--dark-blue);
    }

    .cases-list__arrow {
      transform: rotate(45deg);
    }
  }

  // Карточка растёт только на десктопе: на планшете ей некуда расти

  @include a.desktop-only {
    @include s.hover {
      .cases-list__card {
        width: 488px;
        height: 329px;
      }

      .cases-list__logo {
        transform: scale(1.25);
      }
    }
  }

  // Разделитель как в макете: по 32px до и после тонкой линии

  &:not(:first-child) {
    padding-top: 32px;

    border-top: 1px solid var(--dark-blue-20);
  }

  &:not(:last-child) {
    padding-bottom: 32px;
  }
}

.cases-list__card {
  display: flex;
  grid-area: 1 / 1;
  align-items: center;
  justify-content: center;
  width: 445px;
  height: 300px;

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
  }
}

// Размеры по брейкпоинтам — из конфига кейса через css-переменные

.cases-list__logo {
  width: var(--logo-w);
  height: var(--logo-h);

  object-fit: contain;

  transition: transform 0.4s v.$easing;

  @include a.tablet {
    width: var(--logo-w-tablet);
    height: var(--logo-h-tablet);
  }

  @include a.mobile {
    width: var(--logo-w-mobile);
    height: var(--logo-h-mobile);
  }
}

.cases-list__info {
  display: flex;
  flex-direction: column;
  grid-area: 1 / 2;
  align-items: flex-start;
  justify-content: space-between;
  min-width: 0;
  padding-top: 4px;

  @include a.tablet {
    padding-top: 6px;
  }

  @include a.mobile {
    grid-area: 2 / 1;
    justify-content: flex-start;
    padding-top: 0;
  }
}

.cases-list__text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.cases-list__name {
  color: var(--dark-blue);

  @include t.h3;

  // В макете строка названия зажата в блок 31px по центру —
  // описание подтянуто к нему ближе, чем дал бы line-height

  @include a.desktop-only {
    margin-block: -5px;
  }

  @include a.tablet {
    // Справа от названия стоит стрелка: 32px и отступ 24px

    padding-right: 56px;
  }

  @include a.mobile {
    padding-right: 0;

    @include t.h5;
  }
}

.cases-list__desc {
  color: var(--dark-blue-80);

  @include s.default-transition(color);
  @include t.body-l-medium;

  @include a.mobile {
    @include t.body-s-medium-135;
  }
}

// Тег из макета: рамка внутри размеров, поэтому паддинги на 1px меньше

.cases-list__row .cases-list__tag {
  padding: 9px 23px;

  @include a.tablet {
    padding: 11px 23px;

    @include t.caption-s-semi-128;
  }

  @include a.mobile {
    margin-top: 24px;
    padding: 9px 19px;

    @include t.caption-xs-medium;
  }
}

.cases-list__arrow {
  grid-area: 1 / 3;
  place-self: start end;

  width: 32px;
  height: 32px;
  margin-top: 6px;

  color: var(--dark-blue);

  transition: transform 0.3s v.$easing;

  @include a.tablet {
    grid-area: 1 / 2;
  }

  @include a.mobile {
    // Стрелка встаёт в ряд с тегом: по центру его высоты 38px

    grid-area: 2 / 1;
    place-self: end end;

    margin-top: 0;
    margin-bottom: 3px;
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
