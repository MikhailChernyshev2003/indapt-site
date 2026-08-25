<script setup lang="ts">
import AeroflotLogo from '@l-about/assets/images/partners/aeroflot.png';
import AkzoLogo from '@l-about/assets/images/partners/akzo.png';
import AllianzLogo from '@l-about/assets/images/partners/allianz.png';
import AtelierLogo from '@l-about/assets/images/partners/atelier.png';
import BmwLogo from '@l-about/assets/images/partners/bmw.png';
import ClarksLogo from '@l-about/assets/images/partners/clarks.png';
import DisneyLogo from '@l-about/assets/images/partners/disney.png';
import EldoradoLogo from '@l-about/assets/images/partners/eldorado.png';
import FlipkartLogo from '@l-about/assets/images/partners/flipkart.png';
import GalinaLogo from '@l-about/assets/images/partners/galina.png';
import GazpromLogo from '@l-about/assets/images/partners/gazprom.png';
import HenkelLogo from '@l-about/assets/images/partners/henkel.png';
import LeroyLogo from '@l-about/assets/images/partners/leroy.png';
import MalakutLogo from '@l-about/assets/images/partners/malakut.png';
import MtsLogo from '@l-about/assets/images/partners/mts.png';
import NetflixLogo from '@l-about/assets/images/partners/netflix.png';
import ObiLogo from '@l-about/assets/images/partners/obi.png';
import RosneftLogo from '@l-about/assets/images/partners/rosneft.png';
import SberLogo from '@l-about/assets/images/partners/sber.png';
import SetlLogo from '@l-about/assets/images/partners/setl.png';
import TikkurilaLogo from '@l-about/assets/images/partners/tikkurila.png';
import VtbLogo from '@l-about/assets/images/partners/vtb.png';
import ZarinaLogo from '@l-about/assets/images/partners/zarina.png';
import ZenitLogo from '@l-about/assets/images/partners/zenit.png';

const { isDesktop } = useDevice();

const { t } = useI18n();

const list = [
  [
    VtbLogo,
    MalakutLogo,
    ObiLogo,
    LeroyLogo,
    NetflixLogo,
    EldoradoLogo,
    MtsLogo,
    BmwLogo,
  ],
  [
    ClarksLogo,
    RosneftLogo,
    AeroflotLogo,
    SberLogo,
    FlipkartLogo,
    TikkurilaLogo,
    AkzoLogo,
    GazpromLogo,
  ],
  [
    AllianzLogo,
    DisneyLogo,
    ZarinaLogo,
    AtelierLogo,
    ZenitLogo,
    HenkelLogo,
    SetlLogo,
    GalinaLogo,
  ],
];

const listAdaptive = [
  [
    VtbLogo,
    MalakutLogo,
    ObiLogo,
    LeroyLogo,
    NetflixLogo,
    EldoradoLogo,
    MtsLogo,
    BmwLogo,
  ],
  [
    ClarksLogo,
    RosneftLogo,
    AeroflotLogo,
    SberLogo,
    FlipkartLogo,
    TikkurilaLogo,
    AkzoLogo,
    GazpromLogo,
  ],
  [
    AllianzLogo,
    DisneyLogo,
    ZarinaLogo,
    AtelierLogo,
    ZenitLogo,
    HenkelLogo,
    SetlLogo,
    GalinaLogo,
  ],
  [
    ZenitLogo,
    AllianzLogo,
    GalinaLogo,
    DisneyLogo,
    ZarinaLogo,
    HenkelLogo,
    SetlLogo,
    AtelierLogo,
  ],
  [
    ZarinaLogo,
    MalakutLogo,
    BmwLogo,
    ZenitLogo,
    NetflixLogo,
    EldoradoLogo,
    SetlLogo,
    AtelierLogo,
  ],
];

const renderList = computed(() => {
  return isDesktop.value ? list : listAdaptive;
});
</script>

<template>
  <section class="trust">
    <div class="trust__wrapper">
      <h2 class="trust__title">{{ t('aboutPage.trust.title') }}</h2>
      <div class="trust__content">
        <div
          v-for="(row, idx) in renderList"
          :key="`row-${idx}`"
          :class="`trust__list trust__list_${idx}`"
        >
          <img
            v-for="(item, i) in row.concat(row).concat(row).concat(row)"
            :key="`row-${idx}-item-${i}`"
            class="trust__list-item"
            :src="item"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.trust {
  position: relative;
  z-index: 1;

  height: 800px;
  overflow: hidden;

  @include a.tablet {
    height: auto;
  }

  &__title {
    position: relative;
    z-index: 2;

    padding: 142px 60px 0;

    @include t.h1;

    @include a.tablet {
      padding: 34px 60px 0;
    }

    @include a.mobile {
      padding: 0 20px;

      @include t.h4;
    }
  }

  &__content {
    position: relative;
    z-index: 2;

    width: 100%;
    margin-top: 52px;

    @include s.hover {
      .trust__list {
        animation-play-state: paused;
      }
    }

    @include a.mobile {
      margin-top: 32px;
    }
  }

  &__list {
    display: flex;
    flex-wrap: nowrap;
    gap: 118px;
    width: max-content;
    margin-bottom: 40px;

    transform: translate3d(0, 0, 0);

    will-change: transform, contents;

    @include a.tablet {
      margin-bottom: 28px;
    }

    @include a.mobile {
      margin-bottom: 4px;
    }

    &_0,
    &_2,
    &_4 {
      padding-left: 118px;

      animation: marquee 70s linear infinite;
    }

    &_1, &_3 {
      padding-right: 118px;

      animation: marquee 70s linear infinite reverse;
    }
  }

  &__list-item {
    position: relative;
    z-index: 1;

    width: 118px;
    height: 118px;

    background: rgba(#8CABFD, 0.05);
    transform-origin: center center;

    transition: transform 0.4s;

    @include s.hover {
      z-index: 4;

      transform: scale(1.5);
      backdrop-filter: blur(4px);
    }
  }

  @keyframes marquee {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }
}
</style>
