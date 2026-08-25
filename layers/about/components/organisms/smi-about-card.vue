<script setup lang="ts">
interface IProps {
  name: string;
  title: string;
  text: string;
  link: string;
  logo: string;
  rating?: number;
}

defineProps<IProps>();

const { t } = useI18n();
</script>

<template>
  <div class="smi-about-card">
    <div class="smi-about-card__wrapper">
      <div class="smi-about-card__header">
        <div class="smi-about-card__header-logo">
          <img
            class="smi-about-card__header-icon"
            :src="logo"
            alt="Tagline"
          />
          <p class="smi-about-card__header-name" v-html="name" />
        </div>
      </div>
      <h3 class="smi-about-card__title" v-html="title" />
      <p class="smi-about-card__text" v-html="text" />
      <a
        :href="link"
        target="_blank"
        class="smi-about-card__link"
      >{{ t('aboutPage.smi.button') }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.smi-about-card {
  height: 100%;
  padding: 32px;

  background: rgb(140 171 253 / 5%);
  border: 1px solid rgb(140 171 253 / 20%);
  border-radius: 16px;

  transition: border 0.3s;

  @include s.hover {
    border: 1px solid rgb(140 171 253 / 50%);

   .smi-about-card__link {
    border-bottom: 1px solid transparent;
   }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__header-logo {
    display: flex;
    align-items: center;
  }

  &__header-icon {
    width: 42px;
    height: 42px;
  }

  &__header-name {
    margin-left: 16px;

    @include t.h4;
  }

  &__title {
    margin-top: 32px;

    @include s.max-lines(2);
    @include t.body-l-semi;
  }

  &__text {
    margin-top: 12px;

    @include s.max-lines(6);
    @include t.body-s-medium;

    @include a.mobile {
      @include s.max-lines(9);
    }
  }

  &__link {
    display: block;
    width: max-content;
    margin-top: auto;

    color: var(--dark-blue);

    border-bottom: 1px solid var(--dark-blue);

    transition: border 0.3s;

    @include t.button-s-semi;
  }

  &__header-rating {
    display: flex;
    gap: 2px;
  }

  &__header-rating-star {
    width: 16px;
    height: 16px;

    color: var(--services-yellow);

    &_hide {
      opacity: 0.5;
    }
  }
}
</style>
