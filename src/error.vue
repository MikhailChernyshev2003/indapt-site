<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const { t } = useI18n();

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return t('errorPage.notFound');
  }

  return '';
});

const handlerError = () => clearError({ redirect: '/' });

// error.vue рендерится без layouts/default.vue, поэтому класс, снимающий position: fixed с body,
// никто не ставит — при прямом заходе на 404 страница не скроллилась и футер был обрезан.
onMounted(() => {
  document.body.classList.add('after-init');
});
</script>

<template>
  <div class="error">
    <organisms-header />
    <div class="error__content">
      <h1 class="error__content-header">
        {{ t('errorPage.title', { code: props.error?.statusCode || '' }) }}
      </h1>
      <p class="error__content-description">{{ errorMessage }}</p>
      <atoms-button
        mode="secondary"
        class="error__content-button"
        @click="handlerError"
      >
        {{ t('errorPage.backToHome') }}
      </atoms-button>
    </div>
    <atoms-picture
      class="error__picture"
      src="/images/error/bg.png"
      src-t="/images/error/bg-t.png"
      src-m="/images/error/bg-m.png"
    />
    <organisms-footer class="error__footer" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;

.error {
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-height: 100vh;

  padding-top: 208px;
  overflow-x: hidden;

  background-color: var(--bg);

  @include a.tablet {
    padding-top: 344px;
  }

  @include a.mobile {
    padding-top: 237px;
  }
}

.error__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 750px;
  height: 300px;

  text-align: center;

  &-header {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &-description {
    margin-top: 12px;

    @include t.h5;

    @include a.mobile {
      margin-top: 0;

      @include t.body-s-semi;
    }
  }

  &-button {
    margin-top: 24px;

    @include a.mobile {
      margin-top: 20px;
    }
  }
}

.error__picture {
  width: 100%;
  max-width: 1146px;
}

// Не 100vw: с классическим скроллбаром футер вылезал за край и обрезался по бокам

.error__footer {
  width: 100%;
}
</style>
