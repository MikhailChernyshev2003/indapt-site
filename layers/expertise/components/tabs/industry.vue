<script setup lang="ts">
import kv from '@l-expertise/assets/images/tabs/industry/kv.png?url';
import kvWebp from '@l-expertise/assets/images/tabs/industry/kv.webp?url';
import kvEn from '@l-expertise/assets/images/tabs/industry/kv-en.png?url';
import kvEnWebp from '@l-expertise/assets/images/tabs/industry/kv-en.webp?url';

const { t, locale } = useI18n();

const isEn = computed(() => locale.value === 'en');

const textBlocks: ComputedRef<{
  unit?: string;
  label: string;
  text: string;
}[]> = computed(() => [
  {
    label: t('expertise.industry.block1.label'),
    text: t('expertise.industry.block1.text'),
  },
  {
    unit: '(01)',
    label: t('expertise.industry.block2.label'),
    text: t('expertise.industry.block2.text'),
  },
  {
    unit: '(02)',
    label: t('expertise.industry.block3.label'),
    text: t('expertise.industry.block3.text'),
  },
  {
    unit: '(03)',
    label: t('expertise.industry.block4.label'),
    text: t('expertise.industry.block4.text'),
  },
]);
</script>

<template>
  <div class="industry" :class="{ 'industry--en': isEn }">
    <expertise-molecules-text-block
      v-for="(block, idx) in textBlocks"
      :key="idx"
      class="industry__text-block"
      :main="idx === 0"
      v-bind="block"
    />

    <atoms-picture
      class="industry__image"
      :src="isEn ? kvEn : kv"
      :webp="isEn ? kvEnWebp : kvWebp"
      loading="eager"
      fetch-priority="high"
      alt=""
      aria-hidden="true"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.industry {
  position: relative;
  z-index: 1;

  @include a.tablet {
    display: flex;
    flex-direction: column;
    gap: 118px;

    padding-bottom: 136px;

    background: url("@l-expertise/assets/images/tabs/industry/kv-t.png")
      no-repeat center 26px / contain;
  }

  @include a.mobile {
    gap: 118px;
    padding-bottom: 116px;

    background: url("@l-expertise/assets/images/tabs/industry/kv-m.png")
      no-repeat center 350px / 104.5%;
  }
}

.industry.industry--en {
  @include a.tablet {
    background: image-set(
      url("@l-expertise/assets/images/tabs/industry/kv-t-en.webp") type("image/webp"),
      url("@l-expertise/assets/images/tabs/industry/kv-t-en.png") type("image/png")
    )
      no-repeat center 26px / contain;
  }

  @include a.mobile {
    background: url("@l-expertise/assets/images/tabs/industry/kv-m-en.png")
      no-repeat center 350px / 104.5%;
  }
}

.industry__image {
  width: 100%;

  // Текстовые блоки позиционированы абсолютно, высоту вкладки задаёт только картинка. Пока она не декодирована,
  // высота была 0 — при переключении на вкладку блок кейсов на кадр подпрыгивал вверх и обратно

  aspect-ratio: 2642 / 2664;

  @include a.tablet {
    display: none;
  }
}

.industry__text-block {
  &:nth-child(1) {
    top: 47px;
    left: 2px;
    height: 346px;

    @include a.mobile {
      height: 326px;
    }

    :deep(p) {
      @include t.lead-s-medium;

      @include a.mobile {
        @include t.body-s-medium-135;
      }
    }
  }

  &:nth-child(2) {
    top: 302px;
    right: -8px;
    height: 274px;

    @include a.tablet {
      margin-inline-start: auto;
    }

    @include a.mobile {
      height: 297px;
    }
  }

  &:nth-child(3) {
    bottom: 384px;
    left: 2px;
    height: 238px;

    @include a.mobile {
      height: 261px;
    }
  }

  &:nth-child(4) {
    right: -3px;
    bottom: 0;
    height: 274px;

    @include a.mobile {
      height: 297px;
    }
  }
}
</style>
