<script setup lang="ts">
const { t, tm, rt } = useI18n();
</script>

<template>
  <section class="structure">
    <div class="structure__wrapper">
      <h2 class="structure__title">{{ t('aboutPage.structure.title') }}</h2>
      <div class="structure__content">
        <molecules-collapse-text
          v-for="(item, idx) in tm('aboutPage.structure.list')"
          :key="idx"
          class="structure__item"
        >
          <template #label>
            <div class="structure__item-title">
              <span>(0{{ idx + 1 }})</span>
              <p v-html="rt(item.label)" />
            </div>
          </template>
          <template #text>
            <div class="structure__item-content">
              <p
                v-for="(el, elIdx) in item.content"
                :key="elIdx"
                class="structure__item-content-el"
                v-html="rt(el)"
              />
            </div>
          </template>
        </molecules-collapse-text>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.structure {
  &__wrapper {
  }

  &__title {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__content {
    margin-top: 52px;

    @include a.tablet {
      margin-top: 50px;
    }

    @include a.mobile {
      margin-top: 34px;
    }
  }

  &__item-title {
    display: flex;

    font-weight: 500;
    font-size: 24px;
    line-height: 118%;

    @include a.mobile {
      flex-direction: column;
      align-items: flex-start;
    }

    span {
      margin-right: 16px;

      color: var(--dark-blue-80);
      font-weight: 500;
      font-size: 18px;
      font-family: v.$font-involve;
      line-height: 140%;

      @include a.mobile {
        margin-right: 0;
        margin-bottom: 10px;

        font-size: 14px;
      }
    }

    p {
      font-weight: 500;
      font-size: 24px;
      font-family: v.$font-involve;
      font-style: normal;
      line-height: 132%;

      @include a.mobile {
        @include t.h6;
      }
    }
  }

  &__item-content {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 24px;

    @include a.tablet {
      grid-gap: 8px;
      grid-template-rows: auto;
      grid-template-columns: 1fr;
      margin-top: 30px;
    }
  }

  &__item-content-el {
    position: relative;
    z-index: 1;

    padding-left: 14px;

    &::before {
      position: absolute;
      top: calc(50% - 3px);
      left: 0;

      width: 6px;
      height: 6px;

      background: var(--dark-blue);
      border-radius: 50%;

      content: '';
    }
  }

  :deep(.collapse-text) {
    border-bottom: 1px solid var(--dark-blue-20);

    &:not(:first-child) {
      .collapse-text__head {
        margin-top: 40px !important;

        @include a.tablet {
          margin-top: 24px !important;
        }
      }
    }

    .collapse-text__head {
      padding-bottom: 8px;

      @include a.tablet {
        padding-top: 4px;
        padding-bottom: 16px;
      }

      @include a.mobile {
        padding-top: 0;
      }
    }

    // Общий collapse-text перевёрстан под макет услуг (отступы ушли в тело блока),
    // здесь возвращаем прежние отступы структуры: 8/8/12px под свёрнутым пунктом
    // и +12px под раскрытым текстом, без верхнего отступа у тела

    .collapse-text__body {
      padding-bottom: 8px;

      transition-property: opacity, grid-template-rows, padding-bottom;

      @include a.mobile {
        padding-bottom: 12px;
      }
    }

    &:last-child .collapse-text__body {
      @include a.mobile {
        padding-bottom: 16px;
      }
    }

    &.collapse-text_open .collapse-text__body {
      padding-top: 0;
      padding-bottom: 20px;

      @include a.mobile {
        padding-bottom: 24px;
      }
    }

    &.collapse-text_open:last-child .collapse-text__body {
      @include a.mobile {
        padding-bottom: 28px;
      }
    }

    .collapse-text__button {
      @include a.mobile {
        width: 24px;
        height: 24px;
        margin-top: 31px;
      }
    }
  }

}
</style>
