import type {
  FigurePlacements,
  RingColors,
  ServiceDescGroup,
  StickyFrames,
} from '@l-services/types';

/** Теги услуги в порядке вывода, ключи из services.analyticsPlanning.tags */
export const ANALYTICS_PLANNING_TAGS = [
  'prototypeDevelopment',
  'qualitativeResearch',
  'quantitativeResearchData',
];

/** Абзацы вводного блока, ключи из services.analyticsPlanning */
export const ANALYTICS_PLANNING_INFO = [
  'infoFirstParagraph',
  'infoSecondParagraph',
  'infoThirdParagraph',
];

/** Пронумерованные группы с раскрывающимися блоками */
export const ANALYTICS_PLANNING_GROUPS: ServiceDescGroup[] = [
  {
    key: 'qualitativeResearch',
    collapses: ['collapseFirst', 'collapseSecond'],
  },
  {
    key: 'quantitativeResearchData',
    collapses: ['collapseFirst', 'collapseSecond', 'collapseThird'],
  },
  {
    key: 'advancedResearch',
    hasDesc: true,
    collapses: ['collapseFirst', 'collapseSecond', 'collapseThird', 'collapseFourth'],
  },
];

/** Цвета колец паттерна: оверрайд экземпляров «паттерн» в макете */
export const ANALYTICS_PLANNING_RING_COLORS: RingColors = ['#f77e01', '#ffbb33'];

/**
 * Скопления колец в полосе: экземпляры «паттерн 4/5» во фрейме img
 * 7563:14037; планшет — 7563:14211, мобильный — 7563:14386.
 * Координаты относительно полосы
 */
export const ANALYTICS_PLANNING_BAND: FigurePlacements[] = [
  {
    desktop: { x: -358.43, y: -576.9, width: 1382.9, rotate: 19 },
    tablet: { x: -675.43, y: -563.9, width: 1382.9, rotate: 19 },
    mobile: { x: -553.84, y: -326.69, width: 981, rotate: 19 },
  },
  {
    desktop: { x: 695.6, y: -413.83, width: 1382.9, rotate: 19 },
    tablet: { x: 370.6, y: -458.83, width: 1382.9, rotate: 19 },
    mobile: { x: 188.23, y: -252.15, width: 981, rotate: 19 },
  },
];

/**
 * Кадр статичной фигуры за аккордеонами: KV 7563:14034 (виден фрейм
 * 7563:14035), планшет — 7563:14291, мобильный — 7563:14420
 */
export const ANALYTICS_PLANNING_KV_FRAMES: StickyFrames = {
  desktop: { width: 457, height: 932 },
  tablet: { width: 771, height: 1144 },
  mobile: { width: 375, height: 887 },
};

/** Фигура внутри кадра: экземпляр «паттерн 4» относительно кадра */
export const ANALYTICS_PLANNING_KV: FigurePlacements = {
  desktop: { x: -632.87, y: -162, width: 1382.9, rotate: 11.9 },
  tablet: { x: -838.87, y: -20, width: 1382.9, rotate: 11.9 },
  mobile: { x: -559.84, y: -19.69, width: 981, rotate: 19 },
};
