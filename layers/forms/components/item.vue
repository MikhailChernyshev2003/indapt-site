<script lang="ts" setup>
import { FORM_ITEM_INJECT } from '@l-forms/shared';
import type { IField } from '@l-forms/types';

interface IProps {
  name: string;
  hiddenErrorMessage?: boolean;
  debug?: boolean;
}

const props = defineProps<IProps>();

const id = useId();

const fieldContext = useField<string>(props.name);

const fieldName = computed(() => unref(fieldContext.name));
const fieldId = computed(() => `${fieldName.value}-${id}`);
const isErrorState = computed(() => !fieldContext.meta.valid && fieldContext.meta.touched);
const errorMessage = computed(() => fieldContext.errorMessage.value);

const lastErrorMessage = ref<string>('');

watch(fieldContext.errorMessage, (newV: string | undefined) => {
  if (newV && newV.length > 0) lastErrorMessage.value = newV;
});

provide<IField>(FORM_ITEM_INJECT, {
  fieldContext,
  fieldName,
  fieldId,
  isErrorState,
  fieldValue: fieldContext.value,
  errorMessage,
});
</script>

<template>
  <div class="form-item">
    <slot :field-name="fieldName" />

    <div
      v-if="!hiddenErrorMessage"
      :class="{
        'form-item__error_show': isErrorState,
      }"
      class="form-item__error"
    >
      <span class="form-item__error-message">
        {{ lastErrorMessage }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.form-item {
  position: relative;

  isolation: isolate;
}

.form-item__error {
  display: grid;
  grid-template-rows: 0fr;

  transition: .15s ease;
  transition-property: grid-template-rows, margin-top;

  &_show {
    grid-template-rows: 1fr;
    margin-top: 8px;
  }
}

.form-item__error-message {
  min-height: 0;
  overflow: hidden;

  color: var(--red);
}
</style>
