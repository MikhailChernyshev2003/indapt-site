<script setup lang="ts">
const { isDesktop, isTablet } = useDevice();

const { t } = useI18n();

const data = [
  '/images/partners/zenit.svg',
  '/images/partners/galina-blanka.svg',
  '/images/partners/henkel.svg',
  '/images/partners/gazprom.svg',
  '/images/partners/disney.svg',
  '/images/partners/bmw.svg',
  '/images/partners/allianz.svg',
  '/images/partners/mts.svg',
  '/images/partners/vtb.svg',
  '/images/partners/clarks.svg',
];

const dataMatrix = computed(() => {
  const matrix = [];
  let index = 0;

  const pattern = isDesktop.value
    ? [1, 2, 3, 4]
    : isTablet.value
      ? [2, 1, 2, 2, 3]
      : [1, 1, 2, 1, 2, 1, 2];

  let patternIndex = 0;

  while (index < data.length) {
    const rowSize = pattern[patternIndex % pattern.length];
    const row = [];

    for (let i = 0; i < rowSize && index < data.length; i++) {
      row.push(data[index]);
      index++;
    }

    matrix.push(row);
    patternIndex++;
  }

  return matrix;
});
</script>

<template>
  <section class="our-partners">
    <div class="our-partners__container container">
      <h3 class="our-partners__title" v-html="t('mainPage.partners.title')" />
      <div class="our-partners__list">
        <div
          v-for="(row, idx) in dataMatrix"
          :key="idx"
          class="our-partners__row"
        >
          <div
            v-for="item in row"
            :key="item"
            class="our-partners__row-item"
          >
            <img
              :src="item"
              alt="partner"
              class="our-partners__row-item-img"
            />
            <div class="our-partners__row-item-overlay" />
          </div>
        </div>
        <div
          v-for="num in 4"
          :key="num"
          :class="`our-partners__row-fake-item our-partners__row-fake-item_${num}`"
        />
      </div>
    </div>
    <div class="our-partners__shape-wrap">
      <molecules-decor-shape-half-big class="our-partners__shape" />
    </div>
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.our-partners {
  width: 100%;
  min-height: 100vh;

  &__container {
    position: relative;

    display: flex;
    flex-direction: column;
    min-height: 100vh;

    padding-top: 142px;
    padding-bottom: 40px;
  }

  &__title {
    position: relative;
    z-index: 2;

    margin-bottom: 60px;

    color: var(--dark-blue);

    pointer-events: none;

    @include t.h1;

    @include a.mobile {
      font-size: 30px;
    }

    & * {
      font-family: v.$font-involve;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    margin-top: auto;
    padding-bottom: 15px;

    @include a.tablet {
      margin-top: 140px;
      padding-bottom: 0;
    }

    @include a.mobile {
      margin-top: 115px;
    }
  }

  &__row {
    display: flex;

    @include a.tablet {
      &:nth-child(odd) {
        .our-partners__row-item {
          &:last-child {
            margin-right: 0 !important;
          }
        }
      }
    }

    &:nth-child(even) {
      .our-partners__row-item {
        margin-right: 118px;

        @include a.mobile {
          margin-right: 110px;
        }

        &:last-child {
          margin-right: 0;

          @include a.tablet {
            margin-right: 118px;
          }

          @include a.mobile {
            margin-right: 110px;
          }
        }
      }
    }

    &-item {
      position: relative;
      z-index: 2;

      width: 118px;
      height: 118px;
      margin-right: 118px;

      transform-origin: center;

      transition: transform 0.3s;

      @include s.hover {
        z-index: 10;

        transform: scale(1.75) translateY(-24px);
        backdrop-filter: blur(5px);
      }

      @include a.mobile {
        width: 110px;
        height: 110px;
        margin-right: 110px;
      }

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &-overlay {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;

        width: 100%;
        height: 100%;

        background: rgb(236 241 255);
        border-radius: 4px;

        @include a.tablet {
          display: none;
        }
      }
    }
  }

  &__shape-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    width: 60.5%;

    height: 80vh;

    border-radius: 0 0 50%;
    opacity: 0.6;

     @include a.tablet {
      left: -45%;

      height: 84vh;

      opacity: 1;
    }

    @include a.mobile {
      left: -15%;

      height: 80vh;
    }
  }

  &__row-fake-item {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;

    width: 118px;
    height: 118px;

    background: rgb(236 241 255 / 70%);
    border-radius: 4px;

    animation: pulse infinite 5s linear;

    &_1 {
      bottom: 158px;
      left: 418px;

      animation-delay: 3s;
    }

    &_2 {
      bottom: 40px;
      left: 300px;

      animation: pulse-2 infinite 5s linear;
    }

    &_3 {
      bottom: 280px;
      left: 540px;

      animation-delay: 5s;
    }

    &_4 {
      bottom: 280px;
      left: 300px;

      animation-delay: 2s;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.05);
      }

      50% {
        transform: scale(1);
      }

      100% {
        transform: scale(0.05);
      }
    }

    @keyframes pulse-2 {
      0% {
        transform: scale(0.05);
      }

      50% {
        transform: scale(0.5);
      }

      100% {
        transform: scale(0.05);
      }
    }
  }
}

.our-partners__shape {
  height: 107vh;

  transform-origin: left top;

  transition: transform 0.5s;

  pointer-events: none;

  @include a.tablet {
    height: 100%;
  }
}

.our-partners__shape-wrap:hover .our-partners__shape {
  transform: scale(0.85);
}
</style>
