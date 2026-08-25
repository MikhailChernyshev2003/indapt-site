<script setup lang="ts">
defineProps<{
  src: string;
  srcT?: string;
  srcM?: string;
  webp?: string;
  webpT?: string;
  webpM?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}>();

const pictureRef = useTemplateRef<HTMLPictureElement>('pictureRef');

defineExpose({
  target: pictureRef,
});
</script>

<template>
  <picture ref="pictureRef" class="image-container">
    <source :srcset="srcM" media="(max-width: 767px)" />
    <source :srcset="srcT" media="(max-width: 1023px)" />
    <source
      v-if="webp"
      :srcset="webp"
      type="image/webp"
      class="image-content"
    />
    <source
      v-if="webp"
      :srcset="webpM"
      type="image/webp"
      class="image-content"
      media="(max-width: 767px)"
    />
    <source
      v-if="webp"
      :srcset="webpT"
      type="image/webp"
      class="image-content"
      media="(max-width: 1023px)"
    />
    <img
      :src="src"
      :alt="alt || ''"
      class="image-content"
      :loading="loading || 'lazy'"
      :fetchpriority="fetchPriority || 'auto'"
    />
  </picture>
</template>

<style scoped>
.image-container {
  position: relative;

  display: block;
  width: 100%;
  height: auto;
}

.image-content {
  width: inherit;
  height: inherit;
  object-fit: inherit;
}
</style>
