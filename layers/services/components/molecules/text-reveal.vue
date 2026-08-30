<script setup lang="ts">
import { gsap } from 'gsap';

const { is = 'div' } = defineProps<{
  /** Тег обёртки */
  is?: string;
}>();

// Точные прозрачности приглушённого состояния из раскадровки макета
// («Анимация текста», нода 7563:18372): заголовок 60%, текст 33%
const DIMMED: Record<string, number> = {
  title: 0.6,
  text: 0.33,
};

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tweens: gsap.core.Tween[] = [];

// Как только блок появляется на экране, заголовок и текст становятся
// насыщенными. Триггер общий на блок, прогресс привязан к прокрутке
useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');

  targets.forEach((target) => {
    const from = DIMMED[target.dataset.reveal ?? ''] ?? DIMMED.text;

    gsap.set(target, { opacity: from });

    tweens.push(gsap.to(target, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'top bottom-=30%',
        scrub: true,
      },
    }));
  });
});

onBeforeUnmount(() => {
  tweens.forEach(tween => tween.scrollTrigger?.kill());
  tweens = [];
});
</script>

<template>
  <component
    :is="is"
    ref="rootRef"
    class="text-reveal"
  >
    <slot />
  </component>
</template>
