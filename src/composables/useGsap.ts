import { BREAKPOINTS } from '~/shared/constants';

type AdaptiveAnimation = {
  desktop?: VoidFunction;
  tablet?: VoidFunction | undefined;
  mobile?: VoidFunction | undefined;
};

export function useGsap(animation: VoidFunction | AdaptiveAnimation) {
  onMounted(async () => {
    await nextTick();

    if (typeof animation === 'function') {
      animation();
    }

    else if (typeof animation === 'object') {
      gsap.matchMedia().add({
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
}
