<script setup lang="ts">
const { i18nKey, tags, image } = defineProps<{
  /** Базовый ключ услуги, например services.analyticsPlanning */
  i18nKey: string;
  /** Ключи тегов внутри <i18nKey>.tags */
  tags: string[];
  /** Иллюстрация услуги */
  image: string;
}>();

const { t } = useI18n();

const tagsRef = useTemplateRef<HTMLUListElement>('tagsRef');

/** Флаги «пилюля закрывает свой ряд» по индексам тегов */
const rowEnds = ref<boolean[]>([]);

// Последней пилюле ряда запас под перекрытие не нужен. Где браузер перенёс
// ряд, CSS не знает, поэтому концы рядов размечаем по фактическим координатам.
// На раскладку разметка не влияет: ширина пилюли в потоке не меняется
const markRowEnds = () => {
  const items = Array.from(tagsRef.value?.children ?? []) as HTMLElement[];

  rowEnds.value = items.map((item, idx) => {
    const next = items[idx + 1];

    return !next || next.offsetTop !== item.offsetTop;
  });
};

useResizeObserver(tagsRef, markRowEnds);

// Ширина пилюль меняется, когда догружается шрифт, а размер списка — не всегда
onMounted(() => {
  document.fonts?.ready.then(markRowEnds);
});
</script>

<template>
  <section class="service-hero">
    <div class="service-hero__wrapper">
      <div class="service-hero__content">
        <h1 class="service-hero__title" v-html="t(`${i18nKey}.title`)" />
        <ul ref="tagsRef" class="service-hero__tags">
          <li
            v-for="(tag, idx) in tags"
            :key="tag"
            class="service-hero__tag"
            :class="{ 'service-hero__tag_row-end': rowEnds[idx] }"
          >
            {{ t(`${i18nKey}.tags.${tag}`) }}
          </li>
        </ul>
      </div>
      <div class="service-hero__visual">
        <img
          class="service-hero__image"
          :src="image"
          :alt="''"
          fetchpriority="high"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.service-hero {
  position: relative;

  overflow: hidden;

  // Градиент у каждой услуги доходит до светлого цвета на своей доле ширины.
  // Линия по нижней границе — тенью: она не добавляет высоты, а иллюстрация
  // ложится поверх неё, как в макете

  background: linear-gradient(
    90deg,
    var(--service-hero-from) 0%,
    var(--service-hero-to) var(--service-hero-stop, 100%)
  );
  box-shadow: inset 0 -1px 0 var(--dark-blue-10);
}

.service-hero__wrapper {
  position: relative;

  display: flex;
  align-items: flex-end;
  min-height: 443px;
  padding-top: 160px;
  padding-bottom: 48px;

  @include s.base-container;

  @include a.tablet {
    display: block;
    min-height: 0;
    padding-top: 112px;
    padding-bottom: 0;
  }

  @include a.mobile {
    padding-top: 96px;
  }
}

.service-hero__content {
  position: relative;
  z-index: 1;

  // Ширина колонки по макету: от неё зависит, как переносятся теги.
  // Значение по умолчанию в rem: postcss-pxtorem не заходит внутрь var(),
  // и с px теги на 1024 вставали в один ряд, а на 1920 — в три

  max-width: var(--hero-content-width, 50.625rem); // 810px

  @include a.tablet {
    max-width: none;
  }
}

.service-hero__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.mobile {
    @include t.h4;
  }
}

.service-hero__tags {
  display: flex;
  flex-wrap: wrap;
  row-gap: 4px;

  // Зазор от заголовка по макету

  margin-top: 24px;

  // Пилюли перекрывают друг друга на 36px. В CSS gap не может быть
  // отрицательным, поэтому перекрытие задают отступы самой пилюли,
  // а этот padding возвращает первую пилюлю каждого ряда к краю

  padding-left: 12px;

  @include a.mobile {
    // На мобильном теги не переносятся, а прокручиваются вбок

    flex-wrap: nowrap;
    margin-top: 16px;
    margin-right: -20px;
    padding-right: 20px;
    overflow-x: auto;

    @include s.no-scrollbar;
  }
}

.service-hero__tag {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 40px;

  // Справа поля больше: 36px из них перекрывает следующая пилюля.
  // Отрицательный правый отступ убирает 24px запаса из раскладки — ряд
  // переносится по обычному полю последней пилюли, как в макете

  margin-right: -24px;
  margin-left: -12px;
  padding: 0 48px 0 24px;

  color: var(--dark-blue);

  background: linear-gradient(90deg, var(--white) 0%, var(--white-40) 100%);
  border: 1px solid var(--dark-blue-10);
  border-radius: 50px;

  @include t.caption-s-semi-128;

  // Последнюю пилюлю ряда перекрывать нечем — поле обычное.
  // Ширина в потоке при этом та же, перенос рядов не сдвигается

  &:last-child,
  &_row-end {
    margin-right: 0;
    padding-right: 24px;
  }
}

.service-hero__visual {
  // Блок под иллюстрацию по макету: 301px от тегов до нижнего края героя.
  // Иллюстрацию в нём каждая услуга ставит сама, лишнее срезает край героя

  @include a.tablet {
    position: relative;

    height: 301px;
    margin-top: 24px;
  }
}

.service-hero__image {
  position: absolute;
  right: var(--hero-image-right, 60px);
  bottom: var(--hero-image-bottom, 0);
  z-index: 0;

  width: var(--hero-image-width, 510px);
  height: auto;

  @include a.tablet {
    inset: var(--hero-image-top-tablet, 0) auto auto var(--hero-image-left-tablet, 0);

    width: var(--hero-image-width-tablet, 510px);
  }

  @include a.mobile {
    top: var(--hero-image-top-mobile, 0);
    left: var(--hero-image-left-mobile, 0);

    width: var(--hero-image-width-mobile, 420px);
  }
}
</style>
