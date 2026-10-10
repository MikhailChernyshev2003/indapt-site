<script setup lang="ts">
import { object, string, boolean, mixed } from 'yup';
import type { InferType } from 'yup';
import CloseIcon from '@/assets/icons/close-icon.svg';
import { useFormApi } from '~/composables/useFormApi';
import {
  RESUME_FILE_ACCEPT,
  RESUME_FILE_ALLOWED_EXTENSIONS,
  RESUME_FILE_MAX_SIZE,
  getResumeFileExtension,
} from '~/shared/constants/resume-file';

const { t, locale } = useI18n();

const schema = object({
  name: string().required(t('responseForm.required')),
  phone: string()
    .required(t('contactForm.phoneError'))
    .matches(/^[0-9\s\-()+]+$/, t('contactForm.phoneError')),
  email: string()
    .required(t('responseForm.emailError'))
    .email(t('responseForm.emailError')),
  link: string().test(
    'optional-url',
    t('responseForm.invalidUrl'),
    (value) => {
      const trimmed = value?.trim();
      if (!trimmed) return true;
      try {
        const parsed = new URL(trimmed);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      }
      catch {
        return false;
      }
    },
  ),
  text: string().required(t('responseForm.required')),
  file: mixed<File>()
    .required(t('responseForm.fileRequired'))
    .test('file-type', t('responseForm.fileType'), (file) => {
      if (!(file instanceof File)) return false;
      return RESUME_FILE_ALLOWED_EXTENSIONS.includes(
        getResumeFileExtension(file.name) as typeof RESUME_FILE_ALLOWED_EXTENSIONS[number],
      );
    })
    .test('file-size', t('responseForm.fileSize'), (file) => {
      if (!(file instanceof File)) return false;
      return file.size <= RESUME_FILE_MAX_SIZE;
    }),
  agreement: boolean()
    .required(t('responseForm.requiredAgreement'))
    .oneOf([true], t('responseForm.requiredAgreement')),
});

export type FormData = InferType<typeof schema>;

const vacancyName = ref('');

const props = defineProps<{
  vacancy?: string;
}>();

onMounted(() => {
  if (props.vacancy) {
    vacancyName.value = props.vacancy;
  }
});

const { sendVacancyForm } = useFormApi();
const isLoading = ref(false);
const errorMessage = ref('');
// Итог отправки для пользователя: раньше результат уходил только в консоль,
// и после нажатия кнопки на экране ничего не менялось
const submitStatus = ref<'success' | 'error' | null>(null);

const handleSubmit = async (data: FormData) => {
  isLoading.value = true;
  errorMessage.value = '';
  submitStatus.value = null;

  try {
    const result = await sendVacancyForm({
      name: data.name,
      phone: data.phone,
      email: data.email,
      vacancyName: vacancyName.value || t('responseForm.defaultVacancy'),
      resumeLink: data.link || '',
      resumeFile: data.file,
    });

    submitStatus.value = 'success';
    console.log(result.message || t('responseForm.submitSuccess'));
  }
  catch (error) {
    errorMessage.value = error instanceof Error && error.message
      ? error.message
      : t('responseForm.submitError');
    submitStatus.value = 'error';
    console.log(errorMessage.value);
  }
  finally {
    isLoading.value = false;
  }
};

const emits = defineEmits(['close']);
</script>

<template>
  <div class="response-form">
    <div class="response-form__wrapper">
      <h3 class="response-form__title" v-html="t('responseForm.title')" />
      <p class="response-form__text">{{ t('responseForm.text') }}</p>
      <form-block
        :validation-schema="schema"
        class="response-form__form"
        @submit="handleSubmit"
      >
        <div class="response-form__fields">
          <form-item name="name" class="response-form__field">
            <atoms-input :label="t('responseForm.name')" type="text" />
          </form-item>

          <form-item name="phone" class="response-form__field">
            <atoms-input
              :label="t('responseForm.phone')"
              type="tel"
              :mask="locale === 'ru' ? 'phone' : ''"
            />
          </form-item>

          <form-item name="email" class="response-form__field">
            <atoms-input :label="t('responseForm.email')" type="email" />
          </form-item>

          <form-item name="link" class="response-form__field">
            <atoms-input :label="t('responseForm.link')" type="text" />
          </form-item>

          <form-item name="text" class="response-form__field">
            <atoms-textarea :label="t('responseForm.about')" />
          </form-item>

          <form-item name="file" class="response-form__field">
            <atoms-file-upload
              :accept="RESUME_FILE_ACCEPT"
            />
          </form-item>

          <form-item name="agreement" class="response-form__field">
            <atoms-checkbox
              class="response-form__checkbox"
              :label="t('responseForm.agreement')"
            />
          </form-item>
        </div>

        <div class="response-form__actions">
          <atoms-button
            type="submit"
            mode="secondary"
            :disabled="isLoading"
          >
            {{ t('responseForm.button') }}
          </atoms-button>

          <transition name="fade">
            <!-- Текст ответа сервера не показываем: там может быть HTML/отладка PHP -->
            <p
              v-if="submitStatus"
              class="response-form__status"
              :class="`response-form__status_${submitStatus}`"
              role="status"
            >
              {{ submitStatus === 'success' ? t('responseForm.submitSuccess') : t('responseForm.submitError') }}
            </p>
          </transition>
        </div>
      </form-block>
    </div>
    <close-icon class="response-form__close" @click="emits('close')" />
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;

.response-form {
  position: relative;
  z-index: 1;

  overflow-y: auto;

  @include s.no-scrollbar;

  @include a.tablet {
    overscroll-behavior: none;
  }

  &__wrapper {
    height: max-content;
    padding: 40px 60px;

    @include a.mobile {
      padding: 40px 28px;
    }
  }

  &__title {
    color: var(--dark-blue);

    @include t.h2;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__text {
    margin-top: 16px;

    color: var(--dark-blue);

    @include t.body-s-semi;
  }

  &__info {
    margin-top: 24px;

    &-item {
      display: flex;

      color: var(--dark-blue);

      @include t.body-s-semi;

      &:not(:first-child) {
        margin-top: 16px;
      }

      &-num {
        display: block;
        width: 20px;
        height: 20px;
      }

      &-content {
        &-text {
          margin-top: 2px;

          color: var(--dark-blue-70);

          @include t.body-s-medium;
        }
      }
    }
  }

  &__form {
    margin-top: 24px;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 16px;

    @include a.mobile {
      gap: 12px;
    }

    :deep(.textarea-wrapper) {
      margin: 8px 0;
    }
  }

  &__field {
    width: 100%;
  }

  &__close {
    position: fixed;
    top: 48px;
    right: 72px;
    z-index: 3;

    width: 44px !important;
    height: 44px !important;

    transition: transform 0.3s;

    @include s.hover {
      transform: scaleY(0.7);
    }

    @include a.tablet {
      right: 60px;
    }

    @include a.mobile {
      top: 48px;
      right: 42px;
      background: var(--white);
      border-radius: 8px;

      width: 36px !important;
      height: 36px !important;
    }
  }

  &__divider {
    width: 100%;
    height: 1px;
    margin: 32px 0;

    background: var(--dark-blue-5);
  }

  &__checkbox {
    max-width: 500px;
  }

  &__actions {
    margin-top: 40px;
  }

  &__status {
    margin-top: 16px;

    color: var(--dark-blue);

    @include t.body-s-medium;

    &_error {
      color: var(--red);
    }
  }
}
</style>
