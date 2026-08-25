<script setup>
onMounted(async () => {
  await nextTick();

  document.body.classList.add('after-init');
});
</script>

<template>
  <div class="__app">
    <organisms-header />
    <wrappers-scroll-to-top>
      <main class="__main">
        <slot />
      </main>
    </wrappers-scroll-to-top>
    <organisms-footer />
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;

.__main {
  position: relative;
  z-index: 0;

  overflow: visible !important;

  background: var(--bg);

  isolation: isolate;
}
</style>
