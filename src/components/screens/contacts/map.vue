<script setup lang="ts">
import { SUBSIDIARIES, SUBSIDIARIES_ENG } from '~/shared/constants/contacts';

const { locale } = useI18n();

const activeSubsidiaryId = ref(1);

const localeList = computed(() => {
  if (locale.value === 'ru') {
    return SUBSIDIARIES;
  }
  return SUBSIDIARIES_ENG;
});

const activeSubsidiary = computed(() =>
  localeList.value.find(el => el.id === activeSubsidiaryId.value)!,
);
</script>

<template>
  <section class="map">
    <div class="map__wrapper">
      <client-only>
        <organisms-map-viewer :subsidiary="activeSubsidiary" />
      </client-only>

      <organisms-subsidiary-dropdown
        :subsidiaries="localeList"
        :active-id="activeSubsidiaryId"
        @update:active-id="activeSubsidiaryId = $event"
      />
    </div>
  </section>
</template>

<style lang="scss">
.map {
  position: relative;
  z-index: 1;

  &__wrapper {
    position: relative;
  }
}
</style>
