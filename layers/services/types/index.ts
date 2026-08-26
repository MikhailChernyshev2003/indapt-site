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

/** Фигуры из общих данных src/data/shapes, которые встречаются в макетах услуг */
export type ServiceDecorShape = 'circle' | 'triangle' | 'star' | 'flower';

export interface ServiceDecorLayer {
  /** Контур слоя в системе координат 174×174 */
  path: string;
  /** Прозрачность слоя из данных фигуры */
  opacity: number;
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
export type ScatterCardPoint = [number, number];

export interface ScatterCardPositions {
  /** Координаты карточек, индексы совпадают с items */
  desktop: ScatterCardPoint[];
  tablet: ScatterCardPoint[];
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
