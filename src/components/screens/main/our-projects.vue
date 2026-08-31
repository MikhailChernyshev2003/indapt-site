<script setup lang="ts">
import { getProjectHref } from '@l-projects/configs';

const { isDesktop } = useDevice();

const { t } = useI18n();

const projects = computed(() => [
  {
    title: t('mainPage.projects.gazprom.title'),
    text: t('mainPage.projects.gazprom.text'),
    icon: '/images/projects/gaz-logo.svg',
    tags: ['PostgreSQL', 'Python', 'TensorFlow'],
    bg: '/images/projects/gaz-bg.png',
    bgTablet: '/images/projects/gaz-bg-tablet.png',
    bgMobile: '/images/projects/gaz-bg-mobile.png',
    shape: '/images/projects/gaz-shape.svg',
    to: getProjectHref('gazprom'),
  },
  {
    title: t('mainPage.projects.bmw.title'),
    text: t('mainPage.projects.bmw.text'),
    icon: '/images/projects/bmw-logo.svg',
    tags: ['Node.js', 'MongoDB', 'React'],
    bg: '/images/projects/bmw-bg.png',
    bgTablet: '/images/projects/bmw-bg-tablet.png',
    bgMobile: '/images/projects/bmw-bg-mobile.png',
    shape: '/images/projects/bmw-shape.svg',
    to: getProjectHref('bmw'),
  },
  {
    title: t('mainPage.projects.university.title'),
    text: t('mainPage.projects.university.text'),
    icon: '/images/projects/university-logo.svg',
    tags: ['Django', 'React', 'Python'],
    bg: '/images/projects/university-bg.png',
    bgTablet: '/images/projects/university-bg-tablet.png',
    bgMobile: '/images/projects/university-bg-mobile.png',
    shape: '/images/projects/university-shape.svg',
    to: getProjectHref('university'),
  },
  {
    title: t('mainPage.projects.kassir.title'),
    text: t('mainPage.projects.kassir.text'),
    icon: '/images/projects/kassir-logo.svg',
    tags: ['Django', 'React', 'Python'],
    bg: '/images/projects/kassir-bg.png',
    bgTablet: '/images/projects/kassir-bg-tablet.png',
    bgMobile: '/images/projects/kassir-bg-mobile.png',
    shape: '/images/projects/kassir-shape.svg',
    to: getProjectHref('kassir'),
  },
]);

const activeShape = ref('/images/projects/gaz-shape.svg');

const handlerActiveShape = (shape: string) => {
  if (!isDesktop.value) return;

  activeShape.value = shape;
};

const handlerActiveShapeForAnim = (shape: string) => {
  activeShape.value = shape;
};

defineExpose({
  handlerActiveShapeForAnim,
});

const renderList = computed(() => {
  if (!isDesktop.value) return [projects.value];

  const matrix = [];
  for (let i = 0; i < projects.value.length; i += 2) {
    matrix.push(projects.value.slice(i, i + 2));
  }
  return matrix;
});
</script>

<template>
  <section class="our-projects">
    <div class="our-projects__container container">
      <div class="our-projects__info">
        <h2 class="our-projects__title">{{ t('mainPage.projects.title') }}</h2>
        <div class="our-projects__content">
          <p class="our-projects__content-text" v-html="t('mainPage.projects.text')" />
          <atoms-button
            class="our-projects__content-button"
            href="/projects"
            mode="secondary"
          >
            {{ t('mainPage.projects.button') }}
          </atoms-button>
        </div>
      </div>
      <div
        v-for="(row, idx) in renderList"
        :key="idx"
        :class="`our-projects__row our-projects__row_${idx}`"
      >
        <OrganismsProjectCard
          v-for="(project, idxCard) in row"
          :key="project.title"
          v-bind="project"
          :class="`our-projects__row-item our-projects__row-item_${idxCard}`"
          @mouseenter="handlerActiveShape(project.shape)"
          @mouseleave="handlerActiveShape('/images/projects/gaz-shape.svg')"
        />
      </div>
    </div>
    <img
      v-for="item in projects"
      :key="item.shape"
      class="our-projects__shape"
      :src="item.shape"
      alt="shape"
      :style="{
        opacity: item.shape === activeShape ? 1 : 0,
      }"
    />
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.our-projects {
  width: 100%;
  min-height: 100vh;
  padding-top: 172px;
  padding-bottom: 120px;

  @include a.tablet {
    padding-top: 110px;
    padding-bottom: 68px;
  }

  @include a.mobile {
    padding-top: 94px;
    padding-bottom: 40px;
  }

  &__container {
    position: relative;
    z-index: 2;
  }

  &__title {
    color: var(--dark-blue);

    @include t.h1;

    @include a.mobile {
      font-size: 28px;
    }

    & * {
      font-family: v.$font-involve;
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    width: 100%;

    @include a.tablet {
      display: block;
    }
  }

  &__content {
    max-width: 652px;
    margin-bottom: 40px;

    @include a.tablet {
      max-width: 580px;
      margin-top: 24px;
      margin-bottom: 68px;
    }

    @include a.mobile {
      margin-top: 16px;
      margin-bottom: 32px;
    }

    &-text {
      @include t.lead-m-medium;

      @include a.mobile {
        @include t.body-s-medium-135;
      }
    }

    &-button {
      margin-top: 24px;

      @include a.tablet {
        margin-top: 40px;
      }

      @include a.mobile {
        margin-top: 24px;
      }
    }
  }

  &__row {
    position: relative;
    z-index: 1;

    display: flex;
    width: 100%;
    margin-bottom: 16px;

    @include a.tablet {
      margin-bottom: 0;
    }

    &-item {
      position: relative;
      z-index: 2;

      width: 652px;
      height: 360px;

      transition: width 0.4s;

      @include s.hover {
        width: 106%;

        .project-card__bg,
        .project-card__text {
          opacity: 1;
        }
      }

      @include a.tablet {
        flex-shrink: 0;
        width: 688px;
      }

      @include a.mobile {
        width: 335px;
        height: 400px;

        .app-tag {
          padding: 10px 18px;

          @include t.caption-s-semi-128;
        }
      }

      &:not(:first-child) {
        margin-left: 16px;
      }
    }
  }

  &__shape {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;

    height: 90vh;

    transition: opacity 1s;

    @include a.tablet {
      left: -20px;

      height: 62vh;

      transition: opacity 0.3s;
    }
  }
}

.our-projects__row_1 .our-projects__row-item_0 .project-card__texts {
  max-width: 420px;

  @include a.tablet {
    max-width: 370px;
  }
}

.our-projects__row_1 .our-projects__row-item_0 .project-card__title {
  max-width: 370px;
}

.our-projects__row_1 .our-projects__row-item_1 .project-card__texts {
  max-width: 360px;

  @include a.tablet {
    max-width: 370px;
  }
}
</style>
