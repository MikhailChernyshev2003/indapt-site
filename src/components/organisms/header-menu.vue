<script setup lang="ts">
import { NuxtLink } from '#components';
import CloseIcon from 'assets/icons/close-icon.svg';
import { EXPERTISE_NAV_HREFS, EXPERTISE_NAV_I18N_KEYS } from '~/shared/constants';
import type { NavigationItem } from '~/types/navigation';

const { t, locale: currentLocale, localeCodes } = useI18n();
const { changeLocale } = useLocaleChange();

const NAVIGATION: ComputedRef<NavigationItem[]> = computed(() => [
  {
    to: '/about',
    name: t('header.about'),
  },
  {
    to: '/expertise',
    name: t('header.expertise'),
    sublinks: EXPERTISE_NAV_HREFS.map((to, i) => ({
      to,
      name: t(EXPERTISE_NAV_I18N_KEYS[i]),
    })),
  },
  {
    to: '/work',
    name: t('header.work'),
  },
  {
    to: '/contacts',
    name: t('header.contacts'),
  },
]);

const { isDesktop, isTabletOrDesktop, isMobile } = useDevice();

const activeItem = ref<Partial<NavigationItem>>({});

const setActiveItem = (value: Partial<NavigationItem>) => {
  if (activeItem.value.name === value.name && !isDesktop.value) {
    activeItem.value = {};
    return;
  }

  activeItem.value = value;
};

const adaptedSubmenu = computed(() => {
  if (!activeItem.value?.sublinks) return [];

  const sublinks = activeItem.value.sublinks;
  const middleIndex = Math.ceil(sublinks.length / 2);

  return [sublinks.slice(0, middleIndex), sublinks.slice(middleIndex)];
});

const handleMenuClick = (item: Partial<NavigationItem>) => {
  if (!isDesktop.value) {
    setActiveItem(item);
  }
  else {
    emits('close');
  }
};

const emits = defineEmits(['close', 'open-form']);
</script>

<template>
  <div class="header-menu">
    <div class="header-menu__wrapper">
      <div class="header-menu__header">
        <nuxt-link href="/">
          <atoms-logo class="header-menu__logo" />
        </nuxt-link>
        <button class="header-menu__close" @click="emits('close')">
          <span class="header-menu__close-text">{{ t('header.close') }}</span>
          <close-icon class="header-menu__close-icon" />
        </button>
      </div>
      <div
        class="header-menu__content"
        @mouseleave="isDesktop && setActiveItem({})"
      >
        <div class="header-menu__content-holder">
          <div class="header-menu__content-list">
            <div
              v-for="item in NAVIGATION"
              :key="item.name"
              class="header-menu__content-list-el"
              @mouseenter="isDesktop && setActiveItem(item)"
              @click="handleMenuClick(item)"
            >
              <component
                :is="(item?.sublinks && !isDesktop) ? 'div' : NuxtLink"
                class="header-menu__content-list-item"
                :class="{
                  'header-menu__content-list-item_active':
                    item.name === activeItem.name,
                  'header-menu__content-list-item_with-sub': item?.sublinks,
                }"
                :to="item.to"
                @click="!item?.sublinks && emits('close')"
              >
                <span v-html="item.name" />
              </component>
              <client-only v-if="isMobile && item.name === activeItem.name">
                <transition name="fade" appear>
                  <div
                    v-if="activeItem?.sublinks"
                    class="header-menu__content-sub"
                    @click.stop
                  >
                    <div
                      v-for="(list, idx) in adaptedSubmenu"
                      :key="idx"
                      class="header-menu__content-sub-list"
                    >
                      <nuxt-link
                        v-for="item in list"
                        :key="item.name"
                        :to="item.to"
                        class="header-menu__content-sub-list-item"
                        @click="emits('close')"
                      ><span v-html="item.name" /></nuxt-link>
                    </div>
                  </div>
                </transition>
              </client-only>
            </div>
          </div>
          <client-only>
            <template v-if="isTabletOrDesktop">
              <transition name="fade" appear>
                <div
                  v-if="activeItem?.sublinks"
                  class="header-menu__content-sub"
                >
                  <div
                    v-for="(list, idx) in adaptedSubmenu"
                    :key="idx"
                    class="header-menu__content-sub-list"
                  >
                    <nuxt-link
                      v-for="item in list"
                      :key="item.name"
                      :to="item.to"
                      class="header-menu__content-sub-list-item"
                      @click="emits('close')"
                    ><span v-html="item.name" /></nuxt-link>
                  </div>
                </div>
              </transition>
            </template>
          </client-only>
        </div>
      </div>

      <div class="header-menu__actions">
        <atoms-button
          class="header-menu__actions-button"
          mode="secondary"
          @click="emits('open-form')"
        >
          {{ t('header.button') }}
        </atoms-button>

        <div class="header-menu__langs">
          <p class="header-menu__langs-text">{{ t('header.langSetting') }}</p>
          <div class="header-menu__langs-list">
            <button
              v-for="locale in localeCodes"
              :key="locale"
              :class="
                bem('header-menu__langs-list-item', {
                  active: locale === currentLocale,
                })
              "
              @click="changeLocale(locale)"
              v-text="locale"
            />
          </div>
        </div>
      </div>
    </div>

    <img
      v-if="isDesktop"
      src="/images/header-menu/decor.svg"
      class="header-menu__decor"
      :class="{
        'header-menu__decor_hide': adaptedSubmenu.length,
      }"
    />
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;
@use "@/assets/styles/adaptive" as a;

.header-menu {
  position: relative;
  z-index: 1;

  height: max-content;
  overflow-y: auto;

  background: var(--white);

  border-radius: 20px;

  @include s.no-scrollbar;

  @include a.tablet {
    overscroll-behavior: none;
  }

  @include a.mobile {
    height: 100%;
  }

  &__wrapper {
    position: relative;
    z-index: 2;

    height: max-content;

    border-radius: 20px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 29px 40px;

    @include a.mobile {
      padding: 24px;
    }
  }

  &__logo {
    height: 30px;
  }

  &__close {
    display: flex;
    align-items: center;

    color: var(--dark-blue);

    @include s.hover {
      .header-menu__close-icon {
         transform: scaleY(0.7);
      }
    }

    &-text {
      margin-right: 12px;

      @include t.button-m-semi;

      @include a.mobile {
        display: none;
      }
    }

    &-icon {
      width: 32px !important;
      height: 32px !important;

      transition: transform 0.3s;
    }
  }

  &__content {
    padding: 40px 40px 60px;

    border-top: 1px solid var(--dark-blue-10);

    @include a.mobile {
      padding: 24px;
    }

    &-holder {
      display: flex;
      width: max-content;
      min-width: 260px;
      max-width: 100%;

      @include a.tablet {
        min-width: 312px;
      }

      @include a.mobile {
        min-width: 100%;
      }
    }

    &-list {
      flex-shrink: 0;
      width: 100%;
      max-width: 260px;
      padding-right: 12px;

      @include a.tablet {
        max-width: 312px;
        padding-right: 16px;
      }

      @include a.mobile {
        max-width: 100%;
        padding: 0;
      }

      &-item {
        position: relative;
        z-index: 1;

        display: block;
        padding: 12px 18px;

        color: var(--dark-blue);

        border-radius: 12px;

        transition: background 0.2s;

        @include t.body-l-medium;

        @include a.mobile {
          padding: 8px 16px 12px;

          @include t.body-s-medium;
        }

        &_with-sub {
          &::before {
            position: absolute;
            top: 18px;
            right: 18px;
            z-index: 2;

            width: 12px;
            height: 12px;

            background-image: url("@/assets/icons/chevron-down.svg");

            transform: rotate(-90deg);
            opacity: 0;

            transition: transform 0.2s;

            content: "";

            @include a.mobile {
              opacity: 1;
              top: 14px;
              right: 14px;

              width: 16px;
              height: 16px;

              transform: rotate(0);
            }
          }
        }

        &_active {
          background: #f9fafb;

          &::before {
            opacity: 1;

            @include a.tablet {
              transform: rotate(-90deg);
            }

            @include a.mobile {
              transform: rotate(180deg);
            }
          }
        }
      }

      &-el {
        &:not(:first-child) {
          margin-top: 12px;

          @include a.mobile {
            margin-top: 8px;
          }
        }
      }
    }

    &-sub {
      display: flex;
      flex: 1;
      width: 1052px;
      padding: 32px;

      background: #f9fafb;
      border-radius: 12px;

      @include a.tablet {
        display: block;
        width: 430px;
      }

      @include a.mobile {
        width: 100%;
        margin-top: 8px;
        padding: 16px;
      }

      &-list {
        &:last-child {
          margin-left: 42px;

          @include a.tablet {
            margin-left: 0;
          }

          @include a.mobile {
            margin-top: 16px;
          }
        }

        &-item {
          display: block;

          color: var(--dark-blue);

          transition: opacity 0.2s;

          @include t.body-l-medium;

          @include s.hover {
            opacity: 0.6;
          }

          @include a.mobile {
            @include t.body-s-medium;
          }

          &:not(:last-child) {
            margin-bottom: 24px;

            @include a.mobile {
              margin-bottom: 16px;
            }
          }
        }
      }
    }
  }

  &__actions {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 40px 40px;

    @include a.mobile {
      display: block;
      padding: 0 24px 24px;
    }

    &-button {
      @include a.mobile {
        width: 200px;
        height: 50px;
      }
    }
  }

  &__langs {
    @include a.mobile {
      margin-top: 24px;
    }

    &-text {
      color: var(--dark-blue);
      text-align: right;

      @include t.caption-s-medium;

      @include a.mobile {
        text-align: left;
      }
    }

    &-list {
      display: flex;
      margin-top: 16px;

      &-item {
        width: 44px;
        height: 44px;

        color: var(--dark-blue);
        text-transform: uppercase;

        background: #cbdcfe;
        border-radius: 50%;

        transition: opacity 0.2s;

        @include t.caption-s-medium;

        @include s.hover {
          opacity: 0.5;
        }

        @include a.mobile {
          width: 34px;
          height: 34px;

          @include t.caption-xs-medium;

          &:not(:first-child) {
            margin-left: 8px;
          }
        }

        &:not(:first-child) {
          margin-left: 16px;

          @include a.mobile {
            margin-left: 8px;
          }
        }

        &_active {
          color: var(--white);

          background: var(--dark-blue);
        }
      }
    }
  }

  &__decor {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;

    height: 100%;

    transform: scale(1);
    transform-origin: bottom right;
    opacity: 0.6;

    transition: opacity 1s, transform 1s;

    pointer-events: none;

    &_hide {
      transform: scale(0);
      opacity: 0;
    }
  }
}
</style>
