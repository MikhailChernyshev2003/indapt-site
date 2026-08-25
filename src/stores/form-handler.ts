export const useFormHandler = defineStore('FormHandler', () => {
  const isFormOpen = ref(false);

  const handlerFormOpen = (value: boolean) => {
    isFormOpen.value = value;
  };

  return {
    isFormOpen,
    handlerFormOpen,
  };
});
