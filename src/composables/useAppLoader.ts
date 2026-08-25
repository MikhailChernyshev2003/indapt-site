const globalIsAppLoading = ref(true);
const globalPendingCameraReady = ref<(() => void) | null>(null);

export const useAppLoader = () => {
  const setAppLoading = (loading: boolean) => {
    globalIsAppLoading.value = loading;

    if (!loading && globalPendingCameraReady.value) {
      globalPendingCameraReady.value();
      globalPendingCameraReady.value = null;
    }
  };

  const setPendingCameraReady = (callback: () => void) => {
    if (!globalIsAppLoading.value) {
      callback();
    }
    else {
      globalPendingCameraReady.value = callback;
    }
  };

  return {
    isAppLoading: readonly(globalIsAppLoading),
    setAppLoading,
    setPendingCameraReady,
  };
};
