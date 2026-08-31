<script setup lang="ts">
import type { ArchitectureCardItem } from '@l-services/types';

const { items, mark } = defineProps<{
  /** Карточки в порядке вывода */
  items: ArchitectureCardItem[];
  /** Ромб, выезжающий у наведённой карточки; без пропа карточка остаётся без него */
  mark?: string;
}>();

const { isDesktop } = useDevice();

const hoveredIdx = ref(-1);

const cardsRef = useTemplateRef<HTMLElement[]>('cardsRef');

// Наведение считаем от позиции курсора, а не от mouseenter/mouseleave на
// карточках. Раскрытая карточка сдвигает соседние, и под неподвижным курсором
// меняется то, что под ним лежит: браузер шлёт leave и enter, состояние
// переключается, карточки едут обратно — и так по кругу
let lastX = -1;
let lastY = -1;

// Событие с теми же координатами браузер присылает сам, когда вёрстка уехала
// из-под неподвижного указателя — после скролла и по ходу перехода высоты.
// Реагировать на него нельзя: это тот же источник качелей, ради которого
// отказались от mouseenter/mouseleave, просто по другому каналу
const isStale = (event: PointerEvent) =>
  event.clientX === lastX && event.clientY === lastY;

const hitIndex = (event: PointerEvent) => {
  const cards = cardsRef.value;

  if (!cards?.length) return -1;

  // Один хит-тест вместо обхода прямоугольников всех карточек: перебор
  // заставлял браузер пересчитывать раскладку на каждое движение мыши,
  // причём поверх высот, записанных в предыдущем кадре
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

// Карточка, с которой курсор только что ушёл, держит полный текст, пока едет
// вниз. Если подменить его сразу, строки исчезнут за один кадр и дальше
// схлопываться будет пустая коробка; так текст просто уходит под границу
const collapsingIdx = ref(-1);

/** Полный текст — у наведённой карточки и у той, что ещё схлопывается */
const isTextFull = (idx: number) => isExpanded(idx) || collapsingIdx.value === idx;

// Текст подменяется целиком, поэтому натуральная высота карточки меняется
// скачком, а соседние карточки прыгают следом. Единственное, чего не умеет
// браузер, — анимировать height: auto, поэтому руками фиксируем текущую высоту
// до перерисовки и ставим целевую после. Дальше карточку ведёт обычный
// CSS-переход, тот же самый, что фон, заголовок и ромб: одна кривая, одна
// длительность, один момент старта и одинаковое поведение при перехвате
const syncHeights = async (prevIdx: number) => {
  const cards = cardsRef.value;

  if (!cards?.length) return;

  // На время замера уезжающая карточка возвращается к короткому тексту:
  // целевую высоту берём от конечного состояния, а не от того, что видно
  collapsingIdx.value = -1;

  // Стартуем от того, что видно сейчас: если предыдущий переход не доиграл,
  // это его промежуточная высота, и карточка не дёрнется. Дробная величина,
  // а не offsetHeight: округление до целого само по себе давало полпикселя
  // сдвига на старте и столько же на снятии инлайновой высоты
  const before = cards.map(card => card.getBoundingClientRect().height);

  await nextTick();

  // Дальше проходы без чередования чтений и записей: запись на одной карточке
  // обесценивает замер на следующей, и браузер пересчитывает раскладку по разу
  // на карточку вместо одного раза на всю секцию
  cards.forEach((card) => {
    card.style.height = '';
  });

  const natural = cards.map(card => card.getBoundingClientRect().height);

  const moving: [HTMLElement, number][] = [];

  cards.forEach((card, idx) => {
    // Меньше половины пикселя — двигать нечего, а инлайновая высота мешала бы
    // карточке подстроиться под ресайз
    if (Math.abs(natural[idx] - before[idx]) < 0.5) return;

    card.style.height = `${before[idx]}px`;
    moving.push([card, natural[idx]]);
  });

  if (!moving.length) return;

  // Браузер должен увидеть стартовую высоту отдельным состоянием: иначе
  // началом перехода останется height: auto, а из auto переход не запускается
  // вовсе — высота встала бы скачком
  void cards[0].offsetHeight;

  moving.forEach(([card, height]) => {
    card.style.height = `${height}px`;
  });

  // Полный текст возвращаем уезжающей карточке уже после старта перехода —
  // в том же кадре, поэтому короткий вариант не успевает отрисоваться.
  // Только если она действительно едет: без перехода полный текст просто
  // раскрыл бы её обратно
  const isCollapsing = prevIdx !== -1
    && prevIdx !== hoveredIdx.value
    && moving.some(([card]) => card === cards[prevIdx]);

  if (isCollapsing) collapsingIdx.value = prevIdx;
};

const resetHeights = () => {
  cardsRef.value?.forEach((card) => {
    card.style.height = '';
  });
};

// isDesktop в зависимостях, потому что за брейкпоинтом раскрываются сразу все
// карточки: без этого на планшете оставались бы инлайновые высоты от десктопа
watch([hoveredIdx, isDesktop], ([, desktop], [prevIdx, prevDesktop]) => {
  // Смена брейкпоинта — не жест пользователя: карточки просто перестраиваются,
  // анимировать тут нечего. Это же состояние приходит и после гидратации,
  // когда угаданный на сервере брейкпоинт разошёлся с реальной шириной
  if (desktop !== prevDesktop) {
    collapsingIdx.value = -1;
    resetHeights();

    if (!desktop) hoveredIdx.value = -1;

    return;
  }

  if (!desktop) return;

  syncHeights(prevIdx);
});

// Инлайновую высоту снимаем после перехода: дальше карточка должна
// подстраиваться под контент и ресайз сама. Прерванный переход перепишет
// следующий запуск syncHeights
const handleTransitionEnd = (event: TransitionEvent) => {
  if (event.propertyName !== 'height' || event.target !== event.currentTarget) return;

  const card = event.currentTarget as HTMLElement;

  // Сначала короткий текст, и только следующим кадром — снятие высоты: иначе
  // карточка на кадр раскрылась бы обратно под всё ещё полный текст
  if (collapsingIdx.value === cardsRef.value?.indexOf(card)) collapsingIdx.value = -1;

  nextTick(() => {
    card.style.height = '';
  });
};

// Продолжение склеивается с началом в один абзац: в русской локали text
// продолжает предложение и начинается со знака препинания («. По результатам…»),
// в английской это самостоятельное предложение. Пробел ставим только во втором
// случае, иначе перед точкой появился бы отбив
const cardText = (item: ArchitectureCardItem, idx: number) => {
  if (!isTextFull(idx)) return item.shortText;

  const separator = /^[A-Za-zА-Яа-яЁё]/.test(item.text) ? ' ' : '';

  return `${item.shortText}${separator}${item.text}`;
};
</script>

<template>
  <section
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
      @transitionend="handleTransitionEnd"
    >
      <div class="architecture-cards__head">
        <!-- По макету при наведении слева от заголовка появляется ромб.
             Он вынут из потока: в потоке его размер участвовал бы в высоте
             карточки, а меняется он CSS-переходом — замер высоты попадал бы
             на промежуточное значение -->
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
        <p class="architecture-cards__text" v-html="cardText(item, idx)" />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/shared" as s;
@use "@styles/typography" as t;

.architecture-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @include s.base-container;
}

.architecture-cards__card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 32px;
  overflow: hidden;

  background-color: var(--architecture-card-bg, var(--white));
  border-radius: 16px;

  @include s.default-transition(background-color);

  // Высоту ведёт тот же переход, что фон, заголовок и ромб: одна кривая, одна
  // длительность, один старт — и при перехвате на середине все свойства
  // перезапускаются одинаково. Только на десктопе: за брейкпоинтом инлайновая
  // высота не ставится, анимировать нечего

  @include a.desktop-only {
    @include s.default-transition(background-color, height);
  }

  @include a.tablet {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @include a.mobile {
    gap: 16px;
    padding: 16px;
  }

  &_expanded {
    // Подсветка идёт от того же состояния, что и раскрытие. На нативном :hover
    // это были два источника истины: в зазоре между карточками фон уже гас, а
    // карточка ещё оставалась раскрытой, и движение разваливалось на два такта.
    // mouse-only остаётся от прежнего :hover — на тач-экране шириной с десктоп
    // подсвечивать нечего

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
  }
}

.architecture-cards__head {
  position: relative;

  display: flex;
  align-items: center;

  // Место под ромб держим всегда. Пока отступ появлялся вместе с раскрытием,
  // ширина заголовка менялась переходом: заголовок мог переноситься по строкам
  // уже после того, как снят замер высоты. Это тот же дефект, из-за которого
  // ромб вынесли из потока, просто через другое свойство

  @include a.desktop-only {
    padding-left: var(--architecture-mark-space, 7.875rem); // 110 + 16
  }
}

// Ромб лежит поверх, вне потока: так его размер не попадает в высоту карточки,
// а значит и в замер, по которому едет переход высоты

.architecture-cards__mark {
  position: absolute;
  top: 50%;
  left: 0;

  width: var(--architecture-mark-size, 6.875rem); // 110px

  transform: translateY(-50%) scale(0.6);

  opacity: 0;

  @include s.default-transition(opacity, transform);

  @include a.tablet {
    display: none;
  }
}

.architecture-cards__mark-image {
  display: block;
  width: var(--architecture-mark-size, 6.875rem); // 110px
  height: auto;
}

.architecture-cards__title {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  // Заголовок сдвигается трансформом, а не отступом: трансформ не участвует
  // в раскладке, поэтому не влияет ни на перенос строк, ни на замер высоты

  @include a.desktop-only {
    transform: translateX(calc(var(--architecture-mark-space, 7.875rem) * -1));

    @include s.default-transition(transform);
  }

  @include a.mobile {
    @include t.body-l-medium;
  }
}

// Пока высота карточки едет переходом, она не равна натуральной. При
// центрировании контент прыгнул бы на половину разницы в первом же кадре
// и весь переход возвращался обратно. Прижимаем колонку к верху: в покое это
// ничего не меняет — она и так самая высокая, — а во время перехода строки
// просто проявляются снизу, под растущей границей

.architecture-cards__content {
  align-self: start;
}

.architecture-cards__number {
  display: block;

  color: var(--dark-blue-50);

  @include t.caption-m-medium;

  @include a.mobile {
    @include t.caption-xs-medium;
  }
}

.architecture-cards__text {
  margin-top: 12px;

  color: var(--dark-blue);

  @include t.body-m-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}
</style>
