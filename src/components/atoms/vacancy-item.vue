<script setup lang="ts">
import type { IDetailVacancy } from '@l-work/types';
import ArrowIcon from '~/assets/icons/arrow-up-right-compact.svg';

const { id, title, format } = defineProps<IDetailVacancy>();
</script>

<template>
  <nuxt-link :to="`/work?scrollTo=${id}`" class="vacancy-item">
    <div class="vacancy-item__wrapper">
      <div class="vacancy-item__info">
        <p class="vacancy-item__title" v-html="title" />
        <p class="vacancy-item__format" v-html="format" />
      </div>
      <div class="vacancy-item__arrow">
        <div class="vacancy-item__arrow-icon-wrapper">
          <arrow-icon class="vacancy-item__arrow-icon" />
          <arrow-icon class="vacancy-item__arrow-icon" />
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.vacancy-item {
  color: var(--dark-blue);

  @include s.hover {
    .vacancy-item {
      &__arrow {
        transform: scale(1.1);
        opacity: 1;
      }

      &__arrow-icon {
        transition: transform 0.3s ease-in-out;

        &:nth-child(1) {
          transform: translate(150%, -150%);
        }

        &:nth-child(2) {
          transform: translate(0, 0);
        }
      }
    }
  }

  &__wrapper {
    display: flex;

    justify-content: space-between;
    padding: 16px 0 20px;

    border-bottom: 1px solid #17448a;
  }

  &__title {
    @include t.body-l-medium;

    @include a.mobile {
      @include t.body-m-medium;
    }
  }

  &__format {
    margin-top: 8px;

    @include t.caption-s-semi-140;
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-top: auto;

    // opacity: 0;

    color: var(--dark-blue);

    border: 1px solid var(--dark-blue-20);
    border-radius: 50%;

    transform-origin: bottom left;
    opacity: 0;

    transition: transform 0.15s ease;

    &-icon-wrapper {
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 12px;
      height: 12px;
      overflow: hidden;
    }

    &-icon {
      position: absolute;

      width: 12px;
      height: 12px;

      &:nth-child(2) {
        transform: translate(-150%, 150%);
      }
    }
  }
}
</style>
