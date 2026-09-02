import type { FigurePlacements } from '@l-services/types';

/** Теги услуги в порядке вывода, ключи из services.design.tags */
export const DESIGN_TAGS = [
  'visualConcept',
  'designSystem',
  'mobileApps',
  'screenScaling',
  'interfaceAnimation',
  'handoff',
  'methodologicalApproach',
];

/** У этой услуги вводный блок разбит на два отдельных ключа верхнего уровня */
export const DESIGN_INFO = ['infoFirstParagraph', 'infoSecondParagraph'];

/** Блоки списка возможностей */
export const DESIGN_FEATURES = [
  'visualConceptDevelopment',
  'desSystem',
  'mobileApps',
  'screenScaling',
  'interfaceAnimation',
  'handoff',
];

/** Методологии: вкладки блока «Методологический подход» */
export const DESIGN_METHODS = ['cjm', 'custDev', 'designThinking', 'jtbd'];

/**
 * Полоса в макете дизайна нарисована растром: положения его копий из фрейма
 * img 7563:15062; планшет — 7563:16175, мобильный — 7563:16395.
 * Координаты относительно полосы
 */
export const DESIGN_BAND: FigurePlacements[] = [
  {
    desktop: { x: -271.58, y: -642, width: 1142, height: 1091.1, rotate: 18.7 },
    tablet: { x: -590.58, y: -636, width: 1142, height: 1091.1, rotate: 18.7 },
    mobile: { x: -430.06, y: -354, width: 735.2, height: 702.4, rotate: 18.7 },
  },
  {
    desktop: { x: 881.42, y: -366, width: 1142, height: 1091.1, rotate: 18.7 },
    tablet: { x: 525.42, y: -351, width: 1142, height: 1091.1, rotate: 18.7 },
    mobile: { x: 270.94, y: -158, width: 735.2, height: 702.4, rotate: 18.7 },
  },
];
