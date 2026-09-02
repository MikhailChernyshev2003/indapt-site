import type { FigurePlacements, RingColors } from '@l-services/types';

/** Теги услуги в порядке вывода, ключи из services.web3.tags */
export const WEB3_TAGS = ['tag_1', 'tag_2', 'tag_3', 'tag_4', 'tag_5'];

export const WEB3_INFO = ['info'];

/** Блоки списка возможностей */
export const WEB3_FEATURES = ['feature_1', 'feature_2', 'feature_3', 'feature_4'];

/** Пункты блока «Создаём» */
export const WEB3_CREATE = [
  'item_1',
  'item_2',
  'item_3',
  'item_4',
  'item_5',
];

/** Слайды блока «Технологии» */
export const WEB3_SLIDES = ['slide_1', 'slide_2', 'slide_3', 'slide_4'];

/** Цвета колец паттерна: оверрайд экземпляров «паттерн» в макете */
export const WEB3_RING_COLORS: RingColors = ['#71f21a', '#55d300'];

/**
 * Скопления колец в полосе: экземпляры «паттерн 6/5» во фрейме img
 * 7563:18427; планшет — 7563:18655, мобильный — 7563:18858.
 * Координаты относительно полосы
 */
export const WEB3_BAND: FigurePlacements[] = [
  {
    desktop: { x: -615, y: -97.33, width: 1393.9, rotate: -5.8 },
    tablet: { x: -904, y: -87.09, width: 1393.9, rotate: -5.8 },
    mobile: { x: 0, y: -219.66, width: 848, rotate: -5.8 },
  },
  {
    desktop: { x: 449, y: -407.33, width: 1393.9, rotate: -5.8 },
    tablet: { x: 102, y: -394.09, width: 1393.9, rotate: -5.8 },
    mobile: { x: -570, y: 35.34, width: 848, rotate: -5.8 },
  },
];

/**
 * Паттерн за блоком «Что мы создаём»: BG 7563:18459; планшет — 7563:18687,
 * мобильный — 7563:18890. Координаты относительно блока во всю ширину экрана
 */
export const WEB3_CREATE_PATTERN: FigurePlacements = {
  desktop: { x: 655.2, y: 75.53, width: 1051, rotate: -15.2 },
  tablet: { x: 135.2, y: 239.53, width: 1051, rotate: -15.2 },
  mobile: { x: -97, y: 374.53, width: 1051, rotate: -15.2 },
};

/** Белые засветы поверх паттерна: размытые эллипсы из тех же фреймов */
export const WEB3_CREATE_GLOWS: FigurePlacements[] = [
  {
    desktop: { x: 826, y: 380, width: 743, height: 371 },
    tablet: { x: 336, y: 649, width: 743, height: 371 },
    mobile: null,
  },
  {
    desktop: null,
    tablet: { x: 135, y: 1016.47, width: 921.8, height: 371, rotate: -88.4 },
    mobile: { x: 102, y: 897.48, width: 681.1, height: 274.1, rotate: -88.4 },
  },
];
