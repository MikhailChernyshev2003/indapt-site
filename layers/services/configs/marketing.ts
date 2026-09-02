import type { FigurePlacements, ServiceDescGroup, StickyFrames } from '@l-services/types';

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

/**
 * Кадр статичной картинки за раскрывающимися блоками: фрейм 8917:9031;
 * планшет — 8917:9440, мобильный — 8917:9732
 */
export const MARKETING_KV_FRAMES: StickyFrames = {
  desktop: { width: 556, height: 1265 },
  tablet: { width: 768, height: 1561 },
  mobile: { width: 375, height: 1154 },
};

/** На десктопе кадр целиком отрисован картинкой из макета */
export const MARKETING_KV_IMAGE: FigurePlacements = {
  desktop: { x: 0, y: 0, width: 556, height: 1265 },
  tablet: null,
};

/** На планшете и мобильном кадр собирается из растра цветка и засвета над ним */
export const MARKETING_KV_FLOWER: FigurePlacements = {
  desktop: null,
  tablet: { x: -779, y: 754.22, width: 1036.5, height: 885.9, rotate: -38.3 },
  mobile: { x: -576.13, y: 557.81, width: 766.6, height: 655.2, rotate: -38.3 },
};

export const MARKETING_KV_GLOW: FigurePlacements = {
  desktop: null,
  tablet: { x: 117.12, y: 1232.54, width: 744, height: 350.1, rotate: -68 },
  mobile: { x: 86.62, y: 911.57, width: 550.3, height: 259, rotate: -68 },
};
