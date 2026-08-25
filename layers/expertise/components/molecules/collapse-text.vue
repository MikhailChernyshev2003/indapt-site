<script setup lang="ts">
const {
  openType = 'click',
} = defineProps<{
  openType?: 'click' | 'hover';
}>();

const isOpen = defineModel<boolean>('open', {
  default: false,
});

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <client-only>
    <div
      class="collapse-text"
      :class="{
        'collapse-text_open': isOpen && openType === 'click',
        'collapse-text_hover': openType === 'hover',
      }"
    >
      <div class="collapse-text__head" @click="toggleOpen">
        <h4 class="collapse-text__label"><slot name="label" /></h4>
        <button
          v-if="openType === 'click'"
          class="collapse-text__button"
          type="button"
        >
          <svgo-arrow class="collapse-text__button-icon" />
        </button>
      </div>
      <div class="collapse-text__body">
        <div class="collapse-text__body-inner">
          <slot name="text" />
        </div>
      </div>
    </div>
  </client-only>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;

.collapse-text {
  padding-bottom: 24px;

  @include a.mobile {
    padding-bottom: 16px;
  }

  &:not(:first-of-type) .collapse-text__head {
    margin-top: 24px;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid;
    border-image: linear-gradient(90deg, #053478 0%, #8CABFD 52.6%) 1;
  }
}

.collapse-text_open {
  .collapse-text__button-icon {
    transform: rotate(180deg);
  }

  .collapse-text__body {
    grid-template-rows: 1fr;
    padding-bottom: 8px;

    opacity: 1;
  }
}

.collapse-text_hover {
  @include a.desktop-only {
    @include s.hover {
      .collapse-text__button-icon {
        transform: rotate(135deg);
      }

      .collapse-text__body {
        grid-template-rows: 1fr;
        padding-bottom: 12px;

        opacity: 1;
      }
    }
  }

  @include a.tablet {
    .collapse-text__body {
      grid-template-rows: 1fr;

      opacity: 1;
    }
  }
}

.collapse-text__head {
  display: flex;
  align-items: flex-start;
  padding-bottom: 8px;

  transition: opacity 0.15s;

  @include s.hover {
    opacity: 0.6;
  }

  @include a.mobile {
    justify-content: space-between;
    padding-top: 0;
    padding-bottom: 8px;
  }
}

.collapse-text__label {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.tablet {
    @include t.lead-m-medium;
  }

  @include a.mobile {
    max-width: 275px;

    @include t.body-m-medium;
  }
}

.collapse-text__button {
    width: 44px;
    height: 44px;
    padding: 10px;

    color: var(--dark-blue);

    background: rgb(255 255 255 / 40%);
    border-radius: 50%;

  &-icon {
    width: 24px;
    height: 24px;

    transition: transform .25s ease;
  }
}

.collapse-text__body {
  display: grid;
  grid-template-rows: 0fr;

  opacity: 0;

  transition: .3s ease;
  transition-property: opacity, grid-template-rows, padding-bottom;

  &-inner {
    max-width: 700px;
    min-height: 0;
    overflow: hidden;

    color: var(--dark-blue);

    @include t.body-m-medium;

    @include a.mobile {
      @include t.body-s-medium-135
    }
  }
}
</style>
