<script setup lang="ts">
import type { IDetailVacancy } from '@l-work/types';

const { t } = useI18n();

interface IProps {
  title: string;
  list: Array<IDetailVacancy>;
}

defineProps<IProps>();
</script>

<template>
  <div class="vacancies-list">
    <div class="vacancies-list__wrapper">
      <h3 class="vacancies-list__title" v-html="title" />
      <div class="vacancies-list__list">
        <AtomsVacancyItem
          v-for="item in list"
          :key="item.title"
          v-bind="item"
          class="vacancies-list__list-item"
        />
      </div>
      <AtomsButton
        class="vacancies-list__button"
        mode="secondary"
        href="/work?scrollToBlock=work__vacancies"
      >
        {{ t('mainPage.vacancies.buttonAll') }}
      </AtomsButton>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.vacancies-list {
  &__title {
    padding-bottom: 20px;

    color: var(--dark-blue);

    border-bottom: 1px solid #17448A66;

    @include t.lead-m-medium;
  }

  &__list {
    &-item {
      opacity: 0.4;

      transition: opacity v.$timing;

      @include a.tablet {
        opacity: 1;
      }

      @include s.hover {
        opacity: 1;
      }
    }
  }

  &__button {
    margin-top: 40px;
  }
}
</style>
