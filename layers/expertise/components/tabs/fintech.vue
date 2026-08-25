<script setup lang="ts">
import kv1 from '@l-expertise/assets/images/tabs/fintech/kv1.jpg';
import kv1webp from '@l-expertise/assets/images/tabs/fintech/kv1.webp';
import kv1En from '@l-expertise/assets/images/tabs/fintech/kv1-en.jpg';
import kv1EnWebp from '@l-expertise/assets/images/tabs/fintech/kv1-en.webp';
import kv2 from '@l-expertise/assets/images/tabs/fintech/kv2.jpg';
import kv2webp from '@l-expertise/assets/images/tabs/fintech/kv2.webp';
import kv3 from '@l-expertise/assets/images/tabs/fintech/kv3.jpg';
import kv3webp from '@l-expertise/assets/images/tabs/fintech/kv3.webp';

const { t, locale } = useI18n();

const isEn = computed(() => locale.value === 'en');

const activeBlock = shallowRef<number>(0);

const blocks = computed(() => [
  {
    image: isEn.value ? kv1En : kv1,
    webp: isEn.value ? kv1EnWebp : kv1webp,
    label:
      t('expertise.fintech.blocks.block_1.label'),
    texts: [
      t('expertise.fintech.blocks.block_1.text_1'),
    ],
  },
  {
    image: kv2,
    webp: kv2webp,
    label: t('expertise.fintech.blocks.block_2.label'),
    texts: [
      t('expertise.fintech.blocks.block_2.text_1'),
      t('expertise.fintech.blocks.block_2.text_2'),
    ],
  },
  {
    image: kv3,
    webp: kv3webp,
    label: t('expertise.fintech.blocks.block_3.label'),
    texts: [
      t('expertise.fintech.blocks.block_3.text_1'),
      t('expertise.fintech.blocks.block_3.text_2'),
    ],
  },
]);

const handlerSelected = (value: number): void => {
  activeBlock.value = value;
};

const animationTablet = () => {
  const blockAnimation = (
    index: number,
    targetHeight: string,
    imageOpacity: number,
    numOpacity: number,
    delay = 0,
  ) => {
    const block = `.fintech__block:nth-child(${index})`;
    const elements = {
      block: block,
      image: `${block} .fintech__block-image`,
      num: `${block} .fintech__block-num`,
    };

    const tl = gsap.timeline();

    tl.to(
      elements.block,
      {
        height: targetHeight,
        duration: 10,
      },
      '<',
    );

    tl.to(
      [elements.image, elements.num],
      {
        opacity: imageOpacity,
        duration: 2,
        delay: delay,
      },
      '<',
    );

    return tl;
  };

  const masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.fintech__blocks',
      start: 'top+=70% bottom',
      end: 'bottom+=35% center+=25%',
      scrub: 1,
    },
  });

  masterTL.add(blockAnimation(1, '10.625rem', 0, 0));
  masterTL.add(blockAnimation(2, '36.5625rem', 1, 1, 8), '<');

  masterTL.add(blockAnimation(2, '10.625rem', 0, 0));
  masterTL.add(blockAnimation(3, '36.5625rem', 1, 1, 8), '<');
};

const animationMobile = () => {
  gsap.set('.fintech__block:not(:first-child)', {
    y: '100vh',
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.fintech__blocks',
      start: 'top-=21% top',
      end: '+=1200px',
      scrub: 1,
      anticipatePin: 1,
      pin: true,
    },
  });

  tl.to('.fintech__block:nth-child(1)', {
    opacity: 0,
  });
  tl.to(
    '.fintech__block:nth-child(2)',
    {
      y: 0,
    },
    '<',
  );
  tl.to('.fintech__block:nth-child(2)', {
    opacity: 0,
  });
  tl.to(
    '.fintech__block:nth-child(3)',
    {
      y: 0,
      zIndex: 10,
    },
    '<',
  );
};

useGsap({
  desktop: () => undefined,
  tablet: animationTablet,
  mobile: animationMobile,
});
</script>

<template>
  <div class="fintech">
    <div class="fintech__blocks">
      <div
        v-for="(block, idx) in blocks"
        :key="`${locale}-${idx}`"
        class="fintech__block"
        :aria-selected="activeBlock === idx"
        @mouseenter="handlerSelected(idx)"
      >
        <atoms-picture
          class="fintech__block-image"
          :src="block.image"
          :webp="block.webp"
        />

        <div class="fintech__block-content">
          <h3 v-html="block.label" />
          <p
            v-for="(text, key) in block.texts"
            :key="key"
            v-html="text"
          />
        </div>

        <mark class="fintech__block-num">({{ String(idx + 1).padStart(2, "0") }})</mark>

        <div class="fintech__block-blur" />
      </div>
    </div>

    <p class="fintech__text">{{ t('expertise.fintech.text') }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.fintech__text {
  margin-top: 120px;
  padding: 40px;

  color: var(--dark-blue);

  background: linear-gradient(108deg, #f4f7ff -99.97%, #ffffff 212.34%);

  border-radius: 16px;

  @include t.h2;

  @include a.mobile {
    padding: 20px;

    @include t.h5;
  }
}

.fintech__blocks {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  height: 585px;
  overflow: hidden;

  @include a.tablet {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  @include a.mobile {
    position: relative;
    z-index: 1;

    height: 580px;
  }
}

.fintech__block {
  position: relative;
  z-index: 1;

  flex-shrink: 0;
  width: 200px;
  min-width: 200px;
  height: 459px;
  overflow: hidden;

  background-color: #f8fcff;
  border: 1px solid var(--dark-blue-5);

  border-radius: 16px;
  backdrop-filter: blur(15px);

  transition: 0.5s ease;
  transition-property: width, height;

  @include a.tablet {
    width: 100% !important;
    height: 585px;

    transition: unset;

    &:not(:first-child) {
      height: 170px;

      .fintech__block-image {
        opacity: 0;
      }

      .fintech__block-num {
        opacity: 0;
      }
    }
  }

  @include a.mobile {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    height: 580px !important;
  }

  @include a.mobile {
    .fintech__block-content {
      opacity: 1 !important;
    }
  }

  &-blur {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;

    width: 100%;
    height: 170px;

    background: linear-gradient(
      0deg,
      var(--bg) 0%,
      rgb(188 198 217 / 0%) 59.42%
    );

    pointer-events: none;
  }

  &:nth-child(1) {
    .fintech__block-image {
      top: 69%;
      left: 116%;

      min-width: 593px;

      @include a.tablet {
        top: 50% !important;
      }

      @include a.mobile {
        top: 68% !important;
        left: 90% !important;
      }
    }

    &[aria-selected="true"] {
      .fintech__block-image {
        top: 45%;
        left: 50%;
      }
    }
  }

  &:nth-child(2) {
    width: 230px;
    min-width: 230px;
    height: 537px;

    @include a.tablet {
      height: 170px;
    }

    .fintech__block-initial {
      width: 230px;
    }

    .fintech__block-image {
      top: 40%;
      left: 58px;

      @include a.tablet {
        top: 55%;
        left: 50%;

        width: 90%;
      }

      @include a.mobile {
        top: 67%;
        left: 52%;
      }
    }

    &[aria-selected="true"] {
      width: 68% !important;

      .fintech__block-image {
        top: 45%;
        left: 49%;
      }
    }
  }

  &:nth-child(3) {
    .fintech__block-image {
      top: 41%;
      left: 35%;

      min-width: 640px;

      @include a.tablet {
        top: 50%;
        left: 50%;
      }

      @include a.mobile {
        top: 65%;
        left: 100%;

        width: 250px;
      }
    }

    &[aria-selected="true"] {
      .fintech__block-image {
        top: 45%;
        left: 50%;
      }
    }
  }

  &[aria-selected="true"] {
    width: 65.8%;
    height: 585px;

    .fintech__block-content {
      pointer-events: auto;

      h3 {
        background: linear-gradient(90deg, #0c1d4f 0%, #0c1d4f 100%);
        background-clip: text;
        opacity: 1;
        -webkit-text-fill-color: transparent;

        @include t.h3;

        @include a.mobile {
          @include t.h5;
        }
      }

      p {
        opacity: 1;

        transition-delay: 0.5s;

        pointer-events: auto;
      }
    }
  }

  &-image {
    position: absolute;

    top: 50%;
    left: 50%;
    z-index: 0;

    width: 100%;
    min-width: 737px;
    max-width: 863px;
    object-fit: cover;

    transform: translate(-50%, -20%);

    @include a.tablet {
      max-width: 670px;

      transform: translate(-50%, -8%);
    }

    @include a.mobile {
      top: unset;
      bottom: 40px;

      width: auto;
      min-width: unset;
      max-width: unset;
      height: 150px;

      transform: translate(-50%, 0);
      opacity: 1 !important;
    }
  }

  &-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    padding: 28px;
    overflow: hidden;

    transition: opacity 0.3s ease;

    pointer-events: none;

    @include a.mobile {
      padding: 20px;

      opacity: 0;
    }

    h3 {
      margin-bottom: 16px;

      background: linear-gradient(90deg, #0c1d4f 0%, #c6d5f8 100%);
      background-clip: text;
      opacity: 0.6;
      -webkit-text-fill-color: transparent;

      transition: 0.3s ease;
      transition-property: font-size, background, opacity;

      @include t.lead-s-semi;

      @include a.tablet {
        background: unset;
        background-clip: none;
        opacity: 1;
        -webkit-text-fill-color: unset;

        @include t.h3;
      }

      @include a.mobile {
        @include t.h5;
      }
    }

    p {
      margin-top: 8px;

      color: var(--dark-blue-80);

      white-space: pre-wrap;

      opacity: 0;

      transition: opacity 0.3s ease;

      pointer-events: none;

      @include t.body-m-medium;

      @include a.tablet {
        opacity: 1;
      }

      @include a.mobile {
        @include t.body-s-medium-135;
      }
    }
  }

  &-num {
    position: absolute;
    bottom: 28px;
    left: 28px;

    background: linear-gradient(90deg, #0c1d4f 0%, #c6d5f8 100%);
    background-clip: text;
    opacity: 0.6;
    -webkit-text-fill-color: transparent;

    @include t.caption-m-medium;

    @include a.mobile {
      color: var(--dark-blue);

      background: none;
      opacity: 1 !important;
      -webkit-text-fill-color: unset;

      @include t.caption-xs-medium;
    }
  }
}
</style>
