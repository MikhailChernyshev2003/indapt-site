export const useFormHandler = defineStore('FormHandler', () => {
  const isFormOpen = ref(false);

  const handlerFormOpen = (value: boolean) => {
    isFormOpen.value = value;
  };

  // Форма «Получить презентацию» (О компании)
  const isPresentationFormOpen = ref(false);

  const handlerPresentationFormOpen = (value: boolean) => {
    isPresentationFormOpen.value = value;
  };

  return {
    isFormOpen,
    handlerFormOpen,
    isPresentationFormOpen,
    handlerPresentationFormOpen,
  };
});
