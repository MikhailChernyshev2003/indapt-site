<script setup lang="ts">
import { vacancies } from '../../configs/vacancies';
import { vacanciesEng } from '../../configs/vacanciesEng';

const { t, locale } = useI18n();

const emits = defineEmits(['openForm']);

const langVacancies = computed(() => {
  const map = {
    ru: vacancies,
    en: vacanciesEng,
  };

  return map[locale.value];
});

const handlerOpenForm = (title: string) => {
  emits('openForm', title);
};
</script>

<template>
  <section class="vacancies">
    <div class="vacancies__wrapper">
      <h2 class="vacancies__title">{{ t('workPage.vacancies.title') }}</h2>
      <div class="vacancies__list">
        <work-organisms-vacancy
          v-for="(item, idx) in langVacancies"
          :key="idx"
          v-bind="item"
          class="vacancies__list-item"
          @open-form="handlerOpenForm(item.title)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.vacancies {
  &__title {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__list {
    margin-top: 64px;

    @include a.tablet {
      margin-top: 40px;
    }

    @include a.mobile {
      margin-top: 30px;
    }

    &-item {
      &:not(:first-child) {
        margin-top: 15px;

        @include a.mobile {
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
