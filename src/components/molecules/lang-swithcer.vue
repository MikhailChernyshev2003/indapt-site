<script setup lang="ts">
const { locale: currentLocale, localeCodes } = useI18n();
const { changeLocale } = useLocaleChange();

const showSwitcher = ref(false);
const langSwitcherRef = useTemplateRef('langSwitcherRef');

onClickOutside(langSwitcherRef, () => showSwitcher.value = false);
</script>

<template>
  <div ref="langSwitcherRef" class="lang-switcher">
    <button class="lang-switcher__button" @click="showSwitcher = !showSwitcher">
      {{ currentLocale }}
    </button>

    <transition name="enter-bottom">
      <div
        v-if="showSwitcher"
        class="lang-switcher__select"
        @click="showSwitcher = false"
      >
        <button
          v-for="locale in localeCodes"
          :key="locale"
          :class="bem('lang-switcher__select-button', {
            active: locale === currentLocale,
          })"
          @click="changeLocale(locale)"
        >
          <span>{{ locale }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.lang-switcher {
  position: relative;

  width: 28px;
}

.lang-switcher__button {
  width: 100%;

  color: var(--dark-blue);

  text-align: center;
  text-transform: uppercase;

  background-color: unset;

  transition: opacity 0.3s;

  @include t.button-s-semi;

  @include s.hover {
    opacity: 0.6;
  }
}

.lang-switcher__select {
  position: absolute;
  left: 50%;

  display: flex;
  margin-top: 14px;
  padding: 16px 28px;

  background-color: var(--white);

  border-radius: 16px;

  box-shadow: 0 4px 14px 0 var(--dark-blue-15);

  transform: translate(-50%);

  @include a.mobile {
    padding: 12px 10px;
  }
}

.lang-switcher__select-button {
  padding: 0 6px;

  color: var(--dark-blue-40);
  text-transform: uppercase;

  transition: color .15s ease;

  @include s.hover {
    color: var(--dark-blue-80);
  }

  @include t.button-s-semi;

  @include a.mobile {
    padding: 0 3px;
  }

  &_active {
    color: var(--dark-blue) !important;

    transition: none;
  }
}

.enter-bottom-enter-active,
.enter-bottom-leave-active {
  transition: 0.2s ease;
  transition-property: transform, opacity;
}

.enter-bottom-enter-from,
.enter-bottom-leave-to {
  transform: translate(-50%, -12px);
  opacity: 0;
}
</style>
