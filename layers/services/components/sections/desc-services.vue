<script setup lang="ts">
import type { ServiceDescGroup, ServiceDescPaths } from '@l-services/types';

const { i18nKey, groups, paths = {}, revealOnHover = false } = defineProps<{
  /** Базовый ключ услуги, например services.analyticsPlanning */
  i18nKey: string;
  /** Группы блока в порядке вывода */
  groups: ServiceDescGroup[];
  /** Имена ключей в локали, если они отличаются от принятых по умолчанию */
  paths?: ServiceDescPaths;
  /**
   * Пункты простым списком без аккордеона и иконок (макет «Маркетинга»):
   * на десктопе описание раскрывается при наведении, на планшете
   * и мобильном видны все. Под каждым пунктом и под последней группой — линия
   */
  revealOnHover?: boolean;
}>();

const { t } = useI18n();
const { isDesktop } = useDevice();

/**
 * Раскрытый при наведении пункт в каждой группе. По макету десктопа
 * в каждой группе раскрыт первый; наведение и фокус переносят раскрытие
 * на другой пункт, и он остаётся раскрытым, пока не выбран следующий —
 * группа почти не меняет высоту, блоки ниже не прыгают
 */
const activeItems = ref(groups.map(() => 0));

const setActiveItem = (groupIdx: number, itemIdx: number) => {
  activeItems.value[groupIdx] = itemIdx;
};

/**
 * Состояние раскрытых блоков по группам.
 * В макете первый блок каждой группы открыт по умолчанию.
 */
const openState = ref(
  groups.map(group => group.collapses.map((_, idx) => idx === 0)),
);

const groupNumber = (idx: number) => `(0${idx + 1})`;

const keys = computed(() => ({
  root: paths.root ?? 'descServices',
  desc: paths.desc ?? 'desc',
  collapseLabel: paths.collapseLabel ?? 'title',
  collapseText: paths.collapseText ?? 'desc',
}));

/** Базовый путь до группы */
const groupPath = (key: string) => `${i18nKey}.${keys.value.root}.${key}`;
</script>

<template>
  <section class="desc-services" :class="{ 'desc-services_reveal': revealOnHover }">
    <article
      v-for="(group, groupIdx) in groups"
      :key="group.key"
      class="desc-services__group"
    >
      <span class="desc-services__number">{{ groupNumber(groupIdx) }}</span>
      <div class="desc-services__content">
        <h2 class="desc-services__title">
          {{ t(`${groupPath(group.key)}.title`) }}
        </h2>
        <p
          v-if="group.hasDesc"
          class="desc-services__desc"
          v-html="t(`${groupPath(group.key)}.${keys.desc}`)"
        />
        <ul v-if="revealOnHover" class="desc-services__items">
          <!-- Фокус с клавиатуры раскрывает пункт так же, как наведение -->
          <li
            v-for="(collapse, itemIdx) in group.collapses"
            :key="collapse"
            class="desc-services__item"
            :class="{ 'desc-services__item_active': activeItems[groupIdx] === itemIdx }"
            :tabindex="isDesktop ? 0 : undefined"
            @mouseenter="setActiveItem(groupIdx, itemIdx)"
            @focusin="setActiveItem(groupIdx, itemIdx)"
          >
            <h3 class="desc-services__item-label">
              {{ t(`${groupPath(group.key)}.${collapse}.${keys.collapseLabel}`) }}
            </h3>
            <div class="desc-services__item-body">
              <div class="desc-services__item-clip">
                <p
                  class="desc-services__item-text"
                  v-html="t(`${groupPath(group.key)}.${collapse}.${keys.collapseText}`)"
                />
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="desc-services__list">
          <molecules-collapse-text
            v-for="(collapse, collapseIdx) in group.collapses"
            :key="collapse"
            v-model:open="openState[groupIdx][collapseIdx]"
          >
            <template #label>
              {{ t(`${groupPath(group.key)}.${collapse}.${keys.collapseLabel}`) }}
            </template>
            <template #text>
              <p v-html="t(`${groupPath(group.key)}.${collapse}.${keys.collapseText}`)" />
            </template>
          </molecules-collapse-text>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.desc-services {
  @include s.base-container;
}

.desc-services__group {
  // Колонка номера по макету: 429px + 16px до текста (текст 875px),
  // на планшете — 118px. На мобильном у страниц по-разному: у «Аналитики»
  // 56px, у «Маркетинга» 52px, поэтому значение можно переопределить.
  // Значение по умолчанию внутри var() в rem: postcss-pxtorem туда не заходит

  display: grid;
  grid-template-columns: 445px 1fr;

  // По макету: до заголовка 40px у первой группы и 56px у остальных
  // (там сверху разделитель), снизу 28px

  padding-top: 40px;
  padding-bottom: 28px;

  @include a.tablet {
    grid-template-columns: 118px 1fr;
  }

  // На мобильном по макету «Аналитики» от полосы над блоком до первой
  // группы 32px, из них 16px — отступ самого блока на странице

  @include a.mobile {
    grid-template-columns: var(--desc-services-aside-mobile, 3.5rem) 1fr; // 56px
    padding-top: 16px;
    padding-bottom: 24px;
  }

  &:not(:first-child) {
    padding-top: 56px;

    border-top: 1px solid var(--dark-blue-20);

    @include a.mobile {
      padding-top: 40px;
    }
  }

  // Список заканчивается линией под последним пунктом, от неё до
  // разделителя групп и от разделителя до заголовка — по 52px (40 на мобильном).
  // После последней группы в макете тоже есть разделитель

  .desc-services_reveal & {
    padding-bottom: 52px;

    @include a.mobile {
      padding-bottom: 40px;
    }

    &:not(:first-child) {
      padding-top: 52px;

      @include a.mobile {
        padding-top: 40px;
      }
    }

    &:last-child {
      border-bottom: 1px solid var(--dark-blue-20);
    }
  }
}

.desc-services__number {
  color: var(--dark-blue-60);

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.desc-services__title {
  color: var(--dark-blue);

  @include t.h3;

  @include a.mobile {
    @include t.h5;
  }
}

.desc-services__desc {
  // Ширина переноса задаётся страницей: у «Маркетинга» абзац уже колонки

  max-width: var(--desc-services-desc-max-width, none);
  margin-top: 16px;

  color: var(--dark-blue-80);

  @include t.body-m-medium;

  @include a.mobile {
    margin-top: 12px;

    @include t.body-s-medium;
  }
}

.desc-services__list {
  // По макету от заголовка до первого раскрывающегося блока 28px

  margin-top: 28px;

  @include a.mobile {
    margin-top: 20px;
  }
}

// По макету от подводки группы до первого пункта 32px (24 на мобильном),
// пункты отбиты линиями с воздухом 16px с обеих сторон

.desc-services__items {
  margin-top: 32px;

  @include a.mobile {
    margin-top: 24px;
  }
}

.desc-services__item {
  padding: 16px 0;

  border-bottom: 1px solid var(--dark-blue-20);

  &:first-child {
    padding-top: 0;
  }
}

.desc-services__item-label {
  color: var(--dark-blue);

  @include t.body-l-medium;

  @include a.mobile {
    @include t.body-m-medium;
  }
}

// Описание раскрывается по высоте и прозрачности одновременно: строка
// сетки 0fr → 1fr даёт плавную высоту без замеров, кривая и длительность —
// как у раскрытия карточек архитектуры. На планшете и мобильном описания
// видны все, поэтому свёрнутое состояние задано только для десктопа

.desc-services__item-body {
  display: grid;
  grid-template-rows: 1fr;

  @include a.desktop-only {
    grid-template-rows: 0fr;

    opacity: 0;

    transition:
      grid-template-rows 0.4s v.$easing,
      opacity 0.4s v.$easing;

    .desc-services__item_active & {
      grid-template-rows: 1fr;

      opacity: 1;
    }
  }
}

.desc-services__item-clip {
  min-height: 0;
  overflow: hidden;
}

// Отступ от подписи внутри обрезаемой обёртки: у свёрнутого пункта он
// схлопывается вместе с текстом, и строка остаётся высотой 26px, как в макете

.desc-services__item-text {
  padding-top: 8px;

  color: var(--dark-blue-80);

  @include t.body-s-medium;
}
</style>
