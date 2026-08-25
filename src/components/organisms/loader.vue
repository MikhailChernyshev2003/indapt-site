<template>
  <div class="loader">
    <img src="/loader.gif" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000000;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  background: var(--bg);
  transform-origin: center;

  img {
    width: 300px;
    height: 300px;
  }
}
</style>
