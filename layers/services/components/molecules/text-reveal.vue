<script setup lang="ts">
import { gsap } from 'gsap';

const { is = 'div' } = defineProps<{
  /** Тег обёртки */
  is?: string;
}>();

const { isAppLoading } = useAppLoader();

// Раскадровки макета. «Анимация текста» (7563:18372): как только блок появляется
// на экране, заголовок и текст становятся насыщенными — из 60% и 33%.
// Раскадровка дизайна (7563:15200): дополнительные абзацы вводного блока
// проявляются из невидимости и подъезжают снизу на 39px
const DIMMED = {
  title: 0.6,
  text: 0.33,
};
const PARAGRAPH_SHIFT = 39;

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let timeline: gsap.core.Timeline | null = null;
let stopWaiting: (() => void) | null = null;

const pick = (kind: string) =>
  [...(rootRef.value?.querySelectorAll<HTMLElement>(`[data-reveal="${kind}"]`) ?? [])];

// Проигрывается один раз, когда блок входит в экран. Для блоков, видимых сразу
// после загрузки, это момент, когда уходит прелоадер: под ним текст всё равно
// не виден, а появление должен увидеть пользователь
const play = () => {
  const root = rootRef.value;

  if (!root) return;

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top bottom-=10%',
      once: true,
    },
  })
    .to(pick('title'), { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)
    .to(pick('text'), { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.1)
    .to(pick('paragraph'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.15,
    }, 0.3);
};

useGsap(() => {
  if (!rootRef.value) return;

  gsap.set(pick('title'), { opacity: DIMMED.title });
  gsap.set(pick('text'), { opacity: DIMMED.text });
  gsap.set(pick('paragraph'), { opacity: 0, y: PARAGRAPH_SHIFT });

  if (!isAppLoading.value) {
    play();
    return;
  }

  stopWaiting = watch(isAppLoading, (loading) => {
    if (loading) return;

    stopWaiting?.();
    play();
  });
});

onBeforeUnmount(() => {
  stopWaiting?.();
  timeline?.scrollTrigger?.kill();
  timeline?.kill();
  timeline = null;
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
