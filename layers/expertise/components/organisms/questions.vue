<script setup lang="ts">
import { expertiseQuestions, expertiseQuestionsEng } from '@l-expertise/configs/questions';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animationBgImage } from '~/shared/animation/animationBgImage';

const activeTab = defineModel<string>('active');
const { locale } = useI18n();

const localeExpertiseQuestions = computed(() => {
  if (locale.value === 'ru') {
    return expertiseQuestions;
  }

  return expertiseQuestionsEng;
});

useGsap({
  desktop: () => animationBgImage('.questions', '.questions__decor'),
  tablet: () => animationBgImage('.case__content-footer', '.questions__decor'),
  mobile: () => animationBgImage('.case__content-footer', '.questions__decor', 'center top'),
});

watch(activeTab, () => {
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);
});
</script>

<template>
  <section class="questions">
    <h2 class="questions__title">Q&A</h2>
    <div :key="activeTab" class="questions__list">
      <expertise-molecules-collapse-text
        v-for="(item, key) in localeExpertiseQuestions[activeTab] || localeExpertiseQuestions.industry"
        :key="key"
        icon="arrow"
      >
        <template #label><span v-html="item.label" /></template>
        <template #text>
          <div v-if="Array.isArray(item.text)" class="questions__item-paragraphs">
            <p
              v-for="(paragraph, index) in item.text"
              :key="index"
              class="questions__item-paragraph"
              v-html="paragraph"
            />
          </div>
          <p v-else v-html="item.text" />
        </template>
      </expertise-molecules-collapse-text>
    </div>
    <img
      class="questions__decor"
      src="@l-expertise/assets/images/questions/decor.png"
      alt="decor"
    />
    <img
      class="questions__decor questions__decor_t"
      src="@l-expertise/assets/images/questions/decor-t.png"
      alt="decor"
    />

    <img
      class="questions__decor questions__decor_m"
      src="@l-expertise/assets/images/questions/decor-m.png"
      alt="decor"
    />
  </section>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.questions {
  position: relative;

  display: grid;
  grid-gap: 16px;
  grid-template-columns: 429px 875px;

  @include a.tablet {
    grid-gap: 0;
    grid-template-columns: 1fr;
  }
}

.questions__list {
  @include a.desktop-only {
    padding-right: 84px;
  }
}

.questions__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.tablet {
    margin-bottom: 60px;
  }

  @include a.mobile {
    margin-bottom: 36px;

    @include t.h4;
  }
}

.questions__decor {
  position: absolute;
  top: 75px;
  left: -60px;

  width: 546px;

  transform-origin: left;

  pointer-events: none;

  @include a.tablet {
    display: none;
  }

  &_t {
    display: none;

    @include a.tablet {
      top: -246px;
      right: -40px;
      left: auto;

      display: block;

      width: 268px;

      transform-origin: right;
    }

    @include a.mobile {
      display: none;
    }
  }

  &_m {
    display: none;

    @include a.mobile {
      top: -122px;
      right: -20px;
      left: auto;

      display: block;

      width: 156px;

      transform-origin: right;
    }
  }
}
</style>
