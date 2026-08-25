<script setup lang="ts" generic="T extends Schema<any>">
import { toTypedSchema } from '@vee-validate/yup';
import type { InferType, Schema } from 'yup';

type TFormEnterEvents = 'withCtrl' | 'withShift' | 'withoutModifier';

interface IProps {
  generalErrors?: string[];
  validationSchema: T;
  initialValues?: InferType<T>;
  wrapperClass?: string;
  enterEvent?: TFormEnterEvents;
  debug?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{
  submit: [InferType<T>];
}>();

const { handleSubmit, values, meta, errors, setFieldValue, ...formController } = useForm({
  validationSchema: toTypedSchema(props.validationSchema),
  initialValues: props.initialValues,
});

defineExpose({
  setFieldValue,
  values,
  meta,
  formController,
});

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
});
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div v-if="debug">
      <p v-for="(error, idx) in errors" :key="idx">
        {{ error }}
        <br />
        <br />

        {{ values }}
        <br />
        <br />
      </p>
    </div>
    <slot :submit="onSubmit" />

    <div v-if="generalErrors?.length">
      <span v-for="error of generalErrors" :key="error">
        <span> {{ error }} </span>
      </span>
    </div>
  </form>
</template>
