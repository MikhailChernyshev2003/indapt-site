<script setup lang="ts">
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import type { ArchitectureCardItem } from '@l-services/types';

const { items, mark } = defineProps<{
  /** Карточки в порядке вывода */
  items: ArchitectureCardItem[];
  /** Ромб, выезжающий у наведённой карточки; без пропа карточка остаётся без него */
  mark?: string;
}>();

const { isDesktop } = useDevice();

const hoveredIdx = ref(-1);

const sectionRef = useTemplateRef<HTMLElement>('sectionRef');
const cardsRef = useTemplateRef<HTMLElement[]>('cardsRef');

// Наведение считаем от позиции курсора, а не от mouseenter/mouseleave на
// карточках. Раскрытая карточка сдвигает соседние, и под неподвижным курсором
// меняется то, что под ним лежит: браузер шлёт leave и enter, состояние
// переключается, карточки едут обратно — и так по кругу
let lastX = -1;
let lastY = -1;

// Событие с теми же координатами браузер присылает сам, когда вёрстка уехала
// из-под неподвижного указателя — после скролла и по ходу анимации высоты.
// Реагировать на него нельзя: это тот же источник качелей, ради которого
// отказались от mouseenter/mouseleave, просто по другому каналу
const isStale = (event: PointerEvent) =>
  event.clientX === lastX && event.clientY === lastY;

const hitIndex = (event: PointerEvent) => {
  const cards = cardsRef.value;

  if (!cards?.length) return -1;

  const card = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest<HTMLElement>('.architecture-cards__card');

  return card ? cards.indexOf(card) : -1;
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isDesktop.value || isStale(event)) return;

  lastX = event.clientX;
  lastY = event.clientY;

  const idx = hitIndex(event);

  // В зазоре между карточками состояние не трогаем: иначе при медленном
  // переезде карточка успевала бы схлопнуться и тут же раскрыться обратно
  if (idx === -1) return;

  hoveredIdx.value = idx;
};

// Уход курсора фильтровать по координатам нельзя: когда указатель покидает
// окно, браузер шлёт leave с координатами последнего движения — такое событие
// отсеклось бы, и карточка осталась бы раскрытой навсегда
const handlePointerLeave = () => {
  lastX = -1;
  lastY = -1;

  hoveredIdx.value = -1;
};

const itemNumber = (idx: number) => `(${String(idx + 1).padStart(2, '0')})`;

/** На планшете и мобильном раскрыты все карточки, на десктопе — только наведённая */
const isExpanded = (idx: number) => !isDesktop.value || hoveredIdx.value === idx;

// Продолжение склеивается с началом в один абзац: в русской локали text
// продолжает предложение и начинается со знака препинания («. По результатам…»),
// в английской это самостоятельное предложение. Пробел ставим только во втором
// случае, иначе перед точкой появился бы отбив
const moreText = (item: ArchitectureCardItem) =>
  `${/^[A-Za-zА-Яа-яЁё]/.test(item.text) ? ' ' : ''}${item.text}`;

// Раскрытие карточки — одна GSAP-раскадровка на карточку. Продолжение текста
// всегда стоит в абзаце, а не подменяется: его буквы проявляются одна за
// другой, а колонка текста плавно доезжает до новой высоты. Высота карточки
// идёт за колонкой сама, поэтому замерять и фиксировать её не нужно, и
// заголовку с ромбом нечего перескакивать: они едут в одном такте с текстом
interface CardMotion {
  content: HTMLElement;
  more: HTMLElement;
  chars: Element[];
  split: SplitText;
  timeline: gsap.core.Timeline | null;
}

let motions: CardMotion[] = [];

// Кривая проекта (см. $easing в variables.scss) — чтобы высота, ромб и заголовок
// разгонялись одинаково
const EASE = 'cubic-bezier(0.12, 0.46, 0.47, 0.99)';
const HEIGHT_DURATION = 0.4;

// Высоты в проекте дробные (rem от ширины экрана), поэтому меряем через
// getBoundingClientRect: округлённый offsetHeight занижал запас на доли
// пикселя, и раскрытая карточка сдвигала блоки ниже на 1px
const heightOf = (el: HTMLElement) => el.getBoundingClientRect().height;

/** Высота колонки с коротким и с полным текстом; на время замера состояние подменяется и возвращается */
const measure = ({ content, more }: CardMotion) => {
  const inlineHeight = content.style.height;
  const inlineDisplay = more.style.display;

  content.style.height = '';
  more.style.display = 'none';

  const short = heightOf(content);

  more.style.display = 'inline';

  const full = heightOf(content);

  content.style.height = inlineHeight;
  more.style.display = inlineDisplay;

  return { short, full };
};

// Секция заранее держит высоту «со всеми карточками свёрнутыми плюс самое
// длинное продолжение»: раскрытая карточка растёт внутрь этого запаса,
// и блоки ниже не ездят вслед за ней. Запас в px, поэтому пересчитывается
// на ресайз и после загрузки шрифтов
const reserveHeight = () => {
  const section = sectionRef.value;

  if (!section || !motions.length) return;

  section.style.minHeight = '';

  let growth = 0;
  let expanded = 0;

  motions.forEach((motion) => {
    const { short, full } = measure(motion);

    growth = Math.max(growth, full - short);
    // Если пересчёт пришёлся на наведение, текущая высота уже включает часть раскрытия
    expanded += Math.max(0, heightOf(motion.content) - short);
  });

  // Округляем вверх с запасом в пиксель: раскрытая карточка должна помещаться
  // в секцию целиком, иначе секция подрастает на долю пикселя и блоки ниже дрожат
  section.style.minHeight = `${Math.ceil(heightOf(section) - expanded + growth) + 1}px`;
};

/**
 * Текущая высота колонки становится стартовой: новая раскадровка идёт с того
 * места, где остановилась прежняя. Снимать её нужно до того, как продолжение
 * покажется или спрячется, иначе стартом стала бы уже конечная высота
 */
const freeze = (motion: CardMotion) => {
  motion.timeline?.kill();
  motion.content.style.height = `${heightOf(motion.content)}px`;
};

const expand = (motion: CardMotion) => {
  const { content, chars } = motion;

  freeze(motion);

  motion.more.style.display = 'inline';

  const { full } = measure(motion);

  // Буквы идут от начала к концу и заканчивают позже высоты: последние строки
  // дописываются уже в доехавшей карточке
  motion.timeline = gsap.timeline({
    onComplete: () => {
      content.style.height = '';
    },
  })
    .to(content, { height: full, duration: HEIGHT_DURATION, ease: EASE }, 0)
    .to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
      stagger: { each: 0.003, from: 'start' },
    }, 0.05);
};

/**
 * Сворачивание. Буквы гаснут с конца, а высота по умолчанию трогается чуть
 * позже: нижние строки успевают исчезнуть раньше, чем их срежет граница.
 * При переезде на соседнюю карточку задержки нет: уход и приход идут одной
 * кривой с одного момента, сумма высот не меняется — секция стоит на месте
 */
const collapse = (motion: CardMotion, heightDelay = 0.12) => {
  const { content, more, chars } = motion;

  freeze(motion);

  const { short } = measure(motion);

  motion.timeline = gsap.timeline({
    onComplete: () => {
      more.style.display = '';
      content.style.height = '';
    },
  })
    .to(chars, {
      opacity: 0,
      y: 4,
      duration: 0.18,
      ease: 'power1.in',
      stagger: { each: 0.0025, from: 'end' },
    }, 0)
    .to(content, { height: short, duration: HEIGHT_DURATION, ease: EASE }, heightDelay);
};

// За брейкпоинтом карточки раскрыты всегда: буквы и высота живут в CSS,
// инлайновые значения снимаем
const resetMotions = () => {
  if (sectionRef.value) sectionRef.value.style.minHeight = '';

  motions.forEach((motion) => {
    motion.timeline?.kill();
    motion.timeline = null;
    motion.more.style.display = '';
    motion.content.style.height = '';
    gsap.set(motion.chars, { clearProps: 'all' });
  });
};

/** Десктопное исходное состояние: продолжение спрятано, буквы прозрачны */
const collapseAll = () => {
  motions.forEach((motion) => {
    motion.more.style.display = '';
    gsap.set(motion.chars, { opacity: 0, y: 4 });
  });
};

useGsap(() => {
  const cards = cardsRef.value;

  if (!cards?.length) return;

  motions = cards.map((card) => {
    const content = card.querySelector<HTMLElement>('.architecture-cards__content')!;
    const more = card.querySelector<HTMLElement>('.architecture-cards__text-more')!;

    // Слова остаются целыми блоками, поэтому разбиение на буквы не меняет переносы
    const split = new SplitText(more, { type: 'words,chars' });

    return { content, more, chars: split.chars, split, timeline: null };
  });

  if (isDesktop.value) {
    collapseAll();
    reserveHeight();
    document.fonts?.ready.then(() => isDesktop.value && reserveHeight());
  }
});

let resizeFrame = 0;

const handleResize = () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => isDesktop.value && reserveHeight());
};

useEventListener(window, 'resize', handleResize);

watch(hoveredIdx, (idx, prevIdx) => {
  if (!isDesktop.value || !motions.length) return;

  if (prevIdx !== -1) collapse(motions[prevIdx], idx === -1 ? undefined : 0);
  if (idx !== -1) expand(motions[idx]);
});

// Смена брейкпоинта — не жест пользователя: карточки просто перестраиваются.
// Это же состояние приходит и после гидратации, когда угаданный на сервере
// брейкпоинт разошёлся с реальной шириной
watch(isDesktop, (desktop) => {
  hoveredIdx.value = -1;

  if (!motions.length) return;

  resetMotions();

  if (desktop) {
    collapseAll();
    reserveHeight();
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame);
  motions.forEach((motion) => {
    motion.timeline?.kill();
    motion.split.revert();
  });
  motions = [];
});
</script>

<template>
  <section
    ref="sectionRef"
    class="architecture-cards"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <article
      v-for="(item, idx) in items"
      ref="cardsRef"
      :key="item.title"
      class="architecture-cards__card"
      :class="{ 'architecture-cards__card_expanded': isExpanded(idx) }"
    >
      <div class="architecture-cards__head">
        <!-- По макету при наведении слева от заголовка появляется ромб.
             Он вынут из потока, чтобы его размер не участвовал в высоте карточки -->
        <span v-if="mark" class="architecture-cards__mark">
          <img
            class="architecture-cards__mark-image"
            :src="mark"
            alt=""
            width="236"
            height="236"
          />
        </span>
        <h3 class="architecture-cards__title" v-html="item.title" />
      </div>
      <div class="architecture-cards__content">
        <span class="architecture-cards__number">{{ itemNumber(idx) }}</span>
        <p class="architecture-cards__text">
          <span v-html="item.shortText" />
          <span class="architecture-cards__text-more" v-html="moreText(item)" />
        </p>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.architecture-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @include s.base-container;

  // Пока карточка растёт, соседние ниже сдвигаются, и браузер «якорит»
  // скролл на одной из них — подкручивает страницу на каждый кадр, и всё
  // вокруг дрожит. Внутри секции якорей быть не должно: блок ниже стоит
  // на месте благодаря запасу высоты (см. reserveHeight)

  :deep(*),
  & {
    overflow-anchor: none;
  }
}

// Ромб, заголовок и фон едут одной кривой и в один такт с высотой (см. EASE
// в скрипте), чуть дольше стандартных 0.3s — чтобы исчезновение не рубилось

$card-motion: 0.4s v.$easing;

.architecture-cards__card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 32px;
  overflow: hidden;

  background-color: var(--architecture-card-bg, var(--white));
  border-radius: 16px;

  transition: background-color $card-motion;

  @include a.tablet {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @include a.mobile {
    gap: 16px;
    padding: 16px;
  }

  &_expanded {
    // Подсветка идёт от того же состояния, что и раскрытие: на нативном :hover
    // в зазоре между карточками фон гас раньше, чем схлопывалась карточка.
    // mouse-only — на тач-экране шириной с десктоп подсвечивать нечего

    @include a.desktop-only {
      @include s.mouse-only {
        background-color: var(--architecture-card-bg-hover, var(--light-blue));
      }
    }

    .architecture-cards__title {
      transform: none;
    }

    .architecture-cards__mark {
      transform: translateY(-50%) scale(1);

      opacity: 1;
    }

    .architecture-cards__number {
      color: var(--dark-blue-40);
    }
  }
}

.architecture-cards__head {
  position: relative;

  display: flex;
  align-items: center;

  // Место под ромб держим всегда: пока отступ появлялся вместе с раскрытием,
  // менялась ширина заголовка, а с ней и переносы строк

  // По макету заголовок раскрытой карточки стоит в 192px от края контента

  @include a.desktop-only {
    padding-left: var(--architecture-mark-space, 12rem); // 192px
  }
}

// Ромб лежит поверх, вне потока: его размер не попадает в высоту карточки.
// У картинки прозрачные поля, поэтому она шире видимого ромба и заходит
// в поле карточки — видимая часть по макету начинается в 22px от её края

.architecture-cards__mark {
  position: absolute;
  top: 50%;
  left: -30px;

  width: var(--architecture-mark-size, 8.5625rem); // 137px

  transform: translateY(-50%) scale(0.6);

  opacity: 0;

  transition: opacity $card-motion, transform $card-motion;

  @include a.tablet {
    display: none;
  }
}

.architecture-cards__mark-image {
  display: block;
  width: var(--architecture-mark-size, 8.5625rem); // 137px
  height: auto;
}

.architecture-cards__title {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  // Заголовок сдвигается трансформом, а не отступом: трансформ не участвует
  // в раскладке и не влияет на переносы строк

  @include a.desktop-only {
    transform: translateX(calc(var(--architecture-mark-space, 12rem) * -1));

    transition: transform $card-motion;
  }

  @include a.mobile {
    @include t.body-l-medium;
  }

  // Переносы в локали — десктопные: в узкой колонке макета заголовок
  // в две строки, на планшете и мобильном он течёт сам

  :deep(br) {
    @include a.tablet {
      display: none;
    }
  }
}

// Колонку текста ведёт скрипт: её высота едет между короткой и полной,
// а строки за границей режутся. Прижата к верху, чтобы во время движения
// строки просто проявлялись снизу, а не прыгали к центру

.architecture-cards__content {
  align-self: start;
  overflow: hidden;
}

.architecture-cards__number {
  display: block;

  // По макету номер свёрнутой карточки едва виден, у раскрытой ярче

  color: var(--dark-blue-20);

  transition: color $card-motion;

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.architecture-cards__text {
  margin-top: 12px;

  color: var(--dark-blue-80);

  @include t.body-m-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}

// Продолжение на десктопе появляется только при наведении — до того, как
// скрипт возьмёт его в работу, оно спрятано стилями

.architecture-cards__text-more {
  @include a.desktop-only {
    display: none;
  }
}
</style>
