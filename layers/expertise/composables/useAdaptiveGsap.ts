import { gsap } from 'gsap';

type AdaptiveAnimation = {
  desktop?: VoidFunction;
  tablet?: VoidFunction;
  mobile?: VoidFunction;
};

// Как общий useGsap, но с брейкпоинтами из SCSS (a.mobile ≤576px, a.tablet ≤1023px). useGsap считает мобильным
// только <576px: на ширине ровно 576 вёрстка уже мобильная, а запускалась планшетная анимация — карточки
// финтеха и здравоохранения ложились друг на друга, первые две не показывались вовсе.
// Контекст откатывается после ухода со вкладки, чтобы триггеры (в том числе pin) не копились при переключениях.
export const useAdaptiveGsap = (animation: AdaptiveAnimation) => {
  let mm: gsap.MatchMedia | null = null;

  onMounted(async () => {
    await nextTick();

    mm = gsap.matchMedia();
    mm.add({
      desktop: '(min-width: 1024px)',
      tablet: '(min-width: 577px) and (max-width: 1023px)',
      mobile: '(max-width: 576px)',
    }, (context) => {
      const { desktop, tablet, mobile } = context.conditions!;

      if (desktop) animation.desktop?.();
      if (tablet) animation.tablet?.();
      if (mobile) animation.mobile?.();
    });
  });

  onBeforeUnmount(() => {
    const context = mm;
    mm = null;

    // Откат сбрасывает inline-стили GSAP — делаем его, когда вкладка уже исчезла (fade 0.3s),
    // иначе карточки прыгнули бы в исходное положение прямо во время затухания
    setTimeout(() => context?.revert(), 600);
  });
};
