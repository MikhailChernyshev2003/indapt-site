<script setup lang="ts">
const {
  disabled = false,
} = defineProps<{
  label: string;
  disabled?: boolean;
}>();

const model = defineModel<boolean>({ default: false });

const { fieldValue, isErrorState, fieldId } = useFormField(model);
</script>

<template>
  <div class="checkbox-wrapper">
    <input
      :id="fieldId"
      v-model="fieldValue"
      type="checkbox"
      :disabled="disabled"
      class="checkbox-wrapper__input"
      :class="{
        'checkbox-wrapper__input--error': isErrorState,
        'checkbox-wrapper__input--disabled': disabled,
      }"
    />
    <label
      :for="fieldId"
      class="checkbox-wrapper__label"
      :class="{
        'checkbox-wrapper__label--disabled': disabled,
      }"
    >
      <span class="checkbox-wrapper__checkmark" />
      {{ label }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
@use "assets/styles/adaptive" as a;
@use "assets/styles/variables" as v;
@use "assets/styles/typography" as t;
@use "assets/styles/shared" as s;

.checkbox-wrapper {
  position: relative;

  display: flex;
  align-items: flex-start;
  width: 100%;

  &__input {
    position: absolute;

    opacity: 0;

    &--disabled {
      cursor: not-allowed;
    }

    &:checked + .checkbox-wrapper__label .checkbox-wrapper__checkmark {
      background-color: var(--dark-blue);
      border-color: var(--dark-blue);

      &::after {
        display: block;
      }
    }

    &--error + .checkbox-wrapper__label .checkbox-wrapper__checkmark {
      border-color: var(--red-20);
    }

    &:focus + .checkbox-wrapper__label .checkbox-wrapper__checkmark {
      box-shadow: 0 0 0 1px var(--dark-blue-20);
    }
  }

  &__label {
    display: flex;
    align-items: flex-start;

    color: var(--dark-blue-70);

    @include t.body-s-regular;

    @include s.hover {
      .checkbox-wrapper__checkmark {
        border-color: var(--dark-blue-40);
      }
    }

    &--disabled {
      color: var(--dark-blue-10);
    }
  }

  &__checkmark {
    position: relative;

    display: inline-block;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-top: 4px;
    margin-right: 12px;

    background-color: var(--bg);
    border: 1px solid var(--dark-blue-20);
    border-radius: 4px;

    transition: all v.$timing v.$easing;

    &::after {
      position: absolute;
      top: 2px;
      left: 8px;

      display: none;
      width: 6px;
      height: 12px;

      border: solid var(--white);
      border-width: 0 1.5px 1.5px 0;
      transform: rotate(45deg);

      content: "";
    }
  }

  &__error {
    display: block;
    margin-top: 4px;
    margin-left: 32px;

    color: var(--red);

    @include t.body-xs-medium;
  }
}
</style>
