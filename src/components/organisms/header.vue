<script setup lang="ts">
const isBurgerOpen = ref(false);
const formHandler = useFormHandler();

const { t } = useI18n();

const { isFormOpen, isPresentationFormOpen } = storeToRefs(formHandler);

// «Получить презентацию» — только в шапке страницы «О компании»
const route = useRoute();
const isAboutPage = computed(() => route.path.replace(/\/+$/, '') === '/about');

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

const handlerPresentationForm = () => {
  const willOpen = !isPresentationFormOpen.value;
  formHandler.handlerPresentationFormOpen(willOpen);
  document.body.classList.toggle('lock', willOpen);
};

const logoAnim = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      // Знак «in» вместо полного логотипа — вместе со сжатием шапки, с первых пикселей прокрутки
      trigger: 'body',
      start: 'top top',
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
  // По макету знак «in» в сжатой шапке ровно в высоту полного логотипа (30px, на мобильном 26px):
  // буквы «in» занимают 237 из 292 единиц высоты svg, поэтому scale = 292 / 237,
  // а yPercent возвращает центр знака на середину шапки
  tl.to('.header__logo', {
    scale: 292 / 237,
    yPercent: 11.6,
    duration: 2,
  }, '<');
};

// «Стекло» и линия шапки появляются только с началом прокрутки, в самом верху страницы шапка прозрачная
const isScrolled = ref(false);

const onScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  logoAnim();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <header class="header" :class="{ header_scrolled: isScrolled }">
    <div class="container header__container">
      <nuxt-link href="/" class="header__logo-link">
        <!-- <atoms-logo class="header__logo header__logo_full" type-mobile="min" />
        <atoms-logo class="header__logo header__logo_min" type="min" /> -->
        <atoms-logo-for-anim class="header__logo" />
      </nuxt-link>

      <div class="header__control">
        <atoms-button-animated-dot
          v-if="isAboutPage"
          class="header__client header__presentation"
          @click="handlerPresentationForm"
        >
          {{ t('header.presentation') }}
        </atoms-button-animated-dot>

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
      <transition name="fade" appear>
        <teleport to="body">
          <div
            v-if="isPresentationFormOpen"
            class="header__overlay-form"
            @click="handlerPresentationForm"
          >
            <organisms-presentation-form
              class="header__contact-form"
              @click.stop
              @close="handlerPresentationForm"
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

// По макету (О компании, 06.10) у шапки два состояния:
// - вверху страницы — 88px (планшет 72px, телефон 52px), полный логотип, без подложки и линии;
// - с началом прокрутки — 70px (телефон те же 52px), знак «in», «стекло» и линия снизу.
// Элементы по центру, линия лежит внутри высоты.
// Подложка — только нижняя треть шапки плавно подсвечивается sea-blue до ~9% у линии.
// Размытие задаётся переменной --header-blur: главная и «Экспертиза» снимают его, когда под шапкой
// своя размытая панель. Размытие живёт на ::before — так «стекло» плавно проявляется через opacity
// (backdrop-filter на самой шапке сделал бы её backdrop root, и размытие ::before перестало бы работать)

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;

  // Ширину задают left/right: с 100vw шапка заезжала под постоянную полосу
  // прокрутки (Chrome с мышью или «показывать всегда»), и её размытие
  // рисовало там серую полосу-«тень» справа

  display: flex;
  align-items: center;
  height: 88px;

  border-bottom: 1px solid transparent;

  transition: height 0.4s ease, border-color 0.4s ease;

  @include a.tablet {
    height: 72px;
  }

  @include a.mobile {
    height: 52px;
  }

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;

    background: linear-gradient(180deg, var(--sea-blue-0) 62%, color-mix(in srgb, var(--sea-blue) 9%, transparent) 100%);
    opacity: 0;
    backdrop-filter: blur(var(--header-blur, 30px));

    transition: opacity 0.4s ease;

    content: "";
    pointer-events: none;
  }

  &_scrolled {
    height: 70px;

    border-bottom-color: rgb(51 135 255 / 20%);

    @include a.mobile {
      height: 52px;
    }

    &::before {
      opacity: 1;
    }
  }

  &_gradient {
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) 23.53%, rgb(255 255 255 / 100%) 154.55%);
  }

  &__container {
    display: flex;
    flex-grow: 1;
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

    @include a.mobile {
      height: 26px;
    }

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

    &.header__presentation {
      margin-right: 40px;
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
