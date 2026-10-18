<script setup lang="ts">
import gsap from 'gsap';
import { SERVICE_GROUPS } from '@l-ai-production/configs';

const { t } = useI18n();

const RING_COLORS = {
  hexagon: ['#0b40ff', 'rgb(60 246 225 / 40%)'],
  star: ['#4b72ff', 'rgb(141 25 252 / 35%)'],
  circle: ['#07DBFC', 'rgb(11 64 255 / 35%)'],
} as const;

const rootRef = ref<HTMLElement>();

// Карточки выезжают каскадом, услуги внутри — следом
useGsap(() => {
  if (!rootRef.value) return;

  gsap.from(rootRef.value.querySelectorAll('.ai-services__head > *'), {
    autoAlpha: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: rootRef.value, start: 'top 70%' },
  });

  rootRef.value.querySelectorAll<HTMLElement>('.ai-services__card').forEach((card, i) => {
    gsap.from(card, {
      autoAlpha: 0,
      y: 80,
      rotateX: -12,
      duration: 1,
      delay: (i % 3) * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%' },
    });
    gsap.from(card.querySelectorAll('.ai-services__item'), {
      autoAlpha: 0,
      x: -16,
      stagger: 0.05,
      duration: 0.6,
      delay: 0.25 + (i % 3) * 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 90%' },
    });
  });
});
</script>

<template>
  <section ref="rootRef" class="ai-services container">
    <div class="ai-services__head">
      <p class="ai-chapter-text__label" v-html="t('aiProduction.services.label')" />
      <h2 class="ai-services__title" v-html="t('aiProduction.services.title')" />
      <p class="ai-services__text" v-html="t('aiProduction.services.text')" />
    </div>

    <div class="ai-services__grid">
      <article
        v-for="(group, i) in SERVICE_GROUPS"
        :key="group.key"
        class="ai-services__card"
      >
        <services-molecules-ring-pattern
          class="ai-services__decor"
          :shape="group.shape"
          :colors="[...RING_COLORS[group.shape]]"
        />
        <div class="ai-services__card-head">
          <span class="ai-services__num">0{{ i + 1 }}</span>
          <h3 class="ai-services__card-title" v-html="t(`aiProduction.services.groups.${group.key}.title`)" />
        </div>
        <ul class="ai-services__list">
          <li
            v-for="item in group.items"
            :key="item"
            class="ai-services__item"
            v-html="t(`aiProduction.services.groups.${group.key}.items.${item}`)"
          />
        </ul>
      </article>
    </div>
  </section>
</template>

<style lang="scss">
@use "assets/styles/adaptive" as a;
@use "assets/styles/typography" as t;
@use "assets/styles/shared" as s;

.ai-services {
  position: relative;

  padding-top: 160px;
  padding-bottom: 80px;

  @include a.tablet {
    padding-top: 120px;
  }

  @include a.mobile {
    padding-top: 80px;
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 820px;
    margin-bottom: 56px;

    @include a.mobile {
      gap: 14px;
      margin-bottom: 32px;
    }
  }

  &__title {
    @include t.generate-involve(56px, 500, 1.05em);

    @include a.tablet {
      @include t.generate-involve(40px, 500, 1.1em);
    }

    @include a.mobile {
      @include t.generate-involve(30px, 500, 1.12em);
    }
  }

  &__text {
    @include t.lead-s-medium;

    opacity: 0.8;

    @include a.mobile {
      @include t.body-m-regular;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    perspective: 1200px;

    @include a.tablet {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @include a.mobile {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  &__card {
    @include s.default-transition(transform, box-shadow, background-color);

    position: relative;

    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 380px;
    padding: 32px;
    overflow: hidden;

    background: rgb(255 255 255 / 62%);
    border: 1px solid rgb(255 255 255 / 80%);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgb(12 29 79 / 6%);
    backdrop-filter: blur(18px);

    @include a.tablet {
      min-height: 0;
      padding: 24px;
    }

    @include s.hover {
      background: rgb(255 255 255 / 85%);
      box-shadow: 0 30px 80px rgb(11 64 255 / 14%);
      transform: translateY(-6px);

      .ai-services__decor {
        transform: translate(30%, -30%) rotate(30deg) scale(1.1);
      }
    }
  }

  &__decor {
    position: absolute;
    top: 0;
    right: 0;

    width: 260px;

    transform: translate(35%, -35%);
    transition: transform 0.8s cubic-bezier(0.12, 0.46, 0.47, 0.99);
    pointer-events: none;

    @include a.mobile {
      width: 180px;
    }
  }

  &__card-head {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__num {
    @include t.caption-m-medium;

    color: var(--blue);
  }

  &__card-title {
    @include t.h4;

    @include a.mobile {
      @include t.h5;
    }
  }

  &__list {
    position: relative;

    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
    padding: 0;
  }

  &__item {
    @include t.body-s-medium;

    padding: 8px 14px;

    background: rgb(11 64 255 / 6%);
    border: 1px solid rgb(11 64 255 / 10%);
    border-radius: 100px;
  }
}
</style>
