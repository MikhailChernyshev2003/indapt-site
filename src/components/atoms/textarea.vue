<script setup lang="ts">
const {
  disabled = false,
  readonly = false,
  maxChars = 480,
} = defineProps<{
  label: string;
  disabled?: boolean;
  readonly?: boolean;
  maxChars?: number;
}>();

const isFocused = ref(false);

const model = defineModel<any>('value');

const { fieldValue, isErrorState, fieldId } = useFormField(model);

const isLabelFloating = computed(() => isFocused.value || Boolean(fieldValue.value));

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  let value = target.value;

  if (value.length > maxChars) {
    value = value.substring(0, maxChars);
    target.value = value;
  }

  fieldValue.value = value;
};

const handleBlur = () => {
  isFocused.value = false;
};
</script>

<template>
  <div
    class="textarea-wrapper"
    :class="{ 'textarea-wrapper--label-floating': isLabelFloating }"
  >
    <textarea
      :id="fieldId"
      v-model="fieldValue"
      :disabled="disabled"
      :readonly="readonly"
      class="textarea-wrapper__textarea"
      :class="{
        'textarea-wrapper__textarea--error': isErrorState,
        'textarea-wrapper__textarea--disabled': disabled,
        'textarea-wrapper__textarea--with-label': label,
        'textarea-wrapper__textarea--label-floating': isLabelFloating,
      }"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="handleBlur"
    />
    <label
      v-if="label"
      :for="fieldId"
      class="textarea-wrapper__label"
      :class="{
        'textarea-wrapper__label--focused': isLabelFloating,
        'textarea-wrapper__label--error': isErrorState,
      }"
    >
      {{ label }}
    </label>
    <p class="textarea-wrapper__counter">{{ (fieldValue || '').length }} / {{ maxChars }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use "assets/styles/adaptive" as a;
@use "assets/styles/variables" as v;
@use "assets/styles/typography" as t;
@use "assets/styles/shared" as s;

.textarea-wrapper {
  position: relative;
  z-index: 1;

  width: 100%;

  &--label-floating::before {
    content: "";

    position: absolute;
    top: 1px;
    right: 1px;
    left: 1px;
    z-index: 1;

    height: 36px;

    background-color: var(--bg);
    border-radius: 11px 11px 0 0;

    pointer-events: none;
  }

  &__label {
    position: absolute;
    top: 0;
    left: 16px;

    color: var(--dark-blue-60);

    transform: translateY(16px);
    transform-origin: left center;

    transition: all v.$timing v.$easing;

    pointer-events: none;

    @include t.body-xs-medium;

    &--focused {
      top: 8px;
      z-index: 2;

      max-width: calc(100% - 32px);

      transform: translateY(0) scale(0.6);
    }
  }

  &__textarea {
    width: 100%;
    height: 200px;
    padding: 28px 16px 36px;

    color: var(--dark-blue);

    background-color: var(--bg);
    border: 1px solid transparent;
    border-radius: 12px;
    outline: none;

    transition: all v.$timing v.$easing;

    resize: none;

    @include t.body-xs-medium;

    &--label-floating {
      padding-top: 40px;
    }

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

  &__counter {
    position: absolute;
    right: 12px;
    bottom: 12px;
    z-index: 2;

    display: block;
    margin: 0 0 0 12px;

    color: var(--dark-blue-60);

    @include t.body-xxs-medium;
  }
}
</style>
