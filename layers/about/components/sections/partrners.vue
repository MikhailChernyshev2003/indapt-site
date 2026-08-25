<script setup lang="ts">
import MicrosoftLogo from '@l-about/assets/images/microsoft.png';
import GoogleLogo from '@l-about/assets/images/google.png';
import DivLogo from '@l-about/assets/images/div.png';

const { isDesktop } = useDevice();
const formHandler = useFormHandler();

const { t } = useI18n();

const blocks: {
  logo: string;
  num: string;
  paragraphs: string[];
}[][] = [
  [
    {
      num: '01',
      logo: MicrosoftLogo,
      paragraphs: [
        t('aboutPage.partners.partner1'),
      ],
    },
    {
      num: '02',
      logo: GoogleLogo,
      paragraphs: [
        t('aboutPage.partners.partner1'),
      ],
    },
    {
      num: '03',
      logo: DivLogo,
      paragraphs: [
        t('aboutPage.partners.partner1'),
      ],
    },
  ],

  [
    {
      num: '04',
      logo: GoogleLogo,
      paragraphs: [
        t('aboutPage.partners.partner1'),
      ],
    },
    {
      num: '05',
      logo: DivLogo,
      paragraphs: [
        t('aboutPage.partners.partner1'),
      ],
    },
  ],
];

const blocksFlat: {
  logo: string;
  num: string;
  paragraphs: string[];
}[] = [
  {
    num: '01',
    logo: MicrosoftLogo,
    paragraphs: [
      t('aboutPage.partners.partner1'),
    ],
  },
  {
    num: '02',
    logo: GoogleLogo,
    paragraphs: [
      t('aboutPage.partners.partner1'),
    ],
  },
  {
    num: '03',
    logo: DivLogo,
    paragraphs: [
      t('aboutPage.partners.partner1'),
    ],
  },
  {
    num: '04',
    logo: GoogleLogo,
    paragraphs: [
      t('aboutPage.partners.partner1'),
    ],
  },
  {
    num: '05',
    logo: DivLogo,
    paragraphs: [
      t('aboutPage.partners.partner1'),
    ],
  },
];

const openForm = () => {
  formHandler.handlerFormOpen(true);
  document.body.classList.add('lock');
};

const flatItemClassSuffix = (idx: number) => (idx < 3 ? `0-${idx}` : `1-${idx - 3}`);
</script>

<template>
  <section class="partners">
    <div class="partners__wrapper">
      <h2 class="partners__title">{{ t('aboutPage.partners.title') }}</h2>
      <div class="partners__info">
        <p class="partners__info-text">
          <span class="partners__info-text_caption">(info)</span>
          <span v-html="t('aboutPage.partners.text')" />
        </p>
        <atoms-button
          mode="secondary"
          class="partners__info-button"
          @click="openForm"
        >
          {{ t('aboutPage.partners.button') }}
        </atoms-button>
      </div>
      <div class="partners__content">
        <template v-if="isDesktop">
          <div
            v-for="(row, index) in blocks"
            :key="`row-${index}`"
            :class="`partners__content-row partners__content-row_${index}`"
          >
            <div
              v-for="(item, idx) in row"
              :key="`row-${index}-item-${idx}`"
              :class="`partners__content-row-item partners__content-row-item_${index}-${idx}`"
            >
              <p class="partners__content-row-item-num">({{ item.num }})</p>
              <img
                :src="item.logo"
                alt="logo"
                class="partners__content-row-item-logo"
              />
              <div class="partners__content-row-item-texts">
                <p
                  v-for="(p, pIdx) in item.paragraphs"
                  :key="`row-${index}-item-${idx}-p-${pIdx}`"
                  class="partners__content-row-item-text"
                  v-html="p"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item, idx) in blocksFlat"
            :key="`item-${idx}`"
            :class="`partners__content-row-item partners__content-row-item_${flatItemClassSuffix(idx)}`"
          >
            <p class="partners__content-row-item-num">({{ item.num }})</p>
            <img
              :src="item.logo"
              alt="logo"
              class="partners__content-row-item-logo"
            />
            <div class="partners__content-row-item-texts">
              <p
                v-for="(p, pIdx) in item.paragraphs"
                :key="`item-${idx}-p-${pIdx}`"
                class="partners__content-row-item-text"
                v-html="p"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.partners {
  &__wrapper {
    width: 100%;
    overflow: hidden;
  }

  &__title {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__info {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 20px;

    @include a.tablet {
      display: block;
    }
  }

  &__info-text {
    max-width: 857px;

    @include t.lead-m-medium;

    @include a.mobile {
      @include t.body-m-medium;
    }

    &_caption {
      display: inline-block;
      margin-right: 32px;

      @include t.caption-m-medium;

      @include a.mobile {
        margin-right: 12px;

        @include t.caption-xs-medium;
      }
    }
  }

  &__info-button {
    padding: 14px 28px;

    border: 1px solid var(--dark-blue-80);
    height: 48px;

    @include a.tablet {
      margin-top: 32px;
    }

    :deep(.button__container) {
      font-size: 16px;
    }

    :deep(.button__dot) {
      margin-top: 0;
    }
  }

  &__content {
    width: 100%;
    margin-top: 52px;

    @include a.tablet {
      display: grid;
      grid-gap: 16px;
      grid-template-columns: repeat(2, 1fr);
      margin-top: 56px;
    }

    @include a.mobile {
      grid-gap: 12px;
      grid-template-columns: 1fr;
      margin-top: 52px;
    }

    &-row {
      display: flex;
      flex-wrap: nowrap;
      gap: 16px;
      width: 100%;

      &:not(:first-child) {
        margin-top: 16px;
      }

      &-item {
        position: relative;
        z-index: 1;

        display: flex;
        flex-direction: column;
        width: 312px;
        height: 240px;
        padding: 24px;

        background: #eaefff;
        border: 1px solid var(--dark-blue-10);
        border-radius: 16px;

        transition: width 0.5s, background 0.5s;

        @include a.tablet {
          width: 100%;
          height: auto;
          min-height: 170px;
          gap: 12px;
          margin-left: 0;
        }

        @include a.desktop-only {
          @include s.hover {
            width: 651px;

            background: var(--white);

            .partners__content-row-item-logo {
              transform: translateY(-158px) scale(1.085);
            }

            .partners__content-row-item-num {
              opacity: 0;
            }

            .partners__content-row-item-texts {
              opacity: 1;

              transition-delay: 0.5s;
            }
          }
        }

        &_0-2,
        &_2-2 {
          margin-left: auto;

          @include a.tablet {
            margin-left: 0;
          }
        }

        &_1-0 {
          margin-left: calc(318px + 16px);

          @include a.tablet {
            margin-left: 0;
          }
        }

        &-num {
          color: var(--dark-blue-80);

          transition: opacity 0.3s;

          @include t.caption-l-semi;

          @include a.mobile {
            color: var(--dark-blue-60);

            @include t.body-xs-medium;
          }
        }

        &-logo {
          position: absolute;
          bottom: 24px;

          height: 32px;
          object-fit: contain;

          transform-origin: left center;

          transition: transform 0.3s;

          @include a.tablet {
            position: static;
            height: 28px;
            margin-top: auto;
            transform: none;
          }
        }

        &-texts {
          position: absolute;
          bottom: 24px;
          left: 24px;
          z-index: 1;

          width: calc(100% - 48px);

          color: var(--dark-blue-90);

          opacity: 0;

          transition: opacity 0.2s;

          @include t.body-s-medium;

          @include a.tablet {
            position: static;
            flex: 1;
            width: auto;
            opacity: 1;
            transition: none;
          }
        }
      }
    }
  }
}
</style>
