<script setup lang="ts">
import type { MethodTabItem } from '@l-services/types';

const { paragraphs = [], tabs } = defineProps<{
  /** Готовая разметка заголовка */
  title: string;
  /** Готовая разметка вводных абзацев в порядке вывода */
  paragraphs?: string[];
  /** Переключатели в порядке вывода */
  tabs: MethodTabItem[];
}>();

const { isMobile, isTablet } = useDevice();

// organisms-tabs-content знает про одну картинку на таб, поэтому нужную
// под брейкпоинт подставляем здесь — как в about/advantages.vue
const renderTabs = computed(() => tabs.map(({ label, text, image, imageTablet, imageMobile }) => {
  const breakpointImage = isMobile.value ? imageMobile : isTablet.value ? imageTablet : image;

  return { label, text, image: breakpointImage || image };
}));
</script>

<template>
  <section class="method-tabs">
    <services-molecules-text-reveal class="method-tabs__head">
      <h2
        class="method-tabs__title"
        data-reveal="title"
        v-html="title"
      />

      <div
        v-if="paragraphs.length"
        class="method-tabs__intro"
        data-reveal="text"
      >
        <p
          v-for="paragraph in paragraphs"
          :key="paragraph"
          class="method-tabs__paragraph"
          v-html="paragraph"
        />
      </div>
    </services-molecules-text-reveal>

    <organisms-tabs-content class="method-tabs__tabs" :tabs="renderTabs" />
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

// Значения по умолчанию внутри var() записаны в rem: postcss-pxtorem
// не заходит внутрь var(), поэтому px там остался бы жёстким, тогда как
// остальная вёрстка тянется от html font-size. В скобках размер по макету

.method-tabs {
  @include s.base-container;
}

.method-tabs__title {
  // Перенос как в макете «Дизайна»: «Гибкий методологический» / «подход».
  // Первая строка занимает 760px, вся фраза в одну строку — 991px

  max-width: var(--method-tabs-title-max-width, 55rem); // 880px

  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

.method-tabs__intro {
  // По макету «Маркетинга» абзацы переносятся по ширине колонки картинки

  max-width: var(--method-tabs-intro-max-width, 40.75rem); // 652px
  margin-top: 16px;

  color: var(--dark-blue);
}

.method-tabs__paragraph {
  @include t.body-m-medium;

  @include a.mobile {
    @include t.body-s-medium-135;
  }

  &:not(:first-child) {
    margin-top: 12px;

    @include a.mobile {
      margin-top: 8px;
    }
  }
}

.method-tabs__tabs {
  margin-top: 60px;

  @include a.mobile {
    margin-top: 32px;
  }

  // Подводки вкладок разной длины: без резерва панель меняет высоту при
  // переключении и сдвигает блок под собой. Держим место под самую высокую.
  // Только на десктопе — на планшете и мобильном вкладки раскрыты все сразу

  :deep(.tabs-content__content_desktop .tabs-content__text) {
    @include a.desktop-only {
      min-height: var(--method-tabs-text-min-height, 0);
    }
  }

  // По макету картинка отбита от текста на 40px, в tabs-content — 38px.
  // Мобильное значение возвращаем явно: ширины мобильного попадают
  // и в tablet, а :deep поднимает специфичность выше исходного правила

  :deep(.tabs-content__image) {
    @include a.tablet {
      margin-top: 40px;
    }

    @include a.mobile {
      margin-top: 16px;
    }
  }

  // Иллюстраций услуг ещё нет: пустой src браузер рисует «битой» картинкой

  :deep(.tabs-content__image[src=""]) {
    display: none;
  }
}
</style>
