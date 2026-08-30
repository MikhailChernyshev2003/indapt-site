<script setup lang="ts">
import { gsap } from 'gsap';

const {
  src,
  width,
  height,
  radius = 16,
  contain = false,
} = defineProps<{
  /** Путь к картинке */
  src: string;
  /** Размеры файла в px по макету (@1x): держат место до загрузки */
  width: number;
  height: number;
  /** Скругление рамки по макету */
  radius?: number;
  /** Картинка вписывается в рамку целиком, а не кроется */
  contain?: boolean;
}>();

const rootRef = useTemplateRef<HTMLElement>('rootRef');

// По правкам из макета фигура раскрывается от центра в ширину. Раскрытие
// делает clip-path, а не scaleX: маска не растягивает содержимое картинки.
// Прогресс привязан к прокрутке — триггер не может отработать вхолостую
// до того, как блок попадёт на экран
const CLIP_FROM = 'inset(0% 50% 0% 50%)';
const CLIP_TO = 'inset(0% 0% 0% 0%)';

let tween: gsap.core.Tween | null = null;

useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  gsap.set(root, { clipPath: CLIP_FROM });

  tween = gsap.to(root, {
    clipPath: CLIP_TO,
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: 'top bottom-=30%',
      scrub: true,
    },
  });
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween = null;
});
</script>

<template>
  <div
    ref="rootRef"
    class="reveal-image"
    :style="{ '--reveal-image-radius': `${radius / 16}rem` }"
  >
    <img
      class="reveal-image__img"
      :class="{ 'reveal-image__img_contain': contain }"
      :src="src"
      :width="width"
      :height="height"
      alt=""
      loading="lazy"
    />
  </div>
</template>

<style scoped lang="scss">
.reveal-image {
  overflow: hidden;

  border-radius: var(--reveal-image-radius, 1rem);
}

.reveal-image__img {
  display: block;
  width: 100%;
  height: auto;

  &_contain {
    object-fit: contain;
  }
}
</style>
