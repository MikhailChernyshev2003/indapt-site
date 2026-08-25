<script setup>
const { isAppLoading, setAppLoading } = useAppLoader();

useHead({
  meta: [
    { name: 'twitter:image', content: '/images/sharing/2.jpg', tagPriority: -1 },
    { property: 'og:image', content: '/images/sharing/2.jpg', tagPriority: -1 },
    { name: 'twitter:card', content: 'summary_large_image', tagPriority: 1 },
  ],
});

const LOADER_ANIMATION_DURATION = 1400;

useNuxtApp().hook('page:start', () => {
  setAppLoading(true);
});

useNuxtApp().hook('page:finish', () => {
  const loadingStartTime = Date.now() - (performance.timing?.navigationStart || 0);

  const remainingTime = Math.max(0, LOADER_ANIMATION_DURATION - loadingStartTime);

  setTimeout(() => {
    setAppLoading(false);
  }, remainingTime);
});
</script>

<template>
  <organisms-loader v-if="isAppLoading" class="app__loader" />

  <nuxt-layout>
    <nuxt-page />
    <organisms-cookies />
  </nuxt-layout>
</template>
