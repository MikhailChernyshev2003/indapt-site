<script setup lang="ts">
definePageMeta({
  layout: false,
});

const heroBackground = ref();
const isCameraReady = ref(false);
const cameraControlsRef = ref<any>(null);

const handleCameraReady = (_cameraControls: any) => {
  cameraControlsRef.value = _cameraControls;
  isCameraReady.value = true;

  if (isCameraReady.value && heroBackground.value) {
    heroBackground.value.polygonBg.polygonMaterial.uniforms.u_opacity.value = 1.0;
    heroBackground.value.polygonBg.polygonMaterial.uniforms.u_radius.value = 0.1;
    heroBackground.value.polygonBg.polygonMaterial.uniforms.u_cornerRadius.value = 0.788;
  }
};
</script>

<template>
  <screens-main-hero-background
    ref="heroBackground"
    @camera-ready="handleCameraReady"
  />
</template>
