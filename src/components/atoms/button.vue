<script setup lang="ts">
type ButtonMode = 'primary' | 'secondary' | 'text';

const {
  mode = 'primary',
  disabled,
  href,
  blank = false,
} = defineProps<{
  disabled?: boolean;
  href?: string;
  mode?: ButtonMode;
  blank?: boolean;
}>();

const nuxtLink = resolveComponent('nuxt-link');
</script>

<template>
  <component
    :is="href ? nuxtLink : 'button'"
    :to="href"
    :target="(href && blank) ? '_blank' : undefined"
    :disabled="disabled"
    :class="['button', `button_${mode}`]"
  >
    <div class="button__container">
      <slot />
    </div>
    <div v-if="mode === 'primary'" class="button__arrow-wrapper">
      <svgo-arrow-right-blue class="button__arrow-icon" />
    </div>
    <div
      v-if="['secondary', 'text'].includes(mode)"
      class="button__dot"
    />
  </component>
</template>

<style lang="scss">
@use "assets/styles/adaptive" as a;
@use "assets/styles/variables" as v;
@use "assets/styles/shared" as s;

.button {
  position: relative;

  display: flex;
  align-items: center;
  width: fit-content;

  background-color: unset;
  border: none;

  &:disabled {
    opacity: 0.4;

    pointer-events: none;
  }

  &__container {
    z-index: 1;

    margin-right: 10px;

    color: var(--white);
    font-weight: 600;
    font-size: 20px;
    line-height: 128%;
    text-align: center;

    transition: color v.$timing;

    @include a.mobile {
      font-size: 16px;
    }
  }

  &_primary {
    height: 56px;
    padding: 3px 3px 3px 27px;

    border-radius: 100px;
    backdrop-filter: blur(5px);

    @include a.mobile {
      height: 48px;
      padding: 3px 4px 3px 24px;
    }

    @include s.hover {
      .button {
        &__container {
          color: var(--dark-blue);
        }

        &__arrow-wrapper {
          &::before {
            opacity: 1;
          }
        }

        &__arrow-icon {
          color: var(--white);
        }
      }

      &::before {
        opacity: 0;
      }

      &::after {
        opacity: 1;
      }
    }

    &::before {
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      background: linear-gradient(
        270deg,
        #0c1d4f -3.9%,
        #4b72ff 47.79%,
        #8fa9ff 94.29%
      );
      border-radius: 100px;

      transition: opacity v.$timing;

      content: "";
    }

    &::after {
      position: absolute;
      inset: 0;

      border: 1px solid var(--dark-blue);
      border-radius: 100px;
      opacity: 0;

      transition: opacity v.$timing;

      content: "";
    }
  }

  &_secondary {
    height: 56px;
    padding: 14px 28px 16px;

    border: 1px solid var(--dark-blue);
    border-radius: 100px;

    @include a.mobile {
      height: 48px;
      padding: 12px 20px;
    }

    @include s.hover {
      opacity: 0.6;

      .button__dot {
        transform: scale(1.5);
      }
    }

    .nuxt-icon {
      width: 20px;
      height: 20px;
      margin-top: -2px;
      margin-right: 10px;
    }

    .button__container {
      color: var(--dark-blue);
    }

    .button__dot {
      margin-top: 2px;
      transform: scale(1);
      transform-origin: center center;
      transition: transform 0.3s ease;
    }
  }

  &_text {
    border-bottom: 1px solid var(--dark-blue);

    transition: border-bottom 0.1s, opacity 0.3s;

    @include s.hover {
      border-bottom-color: transparent;
      opacity: 0.6;

      .button__dot {
        transform: scale(1.5);
      }
    }

    .button__container {
      color: var(--dark-blue);
    }

    .button__dot {
      margin-top: 0;
      transform: scale(1);
      transform-origin: center center;
      transition: transform 0.3s ease;
    }
  }

  &__arrow-wrapper {
    position: relative;
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;

    background-color: var(--white);
    border-radius: 100px;

    @include a.mobile {
      width: 40px;
      height: 40px;
    }

    &::before {
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      background: linear-gradient(
        270deg,
        #0c1d4f -3.9%,
        #4b72ff 47.79%,
        #8fa9ff 94.29%
      );
      border-radius: 100px;
      opacity: 0;

      transition: opacity v.$timing;

      content: "";
    }
  }

  &__arrow-icon {
    z-index: 1;

    width: 20px;
    height: 20px;

    transition: color v.$timing;
  }

  &__dot {
    width: 8px;
    height: 8px;
    margin-top: 4px;

    background-color: var(--dark-blue);
    border-radius: 50%;

    transition: background-color v.$timing, transform 0.3s ease;
  }
}
</style>
