import type { ServiceDescGroup } from '@l-services/types';

/** Теги услуги в порядке вывода, ключи из services.marketing.tags */
export const MARKETING_TAGS = [
  'tag_1',
  'tag_2',
  'tag_3',
  'tag_4',
  'tag_5',
  'tag_6',
];

/** Вводный блок разбит на два абзаца внутри ключа info */
export const MARKETING_INFO = ['info.paragraph_1', 'info.paragraph_2'];

/** Вкладки блока «Креативные решения» */
export const MARKETING_TABS = ['tab_1', 'tab_2', 'tab_3', 'tab_4'];

/**
 * Группы с раскрывающимися блоками.
 * Число блоков в группах разное, поэтому ключи перечислены явно.
 */
export const MARKETING_FEATURES: ServiceDescGroup[] = [
  {
    key: 'feature_1',
    hasDesc: true,
    collapses: ['collapse_1', 'collapse_2', 'collapse_3', 'collapse_4', 'collapse_5'],
  },
  {
    key: 'feature_2',
    hasDesc: true,
    collapses: ['collapse_1', 'collapse_2', 'collapse_3'],
  },
  {
    key: 'feature_3',
    hasDesc: true,
    collapses: ['collapse_1', 'collapse_2', 'collapse_3', 'collapse_4'],
  },
];

/** Пункты блока «Создаём» */
export const MARKETING_CREATE = ['item_1', 'item_2', 'item_3', 'item_4'];
