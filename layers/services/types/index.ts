export interface ServiceItem {
  /** Часть пути страницы услуги и ключ иллюстрации */
  slug: string;
  /** Ключ перевода названия внутри services.services */
  labelKey: string;
  /** Иллюстрация карточки */
  image: string;
  /** Цвет заголовка карточки при наведении */
  color: string;
  /** Фон карточки при наведении */
  bg: string;
  /**
   * Страница услуги свёрстана.
   * Пока false, карточка ведёт на заглушку /in-progress.
   */
  ready?: boolean;
}

export interface ServiceDescGroup {
  /** Ключ группы внутри services.<услуга>.descServices */
  key: string;
  /** У группы есть вводный абзац desc */
  hasDesc?: boolean;
  /** Ключи раскрывающихся блоков в порядке вывода */
  collapses: string[];
}

export interface ServiceFeatureItem {
  /** Заголовок блока */
  title: string;
  /** Текст блока, может содержать разметку */
  text: string;
}

/** Кегль заголовка секции: на мобильном оба варианта сводятся к одному */
export type SectionHeadSize = 'h1' | 'h2';

/** Координаты карточки [x, y] в px от левого верхнего угла секции */
// Координаты страницы объявляют через `as const`, чтобы не расползались
// по длине, поэтому кортежи здесь readonly

export type ScatterCardPoint = readonly [number, number];

export interface ScatterCardPositions {
  /** Координаты карточек, индексы совпадают с items */
  desktop: readonly ScatterCardPoint[];
  tablet: readonly ScatterCardPoint[];
}

export interface NumberedLineItem {
  /** Подпись пункта */
  label?: string;
  /** Текст под подписью */
  text?: string;
}

export interface ArchitectureCardItem {
  /** Заголовок карточки */
  title: string;
  /** Начало текста, видно в свёрнутой карточке */
  shortText: string;
  /** Продолжение текста, на десктопе появляется при наведении */
  text: string;
}

export interface MethodTabItem {
  /** Подпись переключателя */
  label: string;
  /** Текст активного переключателя */
  text: string;
  /** Иллюстрация активного переключателя */
  image: string;
  /** Иллюстрация для планшета, по умолчанию десктопная */
  imageTablet?: string;
  /** Иллюстрация для мобильного, по умолчанию десктопная */
  imageMobile?: string;
}

export interface TimelineStepItem {
  /** Заголовок пункта */
  title: string;
  /** Текст пункта, может содержать разметку */
  text: string;
}

export interface TechSlideItem {
  /** Подпись под картинкой */
  label: string;
  /** Текст под подписью, может содержать разметку */
  text: string;
  /** Картинка слайда; пустая строка — слайд выводится без картинки */
  image: string;
  /** Размеры файла картинки: держат место до её загрузки */
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * Имена ключей в локали для блока с раскрывающимися пунктами.
 * У разных услуг они отличаются, поэтому задаются снаружи.
 */
export interface ServiceDescPaths {
  /** Ключ, внутри которого лежат группы */
  root?: string;
  /** Ключ вводного абзаца группы */
  desc?: string;
  /** Ключ подписи раскрывающегося пункта */
  collapseLabel?: string;
  /** Ключ текста раскрывающегося пункта */
  collapseText?: string;
}

/** Фигуры паттернов макета: те же кольца, что у морфинга на главной */
export type RingShape = 'hexagon' | 'star' | 'circle';

/** Цвета градиента колец: начало и конец, любой CSS-цвет */
export type RingColors = readonly [string, string];

/**
 * Размещение фигуры по макету на одном брейкпоинте: левый верхний угол
 * экземпляра до поворота, его размер и угол поворота — так, как они лежат
 * в матрице ноды Figma (положительный угол — по часовой, как в CSS rotate).
 * Координаты в px по макету относительно контейнера фигуры
 */
export interface FigurePlacement {
  x: number;
  y: number;
  width: number;
  /** Без высоты её задаёт содержимое: у svg и картинок — пропорция */
  height?: number;
  rotate?: number;
}

/**
 * Размещение по брейкпоинтам. Планшет по умолчанию повторяет десктоп,
 * мобильный — планшет; null прячет фигуру на брейкпоинте
 */
export interface FigurePlacements {
  desktop: FigurePlacement | null;
  tablet?: FigurePlacement | null;
  mobile?: FigurePlacement | null;
}

/** Кадр статичной картинки внутри прокручиваемого блока, px по макету */
export interface StickyFrame {
  width: number;
  height: number;
  /** Смещение кадра от левого края экрана */
  left?: number;
  /** Смещение кадра от верха блока в покое, пока он не «прилип» */
  top?: number;
}

/** Кадры по брейкпоинтам: незаданный повторяет предыдущий, как у фигур */
export interface StickyFrames {
  desktop: StickyFrame;
  tablet?: StickyFrame;
  mobile?: StickyFrame;
}
