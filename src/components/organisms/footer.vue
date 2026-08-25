<script setup lang="ts">
import type { Component } from 'vue';

import {
  FOOTER_SOCIAL_URLS_INTL,
  FOOTER_SOCIAL_URLS_RU,
} from '~/shared/constants/footer-social';

const formHandler = useFormHandler();

const { t, locale } = useI18n();
const route = useRoute();

interface FooterSocialNavItem {
  id: number;
  href: string;
  icon: Component;
}

const openForm = () => {
  formHandler.handlerFormOpen(true);
  document.body.classList.add('lock');
};

const clientsLinks = computed(() => [
  {
    id: 0,
    text: t('footer.about'),
    href: '/about',
  },
  {
    id: 2,
    text: t('footer.contacts'),
    href: '/contacts',
  },
  {
    id: 3,
    text: t('footer.client'),
    href: '',
    action: () => {
      openForm();
    },
  },
  {
    id: 4,
    text: t('footer.expertise'),
    href: '/expertise',
  },
  {
    id: 6,
    text: t('footer.work'),
    href: '/work',
  },
]);

const handleLinkClick = (href: string, event?: Event) => {
  const currentPath = route.path;
  const localizedHref = href;

  if (currentPath === localizedHref && event) {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
};

const ruSocialLinks: FooterSocialNavItem[] = [
  {
    id: 5,
    icon: resolveComponent('svgo-social-vk'),
    href: FOOTER_SOCIAL_URLS_RU.vk,
  },
  {
    id: 9,
    icon: resolveComponent('svgo-social-stella'),
    href: FOOTER_SOCIAL_URLS_RU.dzen,
  },
  {
    id: 7,
    icon: resolveComponent('svgo-social-tg'),
    href: FOOTER_SOCIAL_URLS_RU.telegram,
  },
];

const intlSocialLinks: FooterSocialNavItem[] = [
  {
    id: 20,
    icon: resolveComponent('svgo-social-facebook'),
    href: FOOTER_SOCIAL_URLS_INTL.facebook,
  },
  {
    id: 21,
    icon: resolveComponent('svgo-social-x'),
    href: FOOTER_SOCIAL_URLS_INTL.x,
  },
  {
    id: 22,
    icon: resolveComponent('svgo-social-instagram'),
    href: FOOTER_SOCIAL_URLS_INTL.instagram,
  },
  {
    id: 23,
    icon: resolveComponent('svgo-social-linkedin'),
    href: FOOTER_SOCIAL_URLS_INTL.linkedin,
  },
  {
    id: 7,
    icon: resolveComponent('svgo-social-tg'),
    href: FOOTER_SOCIAL_URLS_INTL.telegram,
  },
];

const displayedSocialLinks = computed((): FooterSocialNavItem[] => {
  return locale.value === 'ru' ? ruSocialLinks : intlSocialLinks;
});
</script>

<template>
  <footer class="footer light-cursor">
    <svgo-logo-footer-fade class="footer__fade-logo" filled />
    <div class="container footer__container">
      <div class="footer__top">
        <div class="footer__top-clients">
          <span class="footer__tag">{{ t('footer.title') }}</span>
          <ul class="footer__top-list">
            <li
              v-for="link in clientsLinks"
              :key="link.text"
              class="footer__top-list-item"
            >
              <button
                v-if="link.action"
                class="footer__top-list-item-link"
                @click="link.action"
              >
                <span v-html="link.text" />
              </button>
              <NuxtLink
                v-else
                :to="link.href"
                class="footer__top-list-item-link"
                @click="(e: any) => handleLinkClick(link.href, e)"
              >
                <span v-html="link.text" />
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="footer__top-email-wrapper">
          <span class="footer__tag" v-html="t('footer.titleContact')" />
          <nuxt-link
            to="mailto:hello@indapt.net"
            class="footer__top-list-item-link"
          >
            hello@indapt.net
          </nuxt-link>
        </div>
      </div>

      <hr class="footer__line" />

      <nav class="footer__navigation">
        <div class="footer__navigation-list-wrapper">
          <TransitionGroup
            name="social-links"
            tag="ul"
            class="footer__navigation-list"
          >
            <li
              v-for="link in displayedSocialLinks"
              :key="link.id"
              class="footer__navigation-list-item"
            >
              <a
                :href="link.href"
                target="_blank"
                class="footer__navigation-list-item-link"
              >
                <component
                  :is="link.icon"
                  class="footer__navigation-list-item-icon"
                />
              </a>
            </li>
          </TransitionGroup>
        </div>
      </nav>

      <div class="footer__info">
        <p class="footer__info-text" v-html="t('footer.orgName')" />
        <div class="footer__info-line">
          <p class="footer__info-text" v-html="t('footer.address')" />

          <div class="footer__info-links">
            <nuxt-link to="/" class="footer__info-text footer__info-text-link">
              {{ t('footer.agreement') }}
            </nuxt-link>
            <div class="footer__info-stick" />
            <nuxt-link to="/" class="footer__info-text footer__info-text-link">
              {{ t('footer.policy') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.footer {
  position: relative;
  z-index: 1;

  padding: 40px 0 24px;
  overflow: hidden;

  background-color: var(--dark-blue);

  &__fade-logo {
    position: absolute;

    width: 1320px;
    height: 341px;
    inset: auto 60px -58px;

    @include a.tablet {
      width: 668px;
      inset: auto 40px 70px;

      height: 177px;
    }

    @include a.mobile {
      inset: auto 20px 176px;

      width: 335px;

      height: 105px;
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
  }

  &__tag {
    margin-bottom: 24px;

    color: var(--white-50);

    @include t.caption-s-semi-140;

    @include a.mobile {
      margin-bottom: 20px;
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 32px;

    @include a.tablet {
      flex-direction: column;
    }
  }

  &__top-clients {
    display: flex;
    flex-direction: column;
  }

  &__top-list {
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 16px 48px;

    @include a.tablet {
      gap: 16px 36px;
      margin-bottom: 32px;
    }

    @include a.mobile {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  &__top-list-item-link {
    color: var(--white);
    text-wrap: nowrap;

    transition: color v.$timing;

    @include t.lead-m-medium;

    @include a.tablet {
      @include t.body-l-semi;
    }

    @include s.hover {
      color: var(--white-70);
    }
  }

  &__top-email-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    @include a.tablet {
      align-items: flex-start;
    }
  }

  &__line {
    width: 100%;
    height: 2px;
    margin-bottom: 32px;

    background-color: var(--white-10);
    border: unset;
    border-radius: 999px;
  }

  &__navigation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 228px;

    @include a.tablet {
      justify-content: flex-start;
      margin-bottom: 140px;
    }

    @include a.mobile {
      margin-bottom: 114px;
    }
  }

  &__navigation-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-right: 24px;

    background-color: var(--white-5);
    border-radius: 100px;
    transform: rotate(180deg);

    transition: transform 0.5s ease, background v.$timing;

    @include s.hover {
      background: var(--white-30);
      border-radius: 50%;
    }

    &_active {
      transform: rotate(0deg);
    }

    svg {
      width: 24px;
      height: 24px;

      color: var(--white);
    }
  }

  &__navigation-list-wrapper {
    max-width: 345px;
    overflow: hidden;

    transition: max-width 0.5s ease;

    @include a.tablet {
      max-width: none;
      overflow: visible;
    }

    &_expanded {
      max-width: 1000px;
    }
  }

  &__navigation-list {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @include a.tablet {
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }

  &__navigation-list-item {
    transform: backgroind v.$timing;

    @include a.mobile {
      margin: 0 16px 16px 0;
    }

    @include s.hover {
      background: var(--white-10);
      border-radius: 50%;
    }

    &:not(:last-child) {
      margin-right: 16px;
    }
  }

  &__navigation-list-item-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;

    background-color: var(--white-20);
    border-radius: 100px;
    backdrop-filter: blur(4px);
  }

  &__navigation-list-item-icon {
    width: 18px;
    height: 18px;

    color: var(--white);
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__info-text {
    color: var(--white-70);

    @include t.caption-s-medium;
  }

  &__info-text-link {
    transition: color v.$timing;

    @include s.hover {
      color: var(--white);
    }
  }

  &__info-line {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-top: 4px;

    @include a.tablet {
      flex-direction: column;
      align-items: flex-start;
      max-width: 530px;
    }
  }

  &__info-links {
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 12px;

    @include a.tablet {
      padding-top: 12px;
    }

    @include a.mobile {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }

  &__info-stick {
    width: 1px;

    background-color: var(--white-80);
    border-radius: 100px;

    @include a.mobile {
      display: none;
    }
  }
}
</style>
