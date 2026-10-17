<script setup lang="ts">
import kv1 from '@l-expertise/assets/images/tabs/health/kv1.png';
import kv1webp from '@l-expertise/assets/images/tabs/health/kv1.webp';
import kv2 from '@l-expertise/assets/images/tabs/health/kv2.png';
import kv2webp from '@l-expertise/assets/images/tabs/health/kv2.webp';
import kv3 from '@l-expertise/assets/images/tabs/health/kv3.png';
import kv3webp from '@l-expertise/assets/images/tabs/health/kv3.webp';
import { useAdaptiveGsap } from '@l-expertise/composables/useAdaptiveGsap';
import { useRealPointerMove } from '@l-expertise/composables/useRealPointerMove';

const { isDesktop } = useDevice();
const { t } = useI18n();

const activeBlock = shallowRef(0);
const healthItems = ref<HTMLElement[]>([]);

const healthContent = computed(() => [
  {
    image: kv2,
    webp: kv2webp,
    label: t('expertise.health.blocks.block_1.label'),
    text: t('expertise.health.blocks.block_1.text_1'),
  },
  {
    image: kv1,
    webp: kv1webp,
    label: t('expertise.health.blocks.block_2.label'),
    text: t('expertise.health.blocks.block_2.text_1'),
  },
  {
    image: kv3,
    webp: kv3webp,
    label: t('expertise.health.blocks.block_3.label'),
    text: t('expertise.health.blocks.block_3.text_1'),
  },
]);

const isRealPointerMove = useRealPointerMove();

// Заголовок меняет кегль скачком при смене состояния карточки — проявляем его заново уже в новом размере,
// чтобы не было видно, как он перескакивает. Анимация без конечного кадра доходит до opacity из CSS
const fadeInTitle = (item?: HTMLElement) => {
  item?.querySelector('.health__item-title')?.animate(
    [{ opacity: 0, offset: 0 }],
    { duration: 400, easing: 'ease-out' },
  );
};

// mouseenter прилетал и при скролле колесом, когда карточка сама проезжала под курсором, — карточки
// переключались без участия пользователя. Реагируем только на настоящее движение мыши
const handleItemHover = (event: PointerEvent, index: number): void => {
  if (!isRealPointerMove(event)) return;

  selectItem(index);
};

// Тап на планшете с десктопной шириной: наведения там нет
const selectItem = (index: number): void => {
  if (!isDesktop.value || index === activeBlock.value) return;

  fadeInTitle(healthItems.value[activeBlock.value]);
  fadeInTitle(healthItems.value[index]);

  activeBlock.value = index;
  updateItemClasses(index);
};

const updateItemClasses = (activeIndex: number) => {
  const [firstItem, secondItem, thirdItem] = healthItems.value;

  if (firstItem) {
    firstItem.classList.toggle('first-item-shrink', activeIndex > 0);
    firstItem.classList.toggle(
      'first-item-shrink-second-active',
      activeIndex === 1,
    );
  }

  if (secondItem) {
    secondItem.classList.toggle(
      'second-item-shrink-third-active',
      activeIndex === 2,
    );
  }

  if (thirdItem) {
    thirdItem.classList.toggle(
      'third-item-shrink-second-active',
      activeIndex === 1,
    );
  }
};

const animationTablet = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.health__list',
      start: 'top+=80% bottom',
      end: 'bottom+=30% bottom',
      scrub: 1,
    },
  });

  tl.to('.health__item:nth-child(1)', {
    width: '21rem',
    height: '21rem',
    duration: 10,
  });

  // Текст гаснет/проявляется плавно на отрезке скролла, а не мгновенно (было duration 0.2 из 10)
  tl.to(
    '.health__item:nth-child(1) .health__item-text',
    {
      opacity: 0,
      duration: 3,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(1) .health__item-title',
    {
      opacity: 0.4,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(1) .health__item-image',
    {
      height: '10rem',
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(2)',
    {
      width: '100%',
      height: '36.5rem',
      y: '-16rem',
      zIndex: 4,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(2) .health__item-content',
    {
      opacity: 1,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(2) .health__item-title',
    {
      opacity: 1,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(2) .health__item-image',
    {
      height: '13rem',
      x: '-5rem',
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(2) .health__item-text',
    {
      opacity: 1,
      duration: 2,
      delay: 5,
    },
    '<',
  );

  tl.to('.health__item:nth-child(2)', {
    width: '21rem',
    height: '21rem',
    duration: 10,
  });

  tl.to(
    '.health__item:nth-child(2) .health__item-text',
    {
      opacity: 0,
      duration: 3,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(2) .health__item-title',
    {
      opacity: 0.6,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(2) .health__item-image',
    {
      height: '10rem',
      x: 0,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(3)',
    {
      width: '100%',
      height: '36.5rem',
      y: '-13rem',
      zIndex: 5,
      x: '-16.2rem',
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(3) .health__item-content',
    {
      opacity: 1,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(3) .health__item-title',
    {
      opacity: 1,
      scale: 1,
      duration: 10,
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(3) .health__item-image',
    {
      height: '14rem',
      duration: 10,
      x: '-10rem',
    },
    '<',
  );

  tl.to(
    '.health__item:nth-child(3) .health__item-text',
    {
      opacity: 1,
      duration: 3,
      delay: 6,
    },
    '<',
  );

  // Ширина текста меняется один раз — на середине изменения карточки, а не на каждом кадре:
  // пока скролл тянет или сжимает карточку, строки не перескакивают (лишнее обрезает overflow карточки)
  const content = (n: number) => `.health__item:nth-child(${n}) .health__item-content`;

  gsap.set([content(1), content(2), content(3)], {
    width: (_: number, el: HTMLElement) => el.offsetWidth,
  });

  tl.set(content(1), { width: '21rem' }, 5);
  tl.set(content(2), { width: '100cqw' }, 5);
  tl.set(content(2), { width: '21rem' }, 15);
  tl.set(content(3), { width: '100cqw' }, 15);
};

// Мобильный: карточки сменяют друг друга, пока список стоит под панелью вкладок. Список держит CSS position: sticky
// внутри высокой обёртки .health__scene, а не pin ScrollTrigger: JS-pin переключал список на position: fixed
// с опозданием на кадр (и заранее — из-за anticipatePin), на быстром свайпе список отскакивал на десятки пикселей.
// Sticky держит браузер, синхронно со скроллом. Здесь только прокрутка анимации карточек по скроллу
const animationMobile = () => {
  const scene = document.querySelector<HTMLElement>('.health__scene');
  const list = document.querySelector<HTMLElement>('.health__list');
  if (!scene || !list) return;

  // Отступ прилипания и длина сцены берутся из CSS (top списка и высота обёртки) — числа живут в одном месте
  const stickyTop = () => parseFloat(getComputedStyle(list).top) || 0;
  const distance = () => scene.offsetHeight - list.offsetHeight;

  gsap.set('.health__item:nth-child(3)', {
    y: '33rem',
  });
  gsap.set('.health__item:nth-child(2)', {
    y: '35rem',
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: () => `top top+=${stickyTop()}`,
      end: () => `+=${distance()}`,
      scrub: 1,
    },
  });

  tl.to('.health__item:nth-child(1)', {
    opacity: 0,
  });
  tl.to('.health__item:nth-child(2)', {
    y: 0,
  }, '<');
  tl.to('.health__item:nth-child(2)', {
    opacity: 0,
  });
  tl.to('.health__item:nth-child(3)', {
    y: 0,
    zIndex: 10,
  }, '<');
};

useAdaptiveGsap({
  desktop: () => undefined,
  tablet: animationTablet,
  mobile: animationMobile,
});
</script>

<template>
  <div class="health">
    <div class="health__wrapper">
      <p class="health__text">{{ t('expertise.health.text') }}</p>

      <!-- Обёртка сцены: на мобильном задаёт длину прокрутки, пока список прилип; на остальных ширинах её нет (display: contents) -->
      <div class="health__scene">
        <div class="health__list">
          <div
            v-for="(item, index) in healthContent"
            :key="index"
            ref="healthItems"
            class="health__item"
            :aria-selected="activeBlock === index"
            @pointermove="handleItemHover($event, index)"
            @click="selectItem(index)"
          >
            <div class="health__item-content">
              <div class="health__item-header">
                <mark class="health__item-num">
                  ({{ String(index + 1).padStart(2, "0") }})
                </mark>
                <div class="health__item-line" />
              </div>
              <h3 class="health__item-title" v-html="item.label" />
              <p class="health__item-text" v-html="item.text" />
            </div>

            <atoms-picture
              class="health__item-image"
              :src="item.image"
              :webp="item.webp"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;

.health {
  &__text {
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

  // Мобильный: высота = список (550px) + путь прокрутки сцены (1200px). Список прилипает в 118px от верха экрана —
  // там же, где его закреплял прежний pin (start: 'top-=118px top'). Отступ над списком перенесён на обёртку,
  // чтобы верх липкого списка совпадал с верхом сцены
  &__scene {
    display: contents;

    @include a.mobile {
      display: block;
      height: calc(550px + 1200px);
      margin-top: 8px;
    }
  }

  &__list {
    position: relative;
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 585px;
    margin-top: 36px;
    overflow: hidden;

    @include a.tablet {
      display: block;
      height: 800px;
      overflow: visible;

      // Отсчёт для cqw в планшетной анимации: ширина текста раскрытой карточки = ширина списка

      container-type: inline-size;
    }

    @include a.mobile {
      position: sticky;
      top: 118px;

      height: 550px;
      margin-top: 0;
      overflow: hidden;
    }
  }

  &__item {
    position: relative;

    flex-shrink: 0;
    width: 668px;
    height: 100%;
    overflow: hidden;

    background: #fcfeff;
    border: 1px solid var(--dark-blue-5);
    border-radius: 16px;

    // Без z-index: при transition: all он менялся ступеньками посреди анимации и карточки «перещёлкивались»

    transition: 0.5s ease;
    transition-property: top, left, width, height;

    @include a.tablet {
      transition: none;
    }

    &[aria-selected="true"] {
      .health__item-text {
        opacity: 1;

        // Текст проявляется, когда карточка уже почти раскрылась
        @include a.desktop-only {
          transition: opacity 0.35s ease 0.25s;
        }
      }
    }

    &:nth-child(1) {
      z-index: 4;

      @include a.tablet {
        width: 100%;
        height: 585px;
      }

      @include a.mobile {
        height: 550px;
      }

      // Десктоп: ширина текста = итоговая ширина карточки в текущем состоянии и меняется сразу, без анимации.
      // Пока карточка тянется или сжимается, текст не переносится заново на каждом кадре (лишнее обрезает overflow)

      .health__item-content {
        @include a.desktop-only {
          width: 668px;
        }
      }

      .health__item-image {
        right: 150px;
        bottom: 10px;

        height: 300px;

        @include a.tablet {
          bottom: -12px;

          height: 339px;
        }

        @include a.mobile {
          right: unset;
          bottom: 50px;
          left: 50%;

          height: 170px;

          transform: translateX(-50%);
        }
      }

      &.first-item-shrink {
        top: 125px;
        left: 30px;
        z-index: 1;

        width: 334px;
        height: 334px;

        .health__item-content {
          @include a.desktop-only {
            width: 334px;
          }
        }

        .health__item-title {
          font-size: 24px;

          background: linear-gradient(90deg, #0c1d4f 0%, #c6d5f8 100%);
          background-clip: text;
          opacity: 0.2;
          -webkit-text-fill-color: transparent;
        }

        .health__item-image {
          right: 50px;

          height: 150px;
        }
      }

      &.first-item-shrink-second-active {
        top: 30px;
      }
    }

    &:nth-child(2) {
      top: 33px;
      left: 36px;
      z-index: 3;

      align-self: start;
      width: 428px;
      height: 459px;

      @include a.tablet {
        top: 26px;
        left: 0 !important;
      }

      @include a.mobile {
        position: absolute;
        top: 0;
        z-index: 8;

        width: 100%;
        height: 550px;
      }

      .health__item-content {
        opacity: 0.6;

        @include a.desktop-only {
          width: 428px;
        }
      }

      .health__item-title {
        font-size: 24px;

        background: linear-gradient(90deg, #0c1d4f 0%, #c6d5f8 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;

        @include a.tablet {
          color: var(--dark-blue);
          font-size: 32px;

          background: none;
          -webkit-text-fill-color: unset;
        }

        @include a.mobile {
          @include t.h5;
        }
      }

      .health__item-image {
        right: 13px;
        bottom: 50px;

        height: 150px;

        @include a.mobile {
          right: unset;
          bottom: 40px;
          left: 50%;

          height: 120px;

          transform: translateX(-50%);
        }
      }

      &[aria-selected="true"] {
        top: 0;
        left: 0;

        width: 668px;
        height: 100%;

        .health__item-content {
          opacity: 1;

          @include a.desktop-only {
            width: 668px;
          }
        }

        .health__item-image {
          right: 15%;

          height: 200px;
        }

        .health__item-title {
          background: var(--dark-blue);
          background-clip: text;
          -webkit-text-fill-color: transparent;

          @include t.h3;
        }
      }

      &.second-item-shrink-third-active {
        top: 64px;
        left: 0;

        width: 428px;
        height: 459px;

        .health__item-title {
          opacity: 0.2;
        }

        .health__item-image {
          right: 50px;

          height: 150px;
        }
      }
    }

    &:nth-child(3) {
      top: 125px;
      left: -126px;
      z-index: 2;

      width: 334px;
      height: 334px;

      @include a.tablet {
        top: -250px !important;
        left: 260px !important;
      }

      @include a.mobile {
        position: absolute;
        top: 0 !important;
        left: 0 !important;
        z-index: 7;

        width: 100%;
        height: 550px;
      }

      .health__item-content {
        opacity: 0.3;

        @include a.desktop-only {
          width: 334px;
        }
      }

      .health__item-title {
        font-size: 20px;

        opacity: 0.6;

        @include a.tablet {
          font-size: 32px;
        }

        @include a.mobile {
          opacity: 1;

          @include t.h5;
        }
      }

      .health__item-image {
        right: 60px;
        bottom: 25px;

        height: 130px;

        @include a.tablet {
          height: 150px;
        }

        @include a.mobile {
          right: unset;
          bottom: 10px;
          left: 50%;

          height: 125px;

          transform: translateX(-53%);
        }
      }

      &[aria-selected="true"] {
        top: 0;
        left: -126px;
        z-index: 3;

        width: 668px;
        height: 100%;

        .health__item-content {
          opacity: 1;

          @include a.desktop-only {
            width: 668px;
          }
        }

        .health__item-title {
          opacity: 1;

          @include t.h3;
        }

        .health__item-image {
          right: 30%;

          height: 200px;

          @include a.mobile {
            right: unset;
            left: 50%;

            transform: translateX(-50%);
          }
        }
      }

      &.third-item-shrink-second-active {
        top: -25px;

        .health__item-image {
          right: 35px;
          bottom: 25px;

          height: 150px;
        }
      }
    }

    &-content {
      padding: 28px 28px 0;

      @include a.mobile {
        padding: 20px 20px 0;

        opacity: 1 !important;
      }
    }

    &-header {
      display: flex;
      align-items: center;
    }

    &-image {
      position: absolute;
      right: 0;
      bottom: 0;

      width: auto;
      height: 230px;
      object-fit: cover;

      transition: all 0.5s;

      @include a.tablet {
        transition: none;
      }
    }

    &-num {
      color: var(--dark-blue-40);

      @include t.caption-m-medium;

      @include a.mobile {
        @include t.caption-xs-medium;
      }
    }

    &-line {
      width: 100%;
      height: 1px;
      margin-left: 16px;

      background: linear-gradient(90deg, #053478 0%, #8cabfd 52.6%);
    }

    &-title {
      margin-top: 32px;

      color: var(--dark-blue);

      transform-origin: left top;

      @include t.h3;

      @include a.mobile {
        margin-top: 24px;

        @include t.h5;
      }
    }

    &-text {
      margin-top: 16px;

      color: var(--dark-blue-80);

      opacity: 0;

      // Сворачивание: текст гаснет раньше, чем карточка заметно сожмётся

      transition: opacity 0.15s ease;

      // Текст виден только у раскрытой карточки — свёрстан сразу под её ширину и не переносится при сворачивании
      @include a.desktop-only {
        width: 612px;
      }

      @include t.body-m-medium;

      @include a.tablet {
        transition: none;
      }

      @include a.mobile {
        margin-top: 10px;

        opacity: 1;

        @include t.body-s-medium-135;
      }
    }
  }
}
</style>
