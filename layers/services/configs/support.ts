import type { FigurePlacements, RingColors, ScatterCardPositions } from '@l-services/types';

/** Теги услуги в порядке вывода, ключи из services.support.tags */
export const SUPPORT_TAGS = ['tag_1', 'tag_2', 'tag_3', 'tag_4'];

/** Карточки, разложенные внахлёст поверх декоративной фигуры */
export const SUPPORT_CARDS = ['block_1', 'block_2', 'block_3'];

/** Цвета колец: градиент эллипсов макета */
export const SUPPORT_RING_COLORS: RingColors = ['#88ffd9', '#03bce5'];

/** Координаты карточек относительно сцены по макету: они лежат внахлёст */
export const SUPPORT_CARD_POSITIONS: ScatterCardPositions = {
  desktop: [[0, 0], [779, 100], [111, 360]],
  tablet: [[0, 0], [147, 320], [74, 616]],
};

/**
 * Круги за карточками: KV 7563:17041 относительно сцены;
 * планшет — 7563:17162, мобильный — 7563:17275
 */
export const SUPPORT_CARDS_FIGURE: FigurePlacements = {
  desktop: { x: 364.96, y: -15.04, width: 589.7 },
  tablet: { x: 48.96, y: 109.96, width: 589.7 },
  mobile: { x: -265.04, y: -1.04, width: 589.7 },
};
