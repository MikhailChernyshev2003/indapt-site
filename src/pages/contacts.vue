<script setup lang="ts">
import gsap from 'gsap';

const { t } = useI18n();

useSeoMeta({
  title: t('contactsPage.title'),
});

onMounted(async () => {
  await nextTick();

  // Основной email (.email__item) идёт в общей очереди появления, иначе он стоял
  // на месте раньше заголовка «(Email)» и остальных адресов
  gsap.set(['.address__title', '.address__list-item', '.email__title', '.email__item', '.email__list-item'], {
    opacity: 0,
    y: 30,
  });

  gsap.to(['.contacts-page'], {
    opacity: 1,
    duration: 0.2,
  });

  gsap.to(['.address__title', '.address__list-item', '.email__title', '.email__item', '.email__list-item'], {
    opacity: 1,
    y: 0,
    duration: 0.4,
    stagger: 0.1,
    delay: 0.2,
  });
});
</script>

<template>
  <div class="contacts-page">
    <div class="contacts-page__wrapper">
      <h1 class="contacts-page__title">{{ t('contactsPage.title') }}</h1>
      <ScreensContactsAddress class="contacts-page__address" />
      <ScreensContactsEmail class="contacts-page__email" />
      <ScreensContactsMap class="contacts-page__map" />
      <ScreensContactsBanner class="contacts-page__banner" />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;

.contacts-page {
  width: 100%;

  opacity: 0;

  &__wrapper {
    padding: 160px 60px 104px;

    @include a.tablet {
      padding: 168px 40px 104px;
    }

    @include a.mobile {
      padding: 112px 20px 40px;
    }
  }

  &__title {
    color: var(--dark-blue);

    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__address {
    margin-top: 20px;

    @include a.tablet {
      margin-top: 48px;
    }

    @include a.mobile {
      margin-top: 24px;
    }
  }

  &__map {
    margin-top: 42px;

    @include a.tablet {
      margin-top: 52px;
    }

    @include a.mobile {
      margin-top: 40px;
    }
  }

  &__banner {
    margin-top: 104px;

    @include a.mobile {
      margin-top: 80px;
    }
  }
}
</style>
