<script setup lang="ts">
// Блок назван service-tile, а не service-card: у карточки услуг
// на главной (src/components/atoms/service-card.vue) стили глобальные,
// и одноимённые классы пересекались бы
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg';
import { getServiceHref } from '@l-services/configs';
import type { ServiceItem } from '@l-services/types';

const { service } = defineProps<{
  service: ServiceItem;
}>();

const { t } = useI18n();

const href = computed(() => getServiceHref(service));
const label = computed(() => t(`services.services.${service.labelKey}`));
</script>

<template>
  <nuxt-link
    :to="href"
    class="service-tile"
    :style="{ '--card-color': service.color, '--card-bg': service.bg }"
  >
    <h3 class="service-tile__title" v-html="label" />
    <span class="service-tile__arrow">
      <arrow-up-right-icon class="service-tile__arrow-icon" />
    </span>
    <img
      class="service-tile__image"
      :src="service.image"
      :alt="''"
      loading="lazy"
    />
  </nuxt-link>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.service-tile {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
  padding: 24px 20px 20px;
  overflow: hidden;

  color: var(--dark-blue);

  background-color: var(--service-tile-bg, #f3f2f5);
  border-radius: 20px;

  @include s.default-transition(background-color, color);

  @include s.hover {
    color: var(--card-color);

    background-color: var(--card-bg);

    .service-tile__image {
      opacity: 1;
    }

    .service-tile__arrow {
      color: var(--dark-blue);

      border-color: rgb(12 29 79 / 20%);
    }
  }
}

.service-tile__title {
  position: relative;
  z-index: 1;

  max-width: 200px;

  color: inherit;

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

.service-tile__arrow {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  color: inherit;

  border: 1px solid var(--dark-blue-30);
  border-radius: 50%;

  @include s.default-transition(border-color);

  &-icon {
    width: 20px;
    height: 20px;

    :deep(path) {
      fill: currentcolor;
    }
  }
}

.service-tile__image {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 0;

  width: 200px;
  height: auto;

  opacity: 0;

  @include s.default-transition(opacity);

  @include a.tablet {
    width: 170px;
  }

  @include a.mobile {
    width: 140px;
  }
}
</style>
