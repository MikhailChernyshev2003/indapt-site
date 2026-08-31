import { gsap } from 'gsap';
import type { Ref } from 'vue';

/** Доращивает число в элементе от нуля при появлении в вьюпорте.
 * Суффикс («%», « раз») сохраняется как есть */
export function useCountUp(target: Ref<HTMLElement | null>, value: () => string) {
  let tween: gsap.core.Tween | null = null;

  useGsap(() => {
    const el = target.value;

    if (!el) return;

    const raw = value();
    const num = Number.parseFloat(raw.replace(',', '.'));

    if (!Number.isFinite(num)) return;

    const suffix = raw.replace(/^[\d.,\s]+/, '');
    const state = { n: 0 };

    el.textContent = `0${suffix}`;
    tween = gsap.to(state, {
      n: num,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
      onUpdate: () => {
        el.textContent = `${Math.round(state.n)}${suffix}`;
      },
    });
  });

  onBeforeUnmount(() => {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
  });
}
