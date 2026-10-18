<script setup lang="ts">
import gsap from 'gsap';
import { NUMBERS } from '@l-ai-production/configs';

const { t } = useI18n();

const rootRef = ref<HTMLElement>();

// Числа доращиваются с нуля; нечисловые значения («24/7») просто проявляются
useGsap(() => {
  if (!rootRef.value) return;

  gsap.from(rootRef.value.querySelectorAll('.ai-numbers__item, .ai-numbers__title, .ai-chapter-text__label'), {
    autoAlpha: 0,
    y: 50,
    stagger: 0.08,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: rootRef.value, start: 'top 70%' },
  });

  rootRef.value.querySelectorAll<HTMLElement>('.ai-numbers__value').forEach((el) => {
    const raw = el.textContent ?? '';
    const match = raw.match(/^(\d+)(\D*)$/);

    if (!match) return;

    const num = Number(match[1]);
    const suffix = match[2];
    const counter = { n: 0 };
    el.textContent = `0${suffix}`;

    gsap.to(counter, {
      n: num,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => {
        el.textContent = `${Math.round(counter.n)}${suffix}`;
      },
    });
  });
});
</script>

<template>
  <section ref="rootRef" class="ai-numbers container">
    <p class="ai-chapter-text__label" v-html="t('aiProduction.numbers.label')" />
    <h2 class="ai-numbers__title" v-html="t('aiProduction.numbers.title')" />
    <div class="ai-numbers__grid">
      <div
        v-for="key in NUMBERS"
        :key="key"
        class="ai-numbers__item"
      >
        <span class="ai-numbers__value">{{ t(`aiProduction.numbers.items.${key}.value`) }}</span>
        <span class="ai-numbers__text" v-html="t(`aiProduction.numbers.items.${key}.text`)" />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@use "assets/styles/adaptive" as a;
@use "assets/styles/typography" as t;

.ai-numbers {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 120px;
  padding-bottom: 120px;

  @include a.mobile {
    padding-top: 80px;
    padding-bottom: 80px;
  }

  &__title {
    @include t.generate-involve(56px, 500, 1.05em);

    max-width: 820px;
    margin-bottom: 36px;

    @include a.tablet {
      @include t.generate-involve(40px, 500, 1.1em);
    }

    @include a.mobile {
      @include t.generate-involve(30px, 500, 1.12em);

      margin-bottom: 16px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @include a.tablet {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 24px;

    border-top: 1px solid rgb(12 29 79 / 15%);
  }

  &__value {
    @include t.generate-involve(88px, 500, 1em);

    color: transparent;

    background: linear-gradient(270deg, #0c1d4f -3.9%, #4b72ff 47.79%, #8fa9ff 94.29%);
    background-clip: text;

    @include a.tablet {
      @include t.generate-involve(64px, 500, 1em);
    }

    @include a.mobile {
      @include t.generate-involve(48px, 500, 1em);
    }
  }

  &__text {
    @include t.body-m-medium;

    max-width: 240px;

    opacity: 0.75;
  }
}
</style>
