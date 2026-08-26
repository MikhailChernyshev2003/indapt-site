import type { ServiceDescGroup } from '@l-services/types';

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
