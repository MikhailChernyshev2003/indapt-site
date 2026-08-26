<script setup lang="ts">
import { SERVICES } from '@l-services/configs';

const { currentSlug } = defineProps<{
  /** Услуга текущей страницы — её карточку не показываем */
  currentSlug?: string;
}>();

const { t } = useI18n();

const items = computed(() =>
  SERVICES.filter(service => service.slug !== currentSlug),
);
</script>

<template>
  <section class="other-services">
    <h2 class="other-services__title" v-html="t('services.services.title')" />
    <div class="other-services__list">
      <services-molecules-service-tile
        v-for="service in items"
        :key="service.slug"
        :service="service"
        class="other-services__item"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.other-services {
  @include s.base-container;

  // На десктопе заголовок занимает первую ячейку сетки и стоит в одном
  // ряду с карточками, поэтому секция сама является сеткой
  @include a.desktop-only {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

.other-services__title {
  align-self: start;

  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

.other-services__list {
  @include a.desktop-only {
    display: contents;
  }

  // На планшете и мобильном карточки прокручиваются вбок,
  // ряд выходит за контейнер и обрезается краем экрана
  @include a.tablet {
    display: flex;
    gap: 16px;
    margin-top: 40px;
    margin-right: -40px;
    padding-right: 40px;
    overflow-x: auto;

    @include s.no-scrollbar;
  }

  @include a.mobile {
    gap: 12px;
    margin-top: 24px;
    margin-right: -20px;
    padding-right: 20px;
  }
}

.other-services__item {
  @include a.tablet {
    flex: 0 0 318px;
  }

  @include a.mobile {
    flex-basis: 300px;
  }
}
</style>
