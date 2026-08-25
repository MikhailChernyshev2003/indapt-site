<script setup lang="ts">
import type { IDetailVacancy } from '@l-work/types';
import { vacancies } from '@l-work/configs/vacancies';
import { vacanciesEng } from '@l-work/configs/vacanciesEng';

const { t, locale } = useI18n();

const outputIdVacancies = [1, 3, 10];

const { isMobile } = useDevice();

const list = computed((): IDetailVacancy[] => {
  const localeVacancies = locale.value === 'ru' ? vacancies : vacanciesEng;
  return [...localeVacancies].filter((el: IDetailVacancy) => outputIdVacancies.includes(el.id));
});
</script>

<template>
  <section class="vacancies">
    <div class="vacancies__container container">
      <div class="vacancies__info">
        <h3 class="vacancies__info-title" v-html="t('mainPage.vacancies.title')" />
        <p class="vacancies__info-text" v-html="t('mainPage.vacancies.text')" />
        <AtomsButton
          class="vacancies__info-button"
          mode="text"
          href="/work"
        >
          {{
            isMobile
              ? t('mainPage.vacancies.buttonM')
              : t('mainPage.vacancies.button')
          }}
        </AtomsButton>
      </div>
      <div class="vacancies__list">
        <OrganismsVacanciesList
          :title="t('mainPage.vacancies.titleList')"
          :list="list"
          class="vacancies__list-content"
        />
        <div class="vacancies__shape-wrapper">
          <molecules-decor-shape-2 class="vacancies__shape-img" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.vacancies {
  &__container {
    position: relative;
    z-index: 2;

    display: flex;
    justify-content: space-between;
    width: 100vw;
    padding-top: 142px;
    padding-bottom: 120px;

    pointer-events: none;

    @include a.tablet {
      display: block;
      padding-top: 110px;
      padding-bottom: 80px;
    }

    @include a.mobile {
      padding-top: 94px;
      padding-bottom: 40px;
    }
  }

  &__info {
    width: 608px;

    pointer-events: none;

    @include a.mobile {
      width: 100%;
    }

    &-title {
      color: var(--dark-blue);

      @include t.h1;

      @include a.mobile {
        font-size: 30px;
      }
    }

    &-text {
      width: 100%;
      margin-top: 20px;

      color: var(--dark-blue);

      @include t.lead-m-medium;

      @include a.tablet {
        width: 100%;
        margin-top: 24px;
      }

      @include a.mobile {
        @include t.body-s-medium-135;
      }
    }

    &-button {
      margin-top: 40px;

      pointer-events: all;

      @include a.mobile {
        margin-top: 24px;
      }
    }
  }

  &__list {
    width: 652px;
    margin-top: 88px;

    pointer-events: all;

    @include s.hover {
      .vacancies__shape-img {
        transform: scale(0.63);
      }
    }

    @include a.tablet {
      width: 100%;
      margin-top: 56px;
    }

    .vacancies-list {
      position: relative;
      z-index: 2;
    }
  }

  &__shape {
    &-wrapper {
      position: absolute;
      top: 50%;
      right: -10%;
      z-index: 1;

      width: 842px;

      transform: translateY(-50%);

      @include s.hover {
        .vacancies__shape-img {
          transform: scale(0.63);
        }
      }

      @include a.tablet {
        top: unset;
        right: -50%;
        bottom: 0;

        width: 924px;

        transform: translateY(30%);
      }

      @include a.mobile {
        right: -91%;

        width: 650px;

        transform: translateY(10%);
      }
    }

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;

      transition: transform 0.5s;
    }
  }
}
</style>
