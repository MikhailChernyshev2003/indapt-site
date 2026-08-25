const scrollPositions = ref<Record<string, number>>({});

export const useScrollPreserve = () => {
  const route = useRoute();
  const saveScrollPosition = () => {
    scrollPositions.value[route.fullPath] = window.scrollY;
  };

  const restoreScrollPosition = () => {
    const savedPosition = scrollPositions.value[route.fullPath];
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'smooth',
        });
      }, 50);
    }
  };

  return {
    saveScrollPosition,
    restoreScrollPosition,
  };
};
