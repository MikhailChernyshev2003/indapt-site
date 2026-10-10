<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="in-progress">
    <div class="in-progress__content">
      <atoms-picture
        class="in-progress__content-image"
        src="/images/in-progress/decor.png"
      />
      <h1 class="in-progress__content-title">{{ t('inProgressPage.title') }}</h1>
      <atoms-button
        mode="secondary"
        class="in-progress__content-button"
        @click="navigateTo('/')"
      >
        {{ t('inProgressPage.backToHome') }}
      </atoms-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;

// Ширина 100%, а не 100vw: 100vw включает классический скроллбар (Windows)
// и давал горизонтальную прокрутку

.in-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  min-height: 100vh;

  padding-top: 225px;
  padding-bottom: 185px;

  background-color: var(--bg);

  @include a.tablet {
    padding-top: 275px;
    padding-bottom: 235px;
  }

  @include a.mobile {
    padding-top: 182px;
    padding-bottom: 150px;
  }
}

.in-progress__content {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-image {
    width: 363px;
    height: auto;

    @include a.mobile {
      width: 100%;
      max-width: 285px;
    }
  }

  &-title {
    margin-top: 20px;

    @include t.h1;

    @include a.mobile {
      margin-top: 14px;

      @include t.h4;
    }
  }

  &-button {
    margin-top: 32px;
  }
}
</style>
