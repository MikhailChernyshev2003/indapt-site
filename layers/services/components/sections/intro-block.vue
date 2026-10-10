<script setup lang="ts">
const { title, text, label = '(info)' } = defineProps<{
  /** Заголовок блока, по макету разбит на две строки */
  title: string;
  /** Текст блока, начинается в одной строке с меткой */
  text: string;
  /** Метка перед первой строкой текста */
  label?: string;
}>();
</script>

<template>
  <section class="intro-block">
    <div v-if="$slots.decor" class="intro-block__decor">
      <slot name="decor" />
    </div>
    <services-molecules-text-reveal class="intro-block__content">
      <h2
        class="intro-block__title"
        data-reveal="title"
        v-html="title"
      />
      <p class="intro-block__text" data-reveal="text">
        <span class="intro-block__label">{{ label }}</span>
        <span v-html="text" />
      </p>
    </services-molecules-text-reveal>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

// Значения по умолчанию внутри var() записаны в rem: postcss-pxtorem
// не заходит внутрь var(), поэтому px там остался бы жёстким, тогда как
// остальная вёрстка тянется от html font-size. В скобках размер по макету

.intro-block {
  position: relative;

  display: grid;
  grid-template-columns: var(--intro-decor-size, 29.5rem) 1fr; // 472px
  align-items: center;

  column-gap: 84px;

  @include s.base-container;

  @include a.tablet {
    // Текст занимает всю ширину, декор уходит из потока за правый край
    // экрана: там его режет страница, а сверху он по макету заходит на шапку

    display: block;
  }
}

.intro-block__decor {
  width: var(--intro-decor-size, 29.5rem); // 472px

  @include a.tablet {
    position: absolute;
    top: var(--intro-decor-top, -13.625rem); // -218px
    right: var(--intro-decor-right, -8.5rem); // -136px

    // По макету круги уходят под первый экран: верх срезан ровно по его
    // нижней границе. Секция ниже экрана на свой отступ, его страница
    // передаёт в --intro-decor-overlap; по бокам и снизу фигуру не режем

    clip-path: inset(
      calc(var(--intro-decor-top, -13.625rem) * -1 - var(--intro-decor-overlap, 0rem))
      -100vw
      -100vw
    );
  }

  @include a.mobile {
    // Круг меньше и по макету не подрезан сверху

    top: var(--intro-decor-top-mobile, 0);
    right: var(--intro-decor-right-mobile, -7.125rem); // -114px

    width: var(--intro-decor-size-mobile, 17.375rem); // 278px

    clip-path: none;
  }

  // Картинка в слоте растягивается по контейнеру декора

  :deep(img) {
    display: block;
    width: 100%;
    height: auto;
  }
}

.intro-block__content {
  // Декор вынут из потока и лёг бы поверх текста

  position: relative;
  z-index: 1;

  max-width: var(--intro-text-width, 45.5rem); // 728px

  @include a.tablet {
    max-width: none;
  }
}

.intro-block__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

.intro-block__text {
  margin-top: 24px;

  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    margin-top: 16px;

    @include t.body-s-medium-135;
  }

  // Перенос в локали — десктопный: на узких экранах макет набран без него

  :deep(br) {
    @include a.tablet {
      display: none;
    }
  }
}

// Метка стоит внутри первой строки абзаца, а не отдельной колонкой,
// поэтому от текста её отбивает собственное поле

.intro-block__label {
  margin-right: 32px;

  color: var(--dark-blue);

  @include t.caption-m-medium;

  @include a.mobile {
    margin-right: 8px;

    @include t.caption-xs-medium;
  }
}
</style>
