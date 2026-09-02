import type { FigurePlacements, ScatterCardPositions } from '@l-services/types';

/** Теги услуги в порядке вывода, ключи из services.development.tags */
export const DEVELOPMENT_TAGS = ['tag_1', 'tag_2', 'tag_3', 'tag_4'];

/** Карточки, разложенные внахлёст поверх декоративной фигуры */
export const DEVELOPMENT_CARDS = ['block_1', 'block_2', 'block_3'];

/** Пункты таймлайна */
export const DEVELOPMENT_STEPS = [
  'block_1',
  'block_2',
  'block_3',
  'block_4',
  'block_5',
];

/** Координаты карточек относительно сцены по макету: они лежат внахлёст */
export const DEVELOPMENT_CARD_POSITIONS: ScatterCardPositions = {
  desktop: [[0, 0], [779, 100], [111, 360]],
  tablet: [[0, 0], [147, 320], [74, 616]],
};

/**
 * Треугольник за карточками: растр из KV 7563:16598 относительно сцены;
 * планшет — 7563:16751. На мобильном фрейм перевёрнут (7563:16886), а его
 * положение снято с актуального экспорта макета: в файле от июня он лежал
 * выше карточек, поверх заголовка
 */
export const DEVELOPMENT_CARDS_FIGURE: FigurePlacements = {
  desktop: { x: 375.74, y: -46, width: 673, height: 590, rotate: 8 },
  tablet: { x: 59.74, y: 79, width: 673, height: 590, rotate: 8 },
  mobile: { x: 625.6, y: 693.7, width: 673, height: 590, rotate: 188 },
};

/**
 * Он же за шагами: KV 7563:16654 относительно блока с заголовком во всю
 * ширину экрана; планшет — 7563:16763, на мобильном фигуры нет
 */
export const DEVELOPMENT_STEPS_FIGURE: FigurePlacements = {
  desktop: { x: 539.43, y: 650.22, width: 1083.5, height: 950, rotate: -42 },
  tablet: { x: 585.21, y: 876.01, width: 650.6, height: 570.4, rotate: -103.1 },
  mobile: null,
};
