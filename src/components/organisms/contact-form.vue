<script setup lang="ts">
import { object, string, boolean } from 'yup';
import type { InferType } from 'yup';
import CloseIcon from '@/assets/icons/close-icon.svg';
import { useFormApi } from '~/composables/useFormApi';

const { t, locale } = useI18n();
const { sendContactForm } = useFormApi();

const steps = computed(() => [
  {
    title: t('contactForm.step1.title'),
    text: t('contactForm.step1.text'),
  },
  {
    title: t('contactForm.step2.title'),
    text: t('contactForm.step2.text'),
  },
  {
    title: t('contactForm.step3.title'),
    text: t('contactForm.step3.text'),
  },
]);

const schema = object({
  text: string().required(t('contactForm.required')),
  name: string().required(t('contactForm.required')),
  position: string().required(t('contactForm.required')),
  phone: string()
    .required(t('contactForm.phoneError'))
    .matches(/^[0-9\s\-()+]+$/, t('contactForm.phoneError')),
  email: string()
    .required(t('contactForm.emailError'))
    .email(t('contactForm.emailError')),
  agreement: boolean()
    .required(t('contactForm.requiredAgreement'))
    .oneOf([true], t('contactForm.requiredAgreement')),
});

const isLoading = ref(false);
const errorMessage = ref('');
// Итог отправки для пользователя: раньше результат уходил только в консоль,
// и после нажатия кнопки на экране ничего не менялось
const submitStatus = ref<'success' | 'error' | null>(null);

const handleSubmit = async (data: InferType<typeof schema>) => {
  isLoading.value = true;
  errorMessage.value = '';
  submitStatus.value = null;

  try {
    const result = await sendContactForm({
      message: data.text,
      name: data.name,
      position: data.position,
      phone: data.phone,
      email: data.email,
    });

    submitStatus.value = 'success';
    console.log(result.message || t('contactForm.submitSuccess'));
  }
  catch (error) {
    errorMessage.value = error instanceof Error && error.message
      ? error.message
      : t('contactForm.submitError');
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
  <div class="contact-form">
    <div class="contact-form__wrapper">
      <h3 class="contact-form__title">{{ t('contactForm.title') }}</h3>
      <p class="contact-form__text" v-html="t('contactForm.text')" />
      <div class="contact-form__info">
        <div
          v-for="(item, idx) in steps"
          :key="item.title"
          class="contact-form__info-item"
        >
          <p class="contact-form__info-item-num">{{ idx + 1 }}.</p>
          <div class="contact-form__info-item-content">
            <h4
              class="contact-form__info-item-content-title"
              v-html="item.title"
            />
            <p
              class="contact-form__info-item-content-text"
              v-html="item.text"
            />
          </div>
        </div>
      </div>
      <form-block
        :validation-schema="schema"
        class="contact-form__form"
        @submit="handleSubmit"
      >
        <div class="contact-form__fields">
          <form-item name="text" class="contact-form__field">
            <atoms-textarea :label="t('contactForm.company')" />
          </form-item>
          <div class="contact-form__divider" />
          <p class="contact-form__form-text">{{ t('contactForm.contactInfo') }}</p>
          <form-item name="name" class="contact-form__field">
            <atoms-input :label="t('contactForm.name')" type="text" />
          </form-item>

          <form-item name="position" class="contact-form__field">
            <atoms-input :label="t('contactForm.position')" type="text" />
          </form-item>

          <form-item name="phone" class="contact-form__field">
            <atoms-input
              :label="t('contactForm.phone')"
              type="tel"
              :mask="locale === 'ru' ? 'phone' : ''"
            />
          </form-item>

          <form-item name="email" class="contact-form__field">
            <atoms-input :label="t('contactForm.email')" type="email" />
          </form-item>

          <form-item name="agreement" class="contact-form__field">
            <atoms-checkbox
              class="contact-form__checkbox"
              :label="t('contactForm.agreement')"
            />
          </form-item>
        </div>

        <div class="contact-form__actions">
          <atoms-button
            type="submit"
            mode="secondary"
            :disabled="isLoading"
          >
            {{ t('contactForm.button') }}
          </atoms-button>

          <transition name="fade">
            <!-- Текст ответа сервера не показываем: там может быть HTML/отладка PHP -->
            <p
              v-if="submitStatus"
              class="contact-form__status"
              :class="`contact-form__status_${submitStatus}`"
              role="status"
            >
              {{ submitStatus === 'success' ? t('contactForm.submitSuccess') : t('contactForm.submitError') }}
            </p>
          </transition>
        </div>
      </form-block>
    </div>
    <close-icon class="contact-form__close" @click="emits('close')" />
  </div>
</template>

<style lang="scss" scoped>
@use "assets/styles/typography" as t;
@use "assets/styles/adaptive" as a;
@use "assets/styles/shared" as s;

.contact-form {
  position: relative;
  z-index: 1;

  overflow-y: auto;

  @include s.no-scrollbar;

  @include a.tablet {
    overscroll-behavior: none;
  }

  &__wrapper {
    height: max-content;
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

    color: var(--dark-blue-70);

    @include t.body-s-medium;
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

  &__divider {
    width: 100%;
    height: 1px;
    margin: 32px 0;

    background: var(--dark-blue-5);
  }

  &__form-text {
    margin-bottom: 8px;

    color: var(--dark-blue);

    @include t.body-s-semi;
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
