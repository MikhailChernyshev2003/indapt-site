<script setup lang="ts">
import MicrosoftLogo from '@l-about/assets/images/tech-partners/microsoft.svg?url';
import GoogleLogo from '@l-about/assets/images/tech-partners/google.svg?url';
import YandexLogo from '@l-about/assets/images/tech-partners/yandex.svg?url';
import YandexEnLogo from '@l-about/assets/images/tech-partners/yandex-en.svg?url';
import VkTechLogo from '@l-about/assets/images/tech-partners/vk-tech.svg?url';
import MwsLogo from '@l-about/assets/images/tech-partners/mws.svg?url';
import AmoCrmLogo from '@l-about/assets/images/tech-partners/amocrm.svg?url';
import OneCLogo from '@l-about/assets/images/tech-partners/1c.svg?url';
import Bitrix24Logo from '@l-about/assets/images/tech-partners/bitrix24.svg?url';
import KonturLogo from '@l-about/assets/images/tech-partners/kontur.svg?url';

const { isDesktop } = useDevice();
const formHandler = useFormHandler();

const { t, locale } = useI18n();

// Логотип — картинка либо, пока нет официального файла (СберТех), название текстом
type PartnerLogo = { alt: string; src?: string; text?: string; square?: boolean };

type PartnerCard = {
  num: string;
  // В восьмой карточке несколько логотипов, а на развороте — список остальных партнёров
  logos: PartnerLogo[];
  paragraphs: string[];
};

const cards = computed<PartnerCard[]>(() => [
  { num: '01', logos: [{ src: MicrosoftLogo, alt: 'Microsoft' }], paragraphs: [t('aboutPage.partners.list.microsoft')] },
  { num: '02', logos: [{ src: GoogleLogo, alt: 'Google' }], paragraphs: [t('aboutPage.partners.list.google')] },
  {
    num: '03',
    logos: [{ src: locale.value === 'ru' ? YandexLogo : YandexEnLogo, alt: 'Yandex' }],
    paragraphs: [t('aboutPage.partners.list.yandex')],
  },
  { num: '04', logos: [{ src: VkTechLogo, alt: 'VK Tech' }], paragraphs: [t('aboutPage.partners.list.vk')] },
  { num: '05', logos: [{ text: t('aboutPage.partners.list.sbertechName'), alt: 'SberTech' }], paragraphs: [t('aboutPage.partners.list.sbertech')] },
  // Знак MWS квадратный — его выводим крупнее, иначе буквы не читаются
  { num: '06', logos: [{ src: MwsLogo, alt: 'MTS Web Services', square: true }], paragraphs: [t('aboutPage.partners.list.mws')] },
  { num: '07', logos: [{ src: AmoCrmLogo, alt: 'amoCRM' }], paragraphs: [t('aboutPage.partners.list.amocrm')] },
  {
    num: '08',
    logos: [
      { src: OneCLogo, alt: '1C' },
      { src: Bitrix24Logo, alt: 'Bitrix24' },
      { src: KonturLogo, alt: 'Kontur' },
    ],
    paragraphs: [t('aboutPage.partners.list.othersTitle'), t('aboutPage.partners.list.others')],
  },
]);

// Раскладка по макету (Партнерство, 8 шт): ряды 3 + 2 + 3
const ROW_SIZES = [3, 2, 3];

const blocks = computed(() => {
  let offset = 0;
  return ROW_SIZES.map((size) => {
    const row = cards.value.slice(offset, offset + size);
    offset += size;
    return row;
  });
});

const openForm = () => {
  formHandler.handlerFormOpen(true);
  document.body.classList.add('lock');
};

const flatItemClassSuffix = (idx: number) => {
  let offset = 0;
  for (let row = 0; row < ROW_SIZES.length; row++) {
    if (idx < offset + ROW_SIZES[row]) return `${row}-${idx - offset}`;
    offset += ROW_SIZES[row];
  }
  return '';
};
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
              <div
                class="partners__content-row-item-logo"
                :class="{ 'partners__content-row-item-logo_multi': item.logos.length > 1 }"
              >
                <template v-for="logo in item.logos" :key="logo.alt">
                  <img
                    v-if="logo.src"
                    :src="logo.src"
                    :alt="logo.alt"
                    class="partners__content-row-item-logo-img"
                    :class="{ 'partners__content-row-item-logo-img_square': logo.square }"
                  />
                  <span v-else class="partners__content-row-item-logo-text">{{ logo.text }}</span>
                </template>
              </div>
              <div class="partners__content-row-item-texts">
                <div
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
            v-for="(item, idx) in cards"
            :key="`item-${idx}`"
            :class="`partners__content-row-item partners__content-row-item_${flatItemClassSuffix(idx)}`"
          >
            <p class="partners__content-row-item-num">({{ item.num }})</p>
            <div
              class="partners__content-row-item-logo"
              :class="{ 'partners__content-row-item-logo_multi': item.logos.length > 1 }"
            >
              <template v-for="logo in item.logos" :key="logo.alt">
                <img
                  v-if="logo.src"
                  :src="logo.src"
                  :alt="logo.alt"
                  class="partners__content-row-item-logo-img"
                  :class="{ 'partners__content-row-item-logo-img_square': logo.square }"
                />
                <span v-else class="partners__content-row-item-logo-text">{{ logo.text }}</span>
              </template>
            </div>
            <div class="partners__content-row-item-texts">
              <div
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
        // По макету 4 колонки по 318px с промежутком 16px ровно занимают контейнер 1320px:
        // при 312px крайняя правая карточка прижималась к краю, а остальные стояли по сетке 312 —
        // ряды съезжали относительно друг друга
        width: 318px;
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
            width: 652px; // две колонки и промежуток: 318 * 2 + 16

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

        // Третий ряд по макету: (06) в первой колонке, (07) и (08) — в третьей и четвёртой

        &_0-2,
        &_2-1 {
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

          display: flex;
          gap: 20px;
          align-items: center;
          height: 32px;

          transform-origin: left center;

          transition: transform 0.3s;

          @include a.tablet {
            position: static;
            height: 28px;
            margin-top: auto;
            transform: none;
          }

          // Несколько логотипов в одной карточке — чуть мельче, чтобы уместились в ширину
          &_multi {
            gap: 12px;
            height: 20px;
          }
        }

        &-logo-img {
          width: auto;
          height: 100%;
          object-fit: contain;

          &_square {
            height: 56px;

            @include a.tablet {
              height: 48px;
            }
          }
        }

        &-logo-text {
          color: var(--dark-blue);

          @include t.h5;

          font-weight: 600;
          white-space: nowrap;
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

          // Список остальных партнёров в восьмой карточке
          :deep(ul) {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 8px;
            padding-left: 18px;

            list-style: disc;
          }

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
