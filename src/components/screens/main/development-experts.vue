<script setup lang="ts">
import ArrowIcon from '~/assets/icons/arrow-up-right-compact.svg';
import { EXPERTISE_NAV_HREFS, EXPERTISE_NAV_I18N_KEYS } from '~/shared/constants';

const { t } = useI18n();

const linksList = computed(() =>
  EXPERTISE_NAV_HREFS.map((href, i) => ({
    id: i,
    caption: `(${String(i + 1).padStart(2, '0')})`,
    href,
    title: t(EXPERTISE_NAV_I18N_KEYS[i]),
  })),
);
</script>

<template>
  <section class="development-experts">
    <div class="development-experts__container container">
      <h2 class="development-experts__title" v-html="t('mainPage.developmentExperts.title')" />

      <ul class="development-experts__list">
        <li
          v-for="link in linksList"
          :key="link.id"
          class="development-experts__list-item"
        >
          <nuxt-link
            :to="link.href"
            class="development-experts__list-item-link"
          >
            <span
              class="development-experts__list-item-caption"
              v-html="link.caption"
            />
            <hr class="development-experts__list-item-line" />
            <div class="development-experts__list-item-info">
              <h3
                class="development-experts__list-item-title"
                v-html="link.title"
              />

              <div class="development-experts__arrow">
                <div class="development-experts__arrow-icon-wrapper">
                  <arrow-icon class="development-experts__arrow-icon" />
                  <arrow-icon class="development-experts__arrow-icon" />
                </div>
              </div>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/variables" as v;

.development-experts {
  position: relative;

  width: 100%;
  min-height: 100vh;
  padding-top: 152px;

  @include a.tablet {
    padding-top: 110px;
  }

  @include a.mobile {
    padding-top: 94px;
  }

  &__container {
    display: flex;
    flex-direction: column;
  }

  &__title {
    margin-bottom: 60px;

    color: var(--dark-blue);

    @include t.h1;

    @include a.tablet {
      margin-bottom: 56px;
    }

    @include a.mobile {
      margin-bottom: 32px;

      font-size: 28px !important;

      @include t.h4;

      br {
        display: none;
      }
    }

    & * {
      font-family: v.$font-involve;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 54px 34px;

    @include a.tablet {
      grid-template-columns: repeat(2, 1fr);
      gap: 63px 20px;
    }

    @include a.mobile {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  &__list-item-caption {
    margin-bottom: 16px;

    color: var(--dark-blue-60);
    font-weight: 500;
    font-size: 18px;
    line-height: 128%;

    transition: color v.$timing;

    @include a.mobile {
      margin-bottom: 7px;

      font-weight: 600;
      font-size: 16px;
      line-height: 140%;
    }
  }

  &__list-item-line {
    width: 100%;
    height: 1px;
    margin-bottom: 16px;

    background-color: var(--dark-blue-30);
    border: unset;

    transition: background-color v.$timing;

    @include a.mobile {
      margin-bottom: 8px;
    }
  }

  &__list-item-link {
    display: flex;
    flex-direction: column;

    &:hover {
      .development-experts {
        &__list-item-caption,
        &__list-item-title {
          color: var(--dark-blue);
        }

        &__arrow {
          opacity: 1;
        }

        &__list-item-line {
          background-color: var(--dark-blue);
        }

        &__arrow {
          transform: scale(1.1);
        }

        &__arrow-icon {
          transition: transform 0.3s ease-in-out;

          &:nth-child(1) {
            transform: translate(150%, -150%);
          }

          &:nth-child(2) {
            transform: translate(0, 0);
          }
        }
      }
    }
  }

  &__list-item-info {
    display: flex;
    justify-content: space-between;
  }

  &__list-item-title {
    color: var(--dark-blue-60);
    font-weight: 500;
    font-size: 20px;
    line-height: 130%;
    letter-spacing: 0.2px;

    transition: background-color v.$timing;

    @include a.mobile {
      font-size: 18px;
      line-height: 128%;
      letter-spacing: 0;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;

    background-color: unset;
    border: 1px solid var(--dark-blue);
    border-radius: 516.129px;
    opacity: 0;

    transition: opacity v.$timing;

    @include a.mobile {
      display: none;
    }
  }

  &__link-icon {
    width: 20px;
    height: 20px;

    transform: rotate(-45deg);
  }

  &__shape {
    position: absolute;
    right: -200px;
    bottom: -129px;
    z-index: 1;

    width: 750px !important;

    pointer-events: none;

    @media screen and (max-width: 1299px) {
      bottom: 50px;
      right: -150px;
    }

    @include a.tablet {
      right: -170px;
      bottom: -50px;
    }

    @include a.mobile {
      right: -220px;
      bottom: 10px;

      width: 500px !important;
    }
  }
}

.development-experts__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-top: auto;

  color: var(--dark-blue);

  border: 1px solid var(--dark-blue-20);
  border-radius: 50%;

  transform-origin: bottom left;
  opacity: 0;

  transition: transform 0.15s ease;

  &-icon-wrapper {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 12px;
    height: 12px;
    overflow: hidden;
  }

  &-icon {
    position: absolute;

    width: 12px;
    height: 12px;

    &:nth-child(2) {
      transform: translate(-150%, 150%);
    }
  }
}
</style>
