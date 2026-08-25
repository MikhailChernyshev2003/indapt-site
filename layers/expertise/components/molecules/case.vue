<script setup lang="ts">
import type { ExpertiseCase } from '@l-expertise/types';

defineProps<{ data: ExpertiseCase }>();
const { t } = useI18n();
</script>

<template>
  <article class="case">
    <div class="case__content">
      <h3 class="case__name">{{ t(data.name) }}</h3>
      <div class="case__num">
        <p>({{ t('expertise.case') }} {{ String(data.num).padStart(2, '0') }})</p>
        <hr />
      </div>

      <div class="case__kv case__kv_adaptive">
        <img :src="data.image" :alt="data.name" />
      </div>

      <div class="case__content-footer">
        <h4 class="case__label">{{ t(data.label) }}</h4>
        <p class="case__text" v-html="t(data.text)" />
      </div>
    </div>
    <div class="case__kv case__kv_desktop">
      <img :src="data.image" :alt="data.name" />
    </div>
  </article>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.case {
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  overflow: hidden;

  color: var(--dark-blue);

  @include a.tablet {
    grid-template-columns: 1fr;
  }
}

.case__content {
  display: flex;
  flex-direction: column;
}

.case__content-footer {
  max-width: 608px;
  margin-top: auto;

  @include a.tablet {
    max-width: 100%;
    margin-top: 28px;
  }

  @include a.mobile {
    margin-top: 24px;
  }
}

.case__kv {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 652px;

  padding: 40px;

  background-color: var(--bg);

  border-radius: 16px;

  img {
    width: 203px;

    @include a.mobile {
      width: 127px;
    }
  }

  &_desktop {
    aspect-ratio: 1;

    height: 580px;

    @include a.tablet {
      display: none;
    }
  }

  &_adaptive {
    display: none;
    margin-top: 24px;

    @include a.tablet {
      display: flex;
    }

    @include a.mobile {
      height: 335px;
    }
  }
}

.case__name {
  font-weight: 500;
  font-size: 77px;
  font-family: v.$font-involve;
  line-height: 1.1em;
  letter-spacing: 1.376px;

  @include a.mobile {
    @include t.h4;
  }
}

.case__num {
  display: flex;
  align-items: center;
  margin-top: 24px;

  @include a.mobile {
    margin-top: 12px;
  }

  p {
    margin-inline-end: 32px;

    color: var(--dark-blue-60);

    @include t.body-l-semi;

    @include a.mobile {
      margin-inline-end: 16px;

      @include t.caption-xs-medium;
    }
  }

  hr {
    display: block;
    flex: 1;
    height: 1px;

    background: linear-gradient(90deg, #053478 0%, #8CABFD 53.98%, #DEE9FF 82.64%);
    border: unset;
  }
}

.case__label {
  @include t.h2;

  @include a.mobile {
    @include t.h5;
  }
}

.case__text {
  margin-top: 16px;

  white-space: pre-wrap;

  @include t.body-s-medium;

  @include a.mobile {
    margin-top: 12px;

    line-height: 1.38em !important;

    white-space: unset;

    @include t.body-s-medium-135;
  }
}

.case__link {
  margin-top: 40px;

  @include a.mobile {
    margin-top: 32px;

    padding: 14px 28px 16px;
  }
}
</style>
