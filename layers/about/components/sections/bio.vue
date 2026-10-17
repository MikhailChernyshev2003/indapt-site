<script setup lang="ts">
import BitkinInactive from '@l-about/assets/images/bitkin-inactive.png';
import BitkinActive from '@l-about/assets/images/bitkin-active.png';
import DruzinInactive from '@l-about/assets/images/druzin-inactive.png';
import DruzinActive from '@l-about/assets/images/druzin-active.png';

const { isDesktop } = useDevice();

const { t, locale } = useI18n();

const fadeKey = ref(0);

const activeTab = ref(null);
const activeType = ref('bio');
const activeIdx = ref(0);
const mobileActiveTypes = ref<string[]>(['bio', 'bio']);

const list = computed(() => [
  {
    img: BitkinInactive,
    activeImg: BitkinActive,
    name: t('aboutPage.bio.bitkin.name'),
    position: t('aboutPage.bio.bitkin.position'),
    edu: {
      title: t('aboutPage.bio.bitkin.edu.title'),
      list: [
        {
          text: t('aboutPage.bio.bitkin.edu.text'),
          subText: t('aboutPage.bio.bitkin.edu.subText'),
        },
      ],
    },
    bio: [
      {
        title: t('aboutPage.bio.bitkin.bio.title'),
        text: [
          t('aboutPage.bio.bitkin.bio.text1'),
          t('aboutPage.bio.bitkin.bio.text2'),
        ],
      },
      {
        title: t('aboutPage.bio.bitkin.company.title'),
        text: [
          t('aboutPage.bio.bitkin.company.text1'),
          t('aboutPage.bio.bitkin.company.text2'),
        ],
      },
    ],
  },
  {
    img: DruzinInactive,
    activeImg: DruzinActive,
    name: t('aboutPage.bio.druzin.name'),
    position: t('aboutPage.bio.druzin.position'),
    edu: {
      title: t('aboutPage.bio.druzin.edu.title'),
      list: [
        {
          text: t('aboutPage.bio.druzin.edu.text1'),
          subText: t('aboutPage.bio.druzin.edu.subText1'),
        },
        {
          text: t('aboutPage.bio.druzin.edu.text2'),
          subText: t('aboutPage.bio.druzin.edu.subText2'),
        },
      ],
    },
    bio: [
      {
        title: t('aboutPage.bio.druzin.bio.title'),
        text: [
          t('aboutPage.bio.druzin.bio.text'),
        ],
      },
      {
        title: t('aboutPage.bio.druzin.company.title'),
        text: [
          t('aboutPage.bio.druzin.company.text1'),
          t('aboutPage.bio.druzin.company.text2'),
        ],
      },
    ],
  },
]);

const handlerTab = (tab: any, type: string, idx: number) => {
  if (
    activeTab.value === tab[type]
    && activeType.value === type
    && activeIdx.value === idx
  ) {
    return;
  }
  fadeKey.value++;
  activeTab.value = tab[type];
  activeType.value = type;
  activeIdx.value = idx;
};

const handlerMobileTab = (tab: any, type: string, idx: number) => {
  if (!isDesktop.value) {
    mobileActiveTypes.value[idx] = type;
  }
  else {
    handlerTab(tab, type, idx);
  }
};

onMounted(() => {
  handlerTab(list.value[0], 'bio', 0);
});

watch(locale, () => {
  handlerTab(list.value[0], 'bio', 0);
});
</script>

<template>
  <section class="bio">
    <div class="bio__wrapper">
      <h2 class="bio__title">{{ t('aboutPage.bio.title') }}</h2>
      <div class="bio__content">
        <div class="bio__left">
          <div
            v-for="(item, idx) in list"
            :key="item.name"
            :class="`bio__person ${
              idx === activeIdx ? 'bio__person_active' : ''
            }`"
            @mouseenter="isDesktop ? handlerTab(item, 'bio', idx) : null"
          >
            <div class="bio__person-holder">
              <div class="bio__person-photo">
                <img
                  class="bio__person-photo-img bio__person-photo-img_inactive"
                  :src="item.img"
                  alt="Inactive photo"
                />
                <img
                  class="bio__person-photo-img bio__person-photo-img_active"
                  :src="item.activeImg"
                  alt="Active photo"
                />
              </div>
              <div class="bio__person-info">
                <p class="bio__person-name">{{ item.name }}</p>
                <svg
                  class="bio__person-divider"
                  viewBox="0 0 430 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0.5H430V1.5H0V0.5Z"
                    fill="url(#paint0_linear_14179_62451)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_14179_62451"
                      x1="0"
                      y1="1"
                      x2="430"
                      y2="1"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#8CABFD" />
                      <stop offset="1" stop-color="#053478" />
                    </linearGradient>
                  </defs>
                </svg>

                <p class="bio__person-position">{{ item.position }}</p>
                <div class="bio__person-tabs">
                  <button
                    class="bio__person-tab"
                    :class="{
                      'bio__person-tab_active': isDesktop
                        ? activeIdx === idx && activeType === 'bio'
                        : mobileActiveTypes[idx] === 'bio',
                    }"
                    @click="handlerMobileTab(item, 'bio', idx)"
                    @mouseenter="handlerTab(item, 'bio', idx)"
                  >
                    {{ t('aboutPage.bio.bio') }}
                  </button>
                  <button
                    class="bio__person-tab"
                    :class="{
                      'bio__person-tab_active': isDesktop
                        ? activeIdx === idx && activeType === 'edu'
                        : mobileActiveTypes[idx] === 'edu',
                    }"
                    @click="handlerMobileTab(item, 'edu', idx)"
                    @mouseenter="handlerTab(item, 'edu', idx)"
                  >
                    {{ t('aboutPage.bio.edu') }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!isDesktop" class="bio__right">
              <div>
                <template v-if="mobileActiveTypes[idx] === 'bio'">
                  <div
                    v-for="(bioItem, bioIdx) in item.bio"
                    :key="bioIdx"
                    class="bio__right-block"
                  >
                    <p class="bio__right-title" v-html="bioItem.title" />
                    <p
                      v-for="text in bioItem.text"
                      :key="text"
                      class="bio__right-text"
                      v-html="text"
                    />
                  </div>
                </template>
                <template v-else>
                  <p class="bio__right-title" v-html="item.edu.title" />
                  <div
                    v-for="(eduItem, eduIdx) in item.edu.list"
                    :key="eduIdx"
                    class="bio__right-education"
                  >
                    <p
                      class="bio__right-education-text"
                      v-html="eduItem.text"
                    />
                    <p
                      class="bio__right-education-subtext"
                      v-html="eduItem.subText"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isDesktop" class="bio__right">
          <Transition name="fade" mode="out-in">
            <div :key="fadeKey">
              <template v-if="activeType === 'bio'">
                <div
                  v-for="(item, idx) in activeTab"
                  :key="idx"
                  class="bio__right-block"
                >
                  <p class="bio__right-title" v-html="item.title" />
                  <p
                    v-for="text in item.text"
                    :key="text"
                    class="bio__right-text"
                    v-html="text"
                  />
                </div>
              </template>
              <template v-else>
                <p class="bio__right-title" v-html="activeTab?.title" />
                <div
                  v-for="(item, idx) in activeTab.list"
                  :key="idx"
                  class="bio__right-education"
                >
                  <p class="bio__right-education-text" v-html="item.text" />
                  <p
                    class="bio__right-education-subtext"
                    v-html="item.subText"
                  />
                </div>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;
@use "@styles/typography" as t;
@use "@styles/shared" as s;

.bio {
  height: 600px;

  @include a.tablet {
    height: auto;
  }

  &__title {
    @include t.h1;

    @include a.mobile {
      @include t.h4;
    }
  }

  &__content {
    display: flex;
    margin-top: 52px;

    @include a.mobile {
      margin-top: 26px;
    }
  }

  &__left {
    flex-shrink: 0;
    width: 100%;
    max-width: 652px;

    @include a.tablet {
      max-width: 100%;
    }
  }

  &__person {
    &:first-child {
      margin-bottom: 32px;

      @include a.tablet {
        margin-bottom: 52px;
      }

      @include a.mobile {
        margin-bottom: 24px;
      }
    }

    &-holder {
      display: flex;
      align-items: center;

      @include a.mobile {
        display: block;
      }
    }

    &_active {
      .bio__person-info,
      .bio__person-photo-img_active {
        opacity: 1;
      }

      .bio__person-tab {
        opacity: 0.4;
      }

      .bio__person-photo-img_inactive {
        opacity: 0;
      }
    }

    &-photo {
      position: relative;
      z-index: 1;

      flex-shrink: 0;
      width: 190px;
      height: 190px;

      @include a.mobile {
        width: 160px;
        height: 160px;
      }

      &-img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;

        width: 100%;
        height: 100%;

        transition: opacity 0.3s;

        &_active {
          opacity: 0;

          @include a.tablet {
            opacity: 1 !important;
          }
        }
      }
    }

    &-info {
      width: 100%;
      margin-left: 32px;

      opacity: 0.4;

      transition: opacity 0.3s;

      @include a.tablet {
        opacity: 1 !important;
      }

      @include a.mobile {
        margin-top: 24px;
        margin-left: unset;
      }
    }

    &-name {
      @include t.h5;
    }

    &-position {
      position: relative;
      top: -6px;
      @include t.body-m-medium;
    }

    &-divider {
      position: relative;
      top: -12px;

      width: 100%;

      @include a.mobile {
        top: -6px;
      }
    }

    &-tabs {
      display: flex;
      margin-top: 30px;
      position: relative;
      top: -8px;

      @include a.mobile {
        margin-top: 18px;
      }
    }

    &-tab {
      position: relative;
      z-index: 1;

      padding-left: 16px;

      color: var(--dark-blue);

      transition: opacity 0.3s;

      @include t.body-m-medium;

      @include a.tablet {
        opacity:  0.4;
      }

      @include a.mobile {
        @include t.body-xs-medium;
      }

      @include s.hover {
        opacity: 1;
      }

      &_active {
        opacity: 1 !important;
      }

      &:not(:first-child) {
        margin-left: 20px;
      }

      &::before {
        position: absolute;
        top: calc(50% - 4px);
        left: 0;
        z-index: 1;

        width: 8px;
        height: 8px;

        background: var(--dark-blue);
        border-radius: 50%;

        content: "";
      }
    }
  }

  &__right {
    width: 100%;
    height: max-content;
    margin-left: 80px;
    padding: 32px;

    background: rgba(#8cabfd, 0.1);
    border: 1px solid rgba(#8cabfd, 0.3);
    border-radius: 16px;

    @include a.tablet {
      margin-top: 24px;
      margin-left: 0;
    }

    @include a.mobile {
      margin-top: 18px;
      padding: 20px 19px;

      background: rgba(#8cabfd, 0.05);
      border: 1px solid rgba(#8cabfd, 0.2);
    }

    &-block {
      &:not(:first-child) {
        margin-top: 20px;

        @include a.tablet {
          margin-top: 45px;
        }

        @include a.mobile {
          margin-top: 16px;
        }
      }
    }

    &-title {
      margin-bottom: 10px;

      color: var(--dark-blue-50);

      @include t.body-m-medium;

      @include a.mobile {
        margin-bottom: 6px;

        color: var(--dark-blue-40);

        @include t.body-xs-medium;
      }
    }

    &-text {
      margin-bottom: 6px;

      color: var(--dark-blue-90);
      font-weight: 400;
      font-size: 18px;
      line-height: 128%;

      @include a.mobile {
        line-height: 147% !important;

        @include t.body-s-regular;
      }

      :deep(b) {
        font-weight: 600;
      }
    }

    &-education {
      position: relative;
      z-index: 1;

      color: var(--dark-blue-90);
      font-weight: 400;
      font-size: 18px;
      line-height: 128%;

      &:not(:first-child) {
        margin-top: 12px;
      }

      &-subtext {
        margin-top: 12px;
      }
    }
  }

  :deep(.tabs-content__tab_active .tabs-content__content-collapse) {
    @include a.mobile {
      margin-top: 22px;
    }
  }
}
</style>
