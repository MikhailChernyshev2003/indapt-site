<script setup lang="ts">
import { shallowRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapMarker,
  VueYandexMaps,
} from 'vue-yandex-maps';
import type { Subsidiary } from '~/types/contacts';
import { LANG_MAP } from '~/shared/constants/lang';

const map = shallowRef<null | YMap>(null);
const theme = ref<'light' | 'dark'>('dark');

const { locale } = useI18n();

defineProps<{
  subsidiary: Subsidiary;
}>();

onMounted(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  theme.value = media.matches ? 'dark' : 'light';

  media.addEventListener('change', (e) => {
    theme.value = e.matches ? 'dark' : 'light';
  });

  VueYandexMaps.settings.value.lang = LANG_MAP[locale.value];
});
</script>

<template>
  <section class="map-block">
    <div class="map-block__wrapper">
      <client-only>
        <yandex-map
          v-model="map"
          :settings="{
            location: {
              center: [subsidiary.coordinates.lat, subsidiary.coordinates.long],
              zoom: 16,
            },
            theme: theme,
          }"
          :cursor-grab="true"
        >
          <yandex-map-default-scheme-layer />
          <yandex-map-default-features-layer />

          <yandex-map-marker
            :settings="{
              coordinates: [subsidiary.coordinates.lat, subsidiary.coordinates.long],
            }"
          >
            <div class="marker">
              <div class="marker__icon" />
            </div>
          </yandex-map-marker>
        </yandex-map>
      </client-only>
    </div>
  </section>
</template>

<style lang="scss">
.map-block {
  position: relative;
  z-index: 1;

  width: 100%;
  height: 600px;
  overflow: hidden;

  border: none;
  border-radius: 16px;

  &__wrapper {
    position: relative;
    z-index: 0;

    width: 100%;
    height: 100%;
  }

  .map-container {
    position: relative;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  .marker {
    position: absolute;

    transform: translate(-50%, -50%);

    &__icon {
      width: 65px;
      height: 65px;

      background-image: url('@/assets/icons/contacts/map-marker.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
}
</style>
