import type { MediaSlot, ServiceGroup } from '@l-ai-production/types';

/** Цвета сферы главной (useParticleSphere): передняя и задняя полусферы, верх и низ */
export const SPHERE_COLORS = {
  frontTop: '#0236EB',
  frontBottom: '#07DBFC',
  backTop: '#4096FA',
  backBottom: '#43F2D5',
} as const;

/** Тёмный фон «видео-момента» и цикла */
export const DARK_BG = '#050C2E';
export const LIGHT_BG = '#F4F7FF';

/**
 * Медиа, которые рождает сфера. Первая плоскость — главная: в сцене «Движение»
 * камера влетает в неё. Чтобы показать настоящий ролик, достаточно поменять
 * kind на 'video' и указать src (файл в src/public)
 */
export const MEDIA_SLOTS: MediaSlot[] = [
  {
    kind: 'fluid', aspect: 16 / 9, palette: 0,
    desktop: { x: 0.55, y: 0.05, z: 0.6, w: 1.9 },
    mobile: { x: 0, y: 0.6, z: 0.6, w: 1.1 },
  },
  {
    kind: 'image', aspect: 1, src: '/images/services/design/hero.webp',
    desktop: { x: -0.35, y: 1.25, z: -0.8, w: 1.05 },
    mobile: { x: -0.5, y: 1.45, z: -0.4, w: 0.6 },
  },
  {
    kind: 'rings', aspect: 4 / 5, palette: 0,
    desktop: { x: 2.75, y: 1.1, z: -0.5, w: 1.0 },
    mobile: { x: 0.5, y: 1.4, z: -0.6, w: 0.5 },
  },
  {
    kind: 'orb', aspect: 16 / 10, palette: 0,
    desktop: { x: 2.55, y: -1.15, z: 0.1, w: 1.25 },
    mobile: { x: -0.55, y: 0.0, z: -1.2, w: 0.6 },
  },
  {
    kind: 'waves', aspect: 9 / 16, palette: 1,
    desktop: { x: 1.15, y: -1.35, z: -0.9, w: 0.7 },
    mobile: { x: 0.6, y: -0.05, z: -0.8, w: 0.4 },
  },
  {
    kind: 'dots', aspect: 1, palette: 0,
    desktop: { x: 3.9, y: 0.05, z: -1.8, w: 0.85 },
    mobile: null,
  },
  {
    kind: 'image', aspect: 4 / 3, src: '/images/services/design/method-1.webp',
    desktop: { x: 1.35, y: 1.6, z: -1.9, w: 1.0 },
    mobile: { x: 0.05, y: 2.0, z: -1.8, w: 0.7 },
  },
  {
    kind: 'fluid', aspect: 9 / 16, palette: 2,
    desktop: { x: -0.6, y: -1.45, z: -2.2, w: 0.75 },
    mobile: null,
  },
  {
    kind: 'orb', aspect: 1, palette: 1,
    desktop: { x: 4.3, y: 1.6, z: -3.2, w: 0.85 },
    mobile: null,
  },
  {
    kind: 'rings', aspect: 16 / 9, palette: 1,
    desktop: { x: 3.6, y: -1.85, z: -2.6, w: 1.2 },
    mobile: null,
  },
];

/** Этапы полного цикла: ключи в aiProduction.cycle.stages */
export const CYCLE_STAGES = [
  'strategy',
  'script',
  'generation',
  'post',
  'sound',
  'adaptation',
  'distribution',
] as const;

/** Каталог услуг «под ключ»: ключи в aiProduction.services */
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    key: 'visual',
    shape: 'hexagon',
    items: ['photo', 'kv', 'creatives', 'illustration', 'product', 'marketplace', 'brandbook'],
  },
  {
    key: 'video',
    shape: 'star',
    items: ['ads', 'image', 'clips', 'reels', 'animation', 'vfx', 'explainer'],
  },
  {
    key: 'motion',
    shape: 'circle',
    items: ['render', 'motion', 'logo', 'interfaces', 'ar'],
  },
  {
    key: 'voice',
    shape: 'hexagon',
    items: ['avatars', 'voiceover', 'clone', 'dubbing', 'music', 'podcasts'],
  },
  {
    key: 'marketing',
    shape: 'star',
    items: ['strategy', 'plan', 'smm', 'copy', 'localization', 'seeding'],
  },
  {
    key: 'tech',
    shape: 'circle',
    items: ['lora', 'pipelines', 'agents', 'bots', 'education', 'consulting'],
  },
];

/** Показатели блока цифр: ключи в aiProduction.numbers.items */
export const NUMBERS = ['speed', 'budget', 'formats', 'cycle'] as const;
