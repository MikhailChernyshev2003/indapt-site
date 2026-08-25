import type { FieldContext } from 'vee-validate';

export interface IField<T = any> {
  fieldContext: FieldContext<T>;
  fieldName: ComputedRef<string>;
  fieldId: ComputedRef<string>;
  isErrorState: ComputedRef<boolean>;
  errorMessage: ComputedRef<string | undefined>;
  fieldValue: Ref<T>;
}
