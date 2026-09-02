import type { FigurePlacements, RingColors } from '@l-services/types';

/** Теги услуги в порядке вывода, ключи из services.machineLearning.tags */
export const MACHINE_LEARNING_TAGS = [
  'computerVision',
  'chatbots',
  'recommendationSystems',
  'dataAnalyticsBI',
];

export const MACHINE_LEARNING_INFO = ['info'];

/** Карточки блока «Решаем бизнес-задачи с помощью ИИ» */
export const MACHINE_LEARNING_CHALLENGES = [
  'fullCycleMLDevelopment',
  'opsAutomation',
  'bigDataProcessing',
  'continuousLearning',
];

/**
 * Пункты блока «Ключевые решения и продукты».
 * Здесь только тексты без подписей — плоские строки в локали.
 */
export const MACHINE_LEARNING_SOLUTIONS = [
  'textOne',
  'textTwo',
  'textThree',
  'textFour',
];

/** Цвета колец звезды: оверрайд экземпляра «паттерн 6» в макете */
export const MACHINE_LEARNING_RING_COLORS: RingColors = ['#d80024', 'rgb(216 0 36 / 30%)'];

/**
 * Звезда за карточками: KV 8752:8502; планшет — 8792:8608, мобильный —
 * 8792:9015. Координаты относительно секции карточек во всю ширину экрана
 */
export const MACHINE_LEARNING_STAR: FigurePlacements = {
  desktop: { x: 207.5, y: -411.4, width: 1247.9, rotate: 28.2 },
  tablet: { x: 381.5, y: -461.4, width: 1247.9, rotate: 28.2 },
  mobile: { x: -83, y: -100.5, width: 954, rotate: -10.2 },
};
