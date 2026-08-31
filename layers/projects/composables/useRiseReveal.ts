import { gsap } from 'gsap';
import type { Ref } from 'vue';

/** Появление группы элементов подъёмом с прозрачностью — по одному разу,
 * когда контейнер доезжает до вьюпорта */
export function useRiseReveal(
  root: Ref<HTMLElement | null>,
  selector: string,
  stagger = 0.12,
) {
  let tween: gsap.core.Tween | null = null;

  useGsap(() => {
    const el = root.value;

    if (!el) return;

    const targets = el.querySelectorAll(selector);

    if (!targets.length) return;

    tween = gsap.from(targets, {
      y: 24,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
      },
    });
  });

  onBeforeUnmount(() => {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
  });
}
