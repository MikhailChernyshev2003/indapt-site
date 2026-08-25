<script setup lang="ts">
import { MS_IN_YEAR } from '~/shared/constants/ms-in-times';

const { t } = useI18n();

const acceptCookies = useCookie<boolean>('accept-cookies', {
  maxAge: MS_IN_YEAR,
  sameSite: 'lax',
  default: () => false,
});

const accept = () => {
  acceptCookies.value = true;
};
</script>

<template>
  <transition name="cookies" appear>
    <div v-if="!acceptCookies" class="cookies">
      <p class="cookies__text">
        {{ t('cookies.text') }}
      </p>

      <atoms-button
        class="cookies__button"
        mode="secondary"
        @click="accept"
      >
        {{ t('cookies.accept') }}
      </atoms-button>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;

.cookies {
  position: fixed;
  right: 60px;
  bottom: 60px;
  z-index: 99999;

  display: flex;
  gap: 36px;
  width: 100%;
  max-width: 580px;
  padding: 34px 32px;

  background-color: var(--white);
  border-radius: 16px;
  box-shadow: 0 3px 14px 0 rgb(194 194 194 / 24%);

  @include a.tablet {
    bottom: 40px;
    left: 50%;

    min-width: calc(100% - 80px);

    padding: 32px;

    transform: translateX(-50%);
  }

  @include a.mobile {
    bottom: 16px;

    display: flex;
    flex-direction: column;
      gap: 20px;

    width: calc(100% - 32px);

    padding: 20px;
  }

   &__text {
    @include t.body-l-medium;
   }

  &__button {
    height: 56px;

    @include a.mobile {
      width: 100%;
      height: 48px;

      text-align: center;
    }
  }
}

:deep(.button__container) {
  margin: 0;

  @include a.mobile {
    width: 100%;
  }
}

:deep(.button__dot) {
  display: none;
}

.cookies-enter-active,
.cookies-leave-active {
  transition: 0.3s ease;
  transition-property: opacity, transform;
}

.cookies-enter-from,
.cookies-leave-to {
  transform: translateX(50%);
  opacity: 0;
}
</style>
