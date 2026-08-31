<script setup lang="ts">
interface IProps {
  title: string;
  text: string;
  icon: string;
  tags: Array<string>;
  bg: string;
  bgTablet: string;
  bgMobile: string;
  /** Ссылка на страницу кейса */
  to?: string;
}

defineProps<IProps>();

const { isDesktop, isTablet } = useDevice();
</script>

<template>
  <div class="project-card">
    <nuxt-link
      v-if="to"
      class="project-card__link"
      :to="to"
      :aria-label="title"
    />
    <div class="project-card__wrapper">
      <div class="project-card__content">
        <div class="project-card__texts">
          <h3 class="project-card__title" v-html="title" />
          <div class="project-card__text" v-html="text" />
        </div>
        <img
          class="project-card__logo"
          :src="icon"
          :alt="title"
        />
      </div>
      <div class="project-card__tags">
        <AtomsTag
          v-for="tag in tags"
          :key="tag"
          class="project-card__tag"
        >
          {{ tag }}
        </AtomsTag>
      </div>
    </div>
    <img
      v-if="isDesktop"
      class="project-card__bg"
      :src="bg"
      alt="bg"
    />
    <img
      v-else-if="isTablet"
      class="project-card__bg"
      :src="bgTablet"
      alt="bg"
    />
    <img
      v-else
      class="project-card__bg"
      :src="bgMobile"
      alt="bg"
    />
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;

.project-card {
  position: relative;
  z-index: 1;

  display: block;

  padding: 32px;
  overflow: hidden;

  background: var(--white);
  border: 1px solid var(--dark-blue-10);
  border-radius: 16px;

  @include a.mobile {
    padding: 16px;
  }

  // Ссылка накрывает карточку целиком, не мешая ховер-эффектам

  &__link {
    position: absolute;
    inset: 0;

    z-index: 3;
  }

  &__bg {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;

    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right;

    opacity: 0;

    transition: opacity 0.5s;

    @include a.tablet {
      opacity: 1;
    }
  }

  &__logo {
    width: 100px;
    height: 100px;
    object-fit: cover;

    @include a.tablet {
      width: 80px;
      height: 80px;
    }

    @include a.mobile {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;

      width: 60px;
      height: 60px;
    }
  }

  &__wrapper {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__content {
    display: flex;
    justify-content: space-between;

    color: var(--dark-blue);
  }

  &__texts {
    max-width: 370px;

    @include a.mobile {
      max-width: 230px;

      span {
        max-width: 240px;
      }
    }
  }

  &__title {
    margin-bottom: 16px;

    @include t.lead-l-medium;

    @include a.tablet {
      margin-bottom: 8px;
    }

    @include a.mobile {
      @include t.lead-m-medium;
    }
  }

  &__text {
    height: 80px;
    margin-top: 8px;

    opacity: 0;

    transition: opacity 0.5s;

    @include t.body-s-medium-135;

    @include a.tablet {
      opacity: 1;
    }

    span {
      display: block;
      margin-bottom: 8px;

      font-weight: 600;
      font-size: 18px;
      line-height: 128%;

      @include a.mobile {
        @include t.body-s-semi;
      }
    }

    p {
      @include t.body-s-medium;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap-reverse;
    gap: 16px;
    margin-top: auto;

    @include a.mobile {
      gap: 8px;
    }
  }
}
</style>
