<script setup lang="ts">
const { chapter, revealClass = 'ai-reveal' } = defineProps<{
  /** Ключ главы в aiProduction */
  chapter: string;
  /** Класс, по которому таймлайн находит строки главы */
  revealClass?: string;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="ai-chapter-text">
    <p :class="['ai-chapter-text__label', revealClass]" v-html="t(`aiProduction.${chapter}.label`)" />
    <h2 :class="['ai-chapter-text__title', revealClass]" v-html="t(`aiProduction.${chapter}.title`)" />
    <p :class="['ai-chapter-text__text', revealClass]" v-html="t(`aiProduction.${chapter}.text`)" />
    <slot />
  </div>
</template>

<style lang="scss">
@use "assets/styles/adaptive" as a;
@use "assets/styles/typography" as t;

.ai-chapter-text {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 520px;

  @include a.tablet {
    gap: 14px;
    max-width: 600px;
  }

  &__label {
    @include t.caption-m-medium;

    color: var(--blue);
    letter-spacing: 0.08em;
    text-transform: uppercase;

    .ai-page_dark & {
      color: #3CF6E1;
    }
  }

  &__title {
    @include t.generate-involve(52px, 500, 1.06em);

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
}
</style>
