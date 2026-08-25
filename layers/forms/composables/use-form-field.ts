import { FORM_ITEM_INJECT } from '@l-forms/shared';
import type { IField } from '@l-forms/types';

export function useFormField<T = any>(modelValue?: Ref<T>) {
  // Получаем контекст формы, если он есть
  const formContext = inject<IField<T> | null>(FORM_ITEM_INJECT, null);

  // Создаем вычисляемые свойства для работы с данными
  const fieldValue = computed({
    get: () => formContext?.fieldValue.value ?? modelValue?.value,
    set: (value: T) => {
      if (formContext) {
        formContext.fieldValue.value = value;
      }
      else if (modelValue) {
        modelValue.value = value;
      }
    },
  });

  // Вычисляемое значение для состояния ошибки
  const isErrorState = computed(() => formContext?.isErrorState.value ?? false);

  // Вычисляемое значение для сообщения об ошибке
  const errorMessage = computed(() => formContext?.errorMessage.value ?? undefined);

  // Дополнительные свойства из контекста
  const fieldName = computed(() => formContext?.fieldName.value ?? '');
  const fieldId = computed(() => formContext?.fieldId.value ?? '');

  return {
    // Основные свойства
    fieldValue,
    isErrorState,
    errorMessage,

    // Дополнительные свойства из контекста
    fieldName,
    fieldId,

    // Полный контекст (если нужен)
    fieldContext: formContext?.fieldContext,

    // Флаг наличия контекста формы
    hasFormContext: !!formContext,
  };
}
