<script setup lang="ts">
import { vMaska } from 'maska/vue';

const {
  type = 'text',
  mask = '',
  disabled = false,
  readonly = false,
} = defineProps<{
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  mask?: string;
  disabled?: boolean;
  readonly?: boolean;
}>();

const isFocused = ref(false);

const model = defineModel<any>('value');

const { fieldValue, isErrorState, fieldId } = useFormField(model);

const getMaskPattern = (mask: string): string => {
  switch (mask) {
    case 'phone':
      return '+7 (###) ###-##-##';
    default:
      return mask;
  }
};

const handleBlur = () => {
  isFocused.value = false;
};
</script>

<template>
  <div class="input-wrapper">
    <input
      :id="fieldId"
      v-model="fieldValue"
      v-maska="mask ? getMaskPattern(mask) : undefined"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      class="input-wrapper__input"
      :class="{
        'input-wrapper__input--error': isErrorState,
        'input-wrapper__input--disabled': disabled,
        'input-wrapper__input--with-label': label,
      }"
      @focus="isFocused = true"
      @blur="handleBlur"
    />
    <label
      v-if="label"
      :for="fieldId"
      class="input-wrapper__label"
      :class="{
        'input-wrapper__label--focused': isFocused || fieldValue,
        'input-wrapper__label--error': isErrorState,
      }"
    >
      {{ label }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
@use "assets/styles/adaptive" as a;
@use "assets/styles/variables" as v;
@use "assets/styles/typography" as t;
@use "assets/styles/shared" as s;

.input-wrapper {
  position: relative;
  z-index: 1;

  width: 100%;

  &__label {
    position: absolute;
    top: 50%;
    left: 16px;

    color: var(--dark-blue-60);

    transform: translateY(-11px);
    transform-origin: left center;

    transition: all v.$timing v.$easing;

    pointer-events: none;

    @include t.body-xs-medium;

    &--focused {
      top: 10px;

      transform: translateY(-5px) scale(0.6);
    }
  }

  &__input {
    width: 100%;
    height: 100%;
    padding: 22.5px 16px 10.5px;

    color: var(--dark-blue);
    line-height: 100%;

    background-color: var(--bg);
    border: 1px solid transparent;
    border-radius: 12px;
    outline: none;

    transition: all v.$timing v.$easing;

    @include t.body-xs-medium;

    @include s.hover {
       border-color: var(--dark-blue-20);
    }

    &--error {
      border-color: var(--red-20);

      @include s.hover {
        background: var(--red-4);
        border-color: var(--red-20);
      }
    }

    &--disabled {
      color: var(--dark-blue-50);

      background-color: var(--light-blue-30);
      cursor: not-allowed;
    }

    &:focus {
      border-color: var(--dark-blue-40);
    }

    &:read-only {
      pointer-events: none;
    }
  }
}
</style>
