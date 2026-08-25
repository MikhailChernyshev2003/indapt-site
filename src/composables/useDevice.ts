export const useDevice = () => {
  const viewport = useViewport();

  const isMobile = computed(() => viewport.isLessThan('tablet'));
  const isTablet = computed(() => viewport.isGreaterOrEquals('tablet') && viewport.isLessThan('desktop'));
  const isDesktop = computed(() => viewport.isGreaterOrEquals('desktop'));
  const isTouch = computed(() => 'ontouchstart' in window || navigator?.maxTouchPoints > 0);

  const isMobileOrTablet = computed(() => isMobile.value || isTablet.value);
  const isTabletOrDesktop = computed(() => isDesktop.value || isTablet.value);

  return { isDesktop, isTablet, isMobile, isTouch, isMobileOrTablet, isTabletOrDesktop };
};
