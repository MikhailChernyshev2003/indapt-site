<script setup>
onMounted(async () => {
  await nextTick();

  document.body.classList.remove('after-init');
});
</script>

<template>
  <div class="__anim">
    <organisms-header class="anim__header" />
    <main class="__main">
      <slot />
    </main>
    <organisms-footer class="anim__footer" />
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;

.__anim {
  position: fixed;

  width: 100%;

  opacity: 0;
}

.anim__footer {
  display: none;
}

.__main {
  position: relative;
  z-index: 0;

  overflow: hidden;

  background: var(--bg);

  isolation: isolate;
}
</style>
