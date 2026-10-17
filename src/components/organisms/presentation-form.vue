<script setup lang="ts">
import { object, string, boolean } from 'yup';
import type { InferType } from 'yup';
import CloseIcon from '@/assets/icons/close-icon.svg';
import { useFormApi } from '~/composables/useFormApi';

// Самая простая форма сайта: ФИО и почта для обратной связи.
// Устроена так же, как contact-form: тот же блок формы, поля, согласие и статус отправки

const { t } = useI18n();
const { sendPresentationForm } = useFormApi();

const schema = object({
  name: string().required(t('contactForm.required')),
  email: string()
    .required(t('contactForm.emailError'))
    .email(t('contactForm.emailError')),
  agreement: boolean()
    .required(t('contactForm.requiredAgreement'))
    .oneOf([true], t('contactForm.requiredAgreement')),
});

const isLoading = ref(false);
const submitStatus = ref<'success' | 'error' | null>(null);

const handleSubmit = async (data: InferType<typeof schema>) => {
  isLoading.value = true;
  submitStatus.value = null;

  try {
    await sendPresentationForm({
      name: data.name,
      email: data.email,
    });
    submitStatus.value = 'success';
  }
  catch {
    submitStatus.value = 'error';
  }
  finally {
    isLoading.value = false;
  }
};

const emits = defineEmits(['close']);
</script>

<template>
  <div class="presentation-form">
    <div class="presentation-form__wrapper">
      <h3 class="presentation-form__title">{{ t('presentationForm.title') }}</h3>
      <p class="presentation-form__text" v-html="t('presentationForm.text')" />
      <form-block
        :validation-schema="schema"
        class="presentation-form__form"
        @submit="handleSubmit"
      >
        <div class="presentation-form__fields">
          <form-item name="name" class="presentation-form__field">
            <atoms-input :label="t('presentationForm.name')" type="text" />
          </form-item>

          <form-item name="email" class="presentation-form__field">
            <atoms-input :label="t('presentationForm.email')" type="email" />
          </form-item>

          <form-item name="agreement" class="presentation-form__field">
            <atoms-checkbox
              class="presentation-form__checkbox"
              :label="t('contactForm.agreement')"
            />
          </form-item>
        </div>

        <div class="presentation-form__actions">
          <atoms-button
            type="submit"
            mode="secondary"
            :disabled="isLoading"
          >
            {{ t('presentationForm.button') }}
          </atoms-button>

          <transition name="fade">
            <!-- Текст ответа сервера не показываем: там может быть HTML/отладка PHP -->
            <p
              v-if="submitStatus"
              class="presentation-form__status"
              :class="`presentation-form__status_${submitStatus}`"
              role="status"
              v-html="submitStatus === 'success' ? t('presentationForm.submitSuccess') : t('contactForm.submitError')"
            />
          </transition>
        </div>
      </form-block>
    </div>
    <close-icon class="presentation-form__close" @click="emits('close')" />
  </div>
</template>

<style lang="scss" scoped>
@use "assets/styles/typography" as t;
@use "assets/styles/adaptive" as a;
@use "assets/styles/shared" as s;

.presentation-form {
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
      padding: 24px 32px;
    }
  }

  &__title {
    padding-right: 56px;

    color: var(--dark-blue);

    @include t.h2;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__text {
    margin-top: 16px;

    color: var(--dark-blue-70);

    @include t.body-s-medium;
  }

  &__form {
    margin-top: 32px;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
      top: 40px;
      right: 32px;

      width: 36px !important;
      height: 36px !important;

      background: #ffffff;
      border-radius: 8px;
    }
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
