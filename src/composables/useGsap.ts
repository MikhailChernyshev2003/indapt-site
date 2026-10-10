import { BREAKPOINTS } from '~/shared/constants';

type AdaptiveAnimation = {
  desktop?: VoidFunction;
  tablet?: VoidFunction | undefined;
  mobile?: VoidFunction | undefined;
};

export function useGsap(animation: VoidFunction | AdaptiveAnimation) {
  // Всё, что анимация создала синхронно (твины, ScrollTrigger, SplitText),
  // собирается в контекст и гасится вместе с компонентом. Без этого триггеры
  // ушедшей страницы переживали клиентскую навигацию: считались на каждом
  // скролле и ресайзе, а matchMedia при смене брейкпоинта заново запускал
  // анимации уже размонтированных компонентов
  let scope: gsap.Context | gsap.MatchMedia | null = null;
  let isUnmounted = false;

  onMounted(async () => {
    await nextTick();

    // Компонент успели убрать, пока ждали тик: создавать нечего и некому гасить
    if (isUnmounted) return;

    if (typeof animation === 'function') {
      scope = gsap.context(() => animation());
    }

    else if (typeof animation === 'object') {
      scope = gsap.matchMedia().add({
        desktop: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
        tablet: `(min-width: ${BREAKPOINTS.TABLET}px) and (max-width: ${BREAKPOINTS.DESKTOP - 1}px)`,
        mobile: `(max-width: ${BREAKPOINTS.TABLET - 1}px)`,
      }, (context) => {
        const { desktop, tablet, mobile } = context.conditions!;

        if (desktop && animation.desktop) animation.desktop();
        if (tablet && animation.tablet) animation.tablet();
        if (mobile && animation.mobile) animation.mobile();
      });
    }
  });

  // kill, а не revert: инлайновые стили не откатываются к исходным,
  // и уходящая страница не мелькает начальным состоянием анимаций
  onBeforeUnmount(() => {
    isUnmounted = true;
    scope?.kill();
    scope = null;
  });
}
