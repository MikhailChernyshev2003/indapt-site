<script setup lang="ts">
import { gsap } from 'gsap';

// По правкам фигуры-декорации появляются с «расширением от центра в ширину».
// Масштаб по X растёт от центра, прогресс привязан к прокрутке — триггер
// не может отработать вхолостую до появления блока на экране
const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tween: gsap.core.Tween | null = null;

useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  gsap.set(root, { scaleX: 0.4, opacity: 0, transformOrigin: '50% 50%' });

  tween = gsap.to(root, {
    scaleX: 1,
    opacity: 1,
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
  <div ref="rootRef" class="figure-reveal">
    <slot />
  </div>
</template>
