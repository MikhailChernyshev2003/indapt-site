<script setup lang="ts">
const isBurgerOpen = ref(false);
const formHandler = useFormHandler();

const { t } = useI18n();

const { isFormOpen } = storeToRefs(formHandler);

const handlerBurgerOpen = () => {
  isBurgerOpen.value = !isBurgerOpen.value;
  document.body.classList.toggle('lock');
};

const handlerForm = () => {
  if (!isBurgerOpen.value) {
    document.body.classList.add('lock');
  }
  isBurgerOpen.value = false;
  formHandler.handlerFormOpen(!isFormOpen.value);
  if (!isFormOpen.value) {
    document.body.classList.remove('lock');
  }
};

const logoAnim = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top+=300px top',
      end: '+=200px',
      scrub: 1,
    },
  });
  tl.to('.logo-for-anim-opacity', {
    opacity: 0,
    stagger: 0.5,
    duration: 2,
    reversed: true,
  }, '<');
  tl.to('.logo-for-anim-x', {
    x: '-35%',
    duration: 2,
    delay: 3,
  }, '<');
  tl.to('.header__logo', {
    scale: 1.5,
    duration: 2,
  }, '<');
};

onMounted(() => {
  logoAnim();
});
</script>

<template>
  <header class="header">
    <div class="container header__container">
      <nuxt-link href="/" class="header__logo-link">
        <!-- <atoms-logo class="header__logo header__logo_full" type-mobile="min" />
        <atoms-logo class="header__logo header__logo_min" type="min" /> -->
        <atoms-logo-for-anim class="header__logo" />
      </nuxt-link>

      <div class="header__control">
        <atoms-button-animated-dot
          class="header__client"
          @click="handlerForm"
        >
          {{ t('header.button') }}
        </atoms-button-animated-dot>

        <molecules-lang-swithcer class="header__language-button" />

        <button class="header__burger-button" @click="handlerBurgerOpen">
          <span />
        </button>
      </div>
    </div>
    <client-only>
      <transition name="fade" appear>
        <teleport to="body">
          <div
            v-if="isBurgerOpen"
            class="header__overlay"
            @click="handlerBurgerOpen"
          >
            <organisms-header-menu
              class="header__menu"
              @click.stop
              @close="handlerBurgerOpen"
              @open-form="handlerForm"
            />
          </div>
        </teleport>
      </transition>
      <transition name="fade" appear>
        <teleport to="body">
          <div
            v-if="isFormOpen"
            class="header__overlay-form"
            @click="handlerForm"
          >
            <organisms-contact-form
              class="header__contact-form"
              @click.stop
              @close="handlerForm"
            />
          </div>
        </teleport>
      </transition>
    </client-only>
  </header>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

// По макету шапка 88px (на мобильном 72px), элементы по центру,
// линия-разделитель лежит внутри высоты — поэтому снизу на 1px меньше.
// Подложка прозрачная, и только нижняя треть шапки плавно подсвечивается
// sea-blue до ~9% у линии — одинаково по всей ширине
// (прежний rgb(var(--sea-blue-20), 0.4) с hex-переменной был невалиден)

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;

  // Ширину задают left/right: с 100vw шапка заезжала под постоянную полосу
  // прокрутки (Chrome с мышью или «показывать всегда»), и её размытие
  // рисовало там серую полосу-«тень» справа

  padding: 28px 0 27px;

  background: linear-gradient(180deg, var(--sea-blue-0) 62%, color-mix(in srgb, var(--sea-blue) 9%, transparent) 100%);
  border-bottom: 1px solid rgb(51 135 255 / 20%);
  backdrop-filter: blur(20px);

  @include a.mobile {
    padding: 20px 0 19px;
  }

  &_gradient {
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) 23.53%, rgb(255 255 255 / 100%) 154.55%);
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  // flex: inline-svg внутри блочной ссылки добавлял снизу место
  // под descender, и логотип стоял выше центра шапки

  &__logo-link {
    position: relative;
    z-index: 1;

    display: flex;
  }

  &__logo {
    width: auto;
    height: 30px;

    transform-origin: left center;

    &_min {
      position: absolute;
      top: 0;
      left: 0;

      height: 27px;

      opacity: 0;
    }
  }

  &__control {
    display: flex;
    align-items: center;
  }

  &__start-button {
    display: flex;
    align-items: center;
    margin-right: 66px;

    background-color: unset;

    @include a.tablet {
      display: none;
    }
  }

  &__start-dote {
    width: 9px;
    height: 9px;
    margin-right: 8px;

    background-color: var(--dark-blue);
    border-radius: 999px;
  }

  &__start-text {
    color: var(--dark-blue);

    @include t.button-m-semi;
  }

  &__language-button {
    margin: 0 62px;

    @include a.tablet {
      margin: 0 40px;
    }

    @include a.mobile {
      margin: 0 24px;
    }
  }

  // По макету точка в шапке крупнее, чем у кнопки по умолчанию;
  // .header в селекторе — чтобы перебить scoped-стили кнопки

  &__client {
    @include a.tablet {
      display: none !important;
    }

    .header & .button__dot {
      width: 9px;
      height: 9px;
      margin-inline-end: 8px;
    }
  }

  &__burger-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;

    background-color: unset;

    @include s.hover {
      span {
        &::before {
          transform: translate(-50%, -4px);
        }

        &::after {
          transform: translate(-50%, 4px);
        }
      }
    }

    span {
      position: relative;

      width: 18px;
      height: 2px;
      min-height: 2px;

      background-color: var(--dark-blue);
      border-radius: 10px;

      @include a.tablet {
        height: 2px;
      }

      &::before,
      &::after {
        position: absolute;
        left: 50%;

        display: block;

        width: 26px;
        height: inherit;
        min-height: inherit;

        background-color: var(--dark-blue);
        border-radius: 10px;

        transition: transform 0.3s ease;

        content: "";
      }

      &::before {
        transform: translate(-50%, -6px);
      }

      &::after {
        transform: translate(-50%, 6px);
      }
    }
  }

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    width: 100vw;
    height: 100vh;
    padding: 24px 56px;

    background: var(--dark-blue-10);

    @include a.tablet {
      padding: 24px;
    }

    @include a.mobile {
      padding: 16px;
    }
  }

  &__overlay-form {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000000;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    width: 100vw;
    height: 100vh;
    padding: 24px 56px;

    background: var(--dark-blue-20);

    @include a.tablet {
      padding: 24px 40px;
    }

    @include a.mobile {
      padding: 16px;
    }
  }

  &__menu {
    width: 100%;
    max-width: 1332px;
  }

  &__contact-form {
    width: 688px;
    height: 100%;

    background: var(--white);
    border-radius: 20px;

    .contact-form__wrapper {
      padding: 40px 60px;

      @include a.mobile {
        padding: 24px 32px;
      }
    }
  }
}
</style>
