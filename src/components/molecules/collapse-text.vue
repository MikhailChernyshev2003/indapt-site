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
          <svgo-plus class="collapse-text__button-icon" />
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
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/shared" as s;

// Отступы по макету услуг: от разделителя до следующего пункта 16px,
// от текста (или свёрнутого заголовка) до разделителя тоже 16px.
// Нижний отступ держит тело блока — он есть и у свёрнутого пункта.
// На планшете и мобильном линия есть и под последним пунктом группы

.collapse-text {
  @include a.tablet {
    border-bottom: 1px solid var(--dark-blue-20);
  }

  &:not(:first-of-type) .collapse-text__head {
    margin-top: 16px;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--dark-blue-20);
  }
}

.collapse-text_open {
  .collapse-text__button-icon {
    transform: rotate(135deg);
  }

  .collapse-text__body {
    grid-template-rows: 1fr;
    padding-top: 16px;

    opacity: 1;

    @include a.mobile {
      padding-top: 8px;
    }
  }
}

// Список без кнопок: описание стоит вплотную к заголовку (8px),
// на десктопе раскрывается при наведении, на планшете и мобильном раскрыто всегда

.collapse-text_hover {
  @include a.desktop-only {
    @include s.hover {
      .collapse-text__body {
        grid-template-rows: 1fr;
        padding-top: 8px;

        opacity: 1;
      }
    }
  }

  @include a.tablet {
    .collapse-text__body {
      grid-template-rows: 1fr;
      padding-top: 8px;

      opacity: 1;
    }
  }
}

.collapse-text__head {
  display: flex;
  gap: 28px;
  align-items: center;
  justify-content: space-between;
}

.collapse-text__label {
  color: var(--dark-blue);

  @include t.body-l-medium;

  @include a.mobile {
    @include t.body-m-medium;
  }
}

.collapse-text__button {
  flex-shrink: 0;
  width: 28px;
  height: 28px;

  color: var(--dark-blue);

  @include a.mobile {
    width: 20px;
    height: 20px;
  }

  &-icon {
    width: inherit;
    height: inherit;

    transition: transform .15s ease;
  }
}

.collapse-text__body {
  display: grid;
  grid-template-rows: 0fr;
  padding-bottom: 16px;

  opacity: 0;

  transition: .3s ease;
  transition-property: opacity, grid-template-rows, padding-top;

  &-inner {
    min-height: 0;
    overflow: hidden;

    color: var(--dark-blue-80);

    @include t.body-s-medium;
  }
}
</style>
