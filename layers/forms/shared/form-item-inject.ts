import type { IField } from '@l-forms/types';

export const FORM_ITEM_INJECT = Symbol(
  'form_item_inject',
) as InjectionKey<IField>;
