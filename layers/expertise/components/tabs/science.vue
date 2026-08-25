<script setup lang="ts">
import kv1 from '@l-expertise/assets/images/tabs/science/kv1.png';
import kv1webp from '@l-expertise/assets/images/tabs/science/kv1.webp';
import kv2 from '@l-expertise/assets/images/tabs/science/kv2.png';
import kv2M from '@l-expertise/assets/images/tabs/science/kv2-m.png';
import kv2webp from '@l-expertise/assets/images/tabs/science/kv2.webp';
import kv3 from '@l-expertise/assets/images/tabs/science/kv3.png';
import kv3M from '@l-expertise/assets/images/tabs/science/kv3-m.png';
import kv3webp from '@l-expertise/assets/images/tabs/science/kv3.webp';

const { t } = useI18n();

const list = computed(() => [
  {
    title:
      t('expertise.science.blocks.block_1.label'),
    img: kv1,
    imgWebp: kv1webp,
    texts: [
      t('expertise.science.blocks.block_1.text_1'),
    ],
  },
  {
    title: t('expertise.science.blocks.block_2.label'),
    img: kv2,
    imgM: kv2M,
    imgWebp: kv2webp,
    texts: [
      t('expertise.science.blocks.block_2.text_1'),
      t('expertise.science.blocks.block_2.text_2'),
    ],
  },
  {
    title: t('expertise.science.blocks.block_3.label'),
    img: kv3,
    imgM: kv3M,
    imgWebp: kv3webp,
    texts: [
      t('expertise.science.blocks.block_3.text_1'),
    ],
  },
]);

useGsap(() => {
  gsap.set('.science__item', {
    scale: 0.9,
    opacity: 0,
    y: 100,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.science__grid',
      start: 'top+=25% bottom',
      end: 'bottom bottom',
      scrub: 1,
    },
  });

  tl.to('.science__item', {
    scale: 1,
    opacity: 1,
    y: 0,
    stagger: 0.5,
  });
});
</script>

<template>
  <div class="science">
    <div class="science__wrapper">
      <div class="science__grid">
        <div
          v-for="(item, idx) in list"
          :key="idx"
          class="science__item"
        >
          <div class="science__item-content">
            <div class="science__item-header">
              <mark class="science__item-num">({{ String(idx + 1).padStart(2, "0") }})</mark>
              <h3 class="science__item-title" v-html="item.title" />
            </div>
            <atoms-picture
              class="science__item-img"
              :src="item.img"
              :src-m="item.imgM"
              :webp="item.imgWebp"
            />
            <div class="science__item-texts">
              <p
                v-for="text in item.texts"
                :key="text"
                class="science__item-text"
                v-html="text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.science__grid {
  display: grid;
  grid-gap: 8px;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: 429px 883px;

  @include a.tablet {
    grid-template-columns: 1fr;
  }
}

.science__item {
  width: 100%;
  height: 100%;

  padding: 28px;
  overflow: hidden;

  background: var(--bg);
  border-radius: 16px;

  @include a.mobile {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  &-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    @include a.mobile {
      display: grid;
      grid-template-areas:
          "image"
          "title"
          "text";
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  &-num {
    color: var(--dark-blue-40);

    @include t.caption-m-medium;

    @include a.mobile {
      @include t.caption-xs-medium
    }
  }

  &-title {
    grid-area: title;

    color: var(--dark-blue);

    @include t.h5;

    @include a.tablet {
      @include t.lead-m-medium;
    }

    @include a.mobile {
      @include t.lead-s-medium;
    }
  }

  &-img {
    grid-area: image;
  }

  &-texts {
    display: flex;
    grid-area: text;
    justify-content: space-between;
    margin-top: auto;

    @include a.mobile {
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  &-text {
    color: var(--dark-blue-80);

    @include t.body-m-medium;

    @include a.mobile {
      line-height: 1.37em !important;

      @include t.body-s-medium-135;
    }
  }
}

.science__item:not(:first-child) {
  .science__item-header {
    display: flex;

    @include a.mobile {
      flex-direction: column;
      gap: 10px;
    }
  }

  .science__item-title {
    max-width: 50%;
    margin-left: 24px;

    @include a.tablet {
      max-width: 100%;
    }

    @include a.mobile {
      margin-left: 0;
    }
  }

  .science__item-img {
    width: 100%;
    max-width: 744px;
    margin: 0 auto;

    @include a.mobile {
      height: 180px;
      object-fit: cover;
    }
  }
}

.science__item:nth-child(1)  {
  grid-row: span 2;

  @include a.mobile {
    grid-template-columns: 1fr;
  }

  .science__item-content {
    @include a.tablet {
      display: grid;
      grid-template: "title image" auto "text image" auto / auto 230px;

      align-items: center;
    }

    @include a.mobile {
      display: grid;
      grid-template-areas:
          "image"
          "title"
          "text";
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .science__item-title {
    margin-top: 24px;

    @include a.mobile {
      margin-top: 10px;
    }
  }

  .science__item-texts {
    @include a.tablet {
      max-width: 336px;
      margin-top: 0;
    }
  };

  .science__item-img {
    width: calc(100% + 28px);
    margin: 16px 0 10px;
    margin-inline-start: -28px;

    @include a.tablet {
      justify-self: end;
      width: 230px;
      height: auto;
      margin-inline-end: -16px;
    }

    @include a.mobile {
      justify-self: center;
      width: 174px;
      margin-inline-end: -26px;

      margin-top: 10px;
    }
  }
}

.science__item:nth-child(2) {
  @include a.tablet {
    .science__item-texts {
      margin-top: 18px;

      @include a.mobile {
        margin-top: 0;
      }
    }

    .science__item-img {
      width: 464px;
      margin-top: 14px;

      @include a.mobile {
        width: auto;
        height: 156px;

        // margin-top: -10px;

        margin-bottom: 10px;
        object-fit: cover;

        * {
          height: 90%;
        }
      }
    }
  }
}

.science__item:nth-child(3) {
  @include a.tablet {
    .science__item-img {
      width: 450px;
      margin-top: 28px;
      margin-inline-start: 20px;

      @include a.mobile {
        width: 100%;
        margin-top: 0;
        margin-inline-start: 0;
      }
    }

    .science__item-texts {
      margin-top: 30px;

      @include a.mobile {
        margin-top: 0;
      }
    }
  }
}
</style>
