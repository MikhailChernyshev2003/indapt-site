<script setup lang="ts">
import cart from '@l-expertise/assets/images/tabs/trade/cart.jpg';
import cartWebp from '@l-expertise/assets/images/tabs/trade/cart.webp';
import crm from '@l-expertise/assets/images/tabs/trade/crm.jpg';
import crmWebp from '@l-expertise/assets/images/tabs/trade/crm.webp';
import retail from '@l-expertise/assets/images/tabs/trade/retail.jpg';
import retailWebp from '@l-expertise/assets/images/tabs/trade/retail.webp';

const { t } = useI18n();

const activeItemIdx = ref(0);
</script>

<template>
  <section class="trade">
    <div class="trade__info">
      <atoms-picture
        class="trade__info-image"
        :src="cart"
        :webp="cartWebp"
      />
      <div class="trade__info-content">
        <h3 v-html="t('expertise.trade.title')" />
        <p v-html="t('expertise.trade.text')" />
      </div>
    </div>

    <div class="trade__blocks">
      <div
        class="trade__block"
        :class="{ trade__block_active: activeItemIdx === 0 }"
        @mouseenter="activeItemIdx = 0"
      >
        <mark class="trade__block-num" aria-hidden="true">(01)</mark>

        <atoms-picture
          class="trade__block-image"
          :src="crm"
          :webp="crmWebp"
          alt="CRM"
        />

        <div class="trade__block-content">
          <h4 class="trade__block-content-title" v-html="t('expertise.trade.block1.title')" />
          <div class="trade__block-content-text">
            <p v-html="t('expertise.trade.block1.text')" />
          </div>
        </div>
      </div>

      <div
        class="trade__block"
        :class="{ trade__block_active: activeItemIdx === 1 }"
        @mouseenter="activeItemIdx = 1"
      >
        <mark class="trade__block-num" aria-hidden="true">(02)</mark>

        <atoms-picture
          class="trade__block-image"
          :src="retail"
          :webp="retailWebp"
          alt="Retail"
        />

        <div class="trade__block-content">
          <h4 class="trade__block-content-title" v-html="t('expertise.trade.block2.title')" />
          <div class="trade__block-content-text">
            <p v-html="t('expertise.trade.block2.text')" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/shared" as s;
@use "@styles/adaptive" as a;

.trade__info {
  display: flex;

  @include a.tablet {
    flex-direction: column;
    align-items: center;
  }

  &-image {
    width: 425px;

    @include a.tablet {
      width: 330px;
      margin-top: 10px;
      margin-inline-start: 44px;
    }

    @include a.mobile {
      width: 200px;
      margin-inline-start: 18px;
    }
  }

  &-content {
    flex: 1;
    margin-left: 24px;

    @include a.tablet {
      margin-left: unset;
    }

    @include a.mobile {
      margin-top: 12px;
    }

    h3 {
      color: var(--dark-blue);

      @include t.h3;

      @include a.mobile {
        max-width: 330px;

        @include t.h5;
      }
    }

    p {
      margin-top: 16px;

      color: var(--dark-blue-80);

      @include t.lead-s-medium;

      @include a.mobile {
        margin-top: 10px;

        line-height: 1.37em !important;

        @include t.body-s-medium-135;
      }
    }
  }
}

.trade__blocks {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 20px;

  @include a.tablet {
    grid-gap: 16px;
    grid-template-rows: 580px 540px;
    grid-template-columns: 1fr;
    margin-top: 36px;
  }

  @include a.mobile {
    grid-gap: 12px;
    grid-template-rows: 530px 470px;
    margin-top: 24px;
  }
}

.trade__block {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 600px;
  padding: 24px;
  overflow: hidden;

  background: #f2f8ff;

  border-radius: 16px;

  transition: 0.4s ease;
  transition-property: background, border-color;

  @include a.tablet {
    height: 100%;

    &:nth-child(1) {
      .trade__block-image {
        width: 95%;
        margin-top: -8px;
        margin-inline-start: 18px;
      }
    }

    &:nth-child(2) {
      .trade__block-image {
        margin-top: 14px;
        margin-inline-start: -4px;
      }

      .trade__block-content {
        position: relative;
        z-index: 10;

        margin-top: -60px;
      }
    }
  }

  @include a.mobile {
    height: auto;
    padding: 20px;

    &:nth-child(1) {
      .trade__block-image {
        width: calc(100% + 24px);
        margin-top: -6px;
        margin-inline-start: -30px;
      }

      .trade__block-content {
        padding-right: 8px;
      }
    }

    &:nth-child(2) {
      .trade__block-image {
        width: calc(100% + 20px);
        margin-top: 30px;
        margin-bottom: -8px;
        margin-inline-start: -20px;
      }
    }
  }

  @include a.desktop-only {
    @include s.mouse-only {
      padding-bottom: 0;

      background: transparent;

      border: 1px solid var(--dark-blue-10);
    }
  }

  &_active {
    @include a.desktop-only {
      background: #f2f8ff;
      border-color: transparent;

      .trade__block-image {
        transform: scale(1);
        opacity: 1;

        transition: 0.4s ease;
        transition-delay: 0.1s;
        transition-property: transform, opacity;
      }

      .trade__block-content-text {
        grid-template-rows: 1fr;

        opacity: 1;

        p {
          padding-top: 8px;
          padding-bottom: 24px;

          transform: translateY(0);
        }
      }
    }
  }

  &-num {
    position: absolute;

    top: 24px;
    left: 24px;

    z-index: 1;

    color: var(--dark-blue-60);

    @include t.caption-l-semi;

    @include a.mobile {
      @include t.caption-xs-medium;
    }
  }

  &-image {
    height: auto;

    @include a.desktop-only {
      @include s.mouse-only {
        transform: scale(0.95);
        opacity: 0;

        transition: 0.3s ease;
        transition-property: transform, opacity;
      }
    }
  }

  &-content {
    &-title {
      padding-right: 80px;

      @include t.lead-m-medium;

      @include a.tablet {
        padding-right: 0;
      }

      @include a.mobile {
        @include t.body-m-medium;
      }
    }

    &-text {
      margin-top: 8px;

      color: var(--dark-blue-80);

      @include a.desktop-only {
        @include s.mouse-only {
          display: grid;
          grid-template-rows: 0fr;
          margin-top: 0;

          opacity: 0;

          transition: 0.35s ease;
          transition-property: grid-template-rows, opacity;

          p {
            padding-top: 24px;

            transform: translateY(20px);
          }
        }
      }

      p {
        display: block;
        min-height: 0;

        transition: 0.35s ease;
        transition-property: transform, padding;

        @include t.body-m-medium;

        @include a.mobile {
          line-height: 1.38em !important;

          @include t.body-s-medium-135;
        }
      }
    }
  }
}
</style>
