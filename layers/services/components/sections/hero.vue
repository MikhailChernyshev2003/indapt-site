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
</script>

<template>
  <section class="service-hero">
    <div class="service-hero__wrapper">
      <div class="service-hero__content">
        <h1 class="service-hero__title" v-html="t(`${i18nKey}.title`)" />
        <ul class="service-hero__tags">
          <li
            v-for="tag in tags"
            :key="tag"
            class="service-hero__tags-item"
          >
            <atoms-tag
              is="span"
              size="s"
              active
            >
              {{ t(`${i18nKey}.tags.${tag}`) }}
            </atoms-tag>
          </li>
        </ul>
      </div>
      <img
        class="service-hero__image"
        :src="image"
        :alt="''"
        fetchpriority="high"
      />
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

  background: linear-gradient(90deg, var(--service-hero-from) 0%, var(--service-hero-to) 100%);
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
    padding-top: 114px;
    padding-bottom: 0;
  }

  @include a.mobile {
    padding-top: 96px;
  }
}

.service-hero__content {
  position: relative;
  z-index: 1;

  max-width: 900px;

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
  gap: 8px;
  margin-top: 40px;

  @include a.mobile {
    // На мобильном теги не переносятся, а прокручиваются вбок:
    // ряд выходит за контейнер и обрезается краем экрана

    flex-wrap: nowrap;
    margin-top: 16px;
    margin-right: -20px;
    padding-right: 20px;
    overflow-x: auto;

    @include s.no-scrollbar;
  }

  &-item {
    @include a.mobile {
      flex-shrink: 0;
    }
  }
}

.service-hero__image {
  position: absolute;
  right: 60px;
  bottom: 0;
  z-index: 0;

  width: 540px;
  height: auto;

  @include a.tablet {
    position: relative;
    right: auto;

    // Снизу иллюстрацию обрезает край блока: отрицательный нижний
    // отступ задаёт ровно ту величину подрезки, что и в макете

    display: block;
    width: 539px;
    margin: 36px auto -9px 64px;
  }

  @include a.mobile {
    // Шире экрана: выходит за оба края, снизу обрезается краем блока.
    // Отрицательный отступ слева гасит паддинг контейнера и прозрачное
    // поле внутри самого файла

    width: 487px;

    // Нижний отступ обнуляем явно, иначе унаследуется подрезка
    // из планшетного правила

    margin: 60px 0 0 -78px;
  }
}
</style>
