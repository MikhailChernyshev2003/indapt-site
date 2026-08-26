<script setup lang="ts">
import type { ServiceDescGroup, ServiceDescPaths } from '@l-services/types';

const { i18nKey, groups, paths = {} } = defineProps<{
  /** Базовый ключ услуги, например services.analyticsPlanning */
  i18nKey: string;
  /** Группы блока в порядке вывода */
  groups: ServiceDescGroup[];
  /** Имена ключей в локали, если они отличаются от принятых по умолчанию */
  paths?: ServiceDescPaths;
}>();

const { t } = useI18n();

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
  <section class="desc-services">
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
        <div class="desc-services__list">
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

.desc-services {
  @include s.base-container;
}

.desc-services__group {
  display: grid;
  grid-template-columns: 4fr 8fr;

  // По макету: до заголовка 40px у первой группы и 56px у остальных
  // (там сверху разделитель), снизу 28px

  padding-top: 40px;
  padding-bottom: 28px;

  @include a.tablet {
    grid-template-columns: 116px 1fr;
  }

  @include a.mobile {
    grid-template-columns: 52px 1fr;
    padding-top: 32px;
    padding-bottom: 24px;
  }

  &:not(:first-child) {
    padding-top: 56px;

    border-top: 1px solid var(--dark-blue-20);

    @include a.mobile {
      padding-top: 40px;
    }
  }
}

.desc-services__number {
  color: var(--dark-blue-50);

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
  margin-top: 16px;

  color: var(--dark-blue);

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

  // Общий компонент оставляет под телом блока 20px (12 + 8),
  // в макете 16 — снимаем разницу здесь, не трогая сам компонент
  @include a.desktop-only {
    :deep(.collapse-text) {
      padding-bottom: 4px;
    }
  }
}
</style>
