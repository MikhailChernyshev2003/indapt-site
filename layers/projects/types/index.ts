/** Ключ категории кейса — совпадает с ключами локали projects.tabs */
export type ProjectTabKey
  = | 'all'
    | 'industry'
    | 'transport'
    | 'trade'
    | 'fintech'
    | 'science'
    | 'health';

/** Кейс раздела «Проекты» */
export interface ProjectCaseItem {
  /** Слаг страницы кейса: /projects/<slug> */
  slug: string;
  /** Ключ кейса в локали внутри projects */
  i18nKey: string;
  /** Категория кейса для фильтра разводящей */
  tab: Exclude<ProjectTabKey, 'all'>;
  /** Логотип клиента */
  logo: string;
  /** Размер логотипа в карточке разводящей по макету, px */
  logoSize: [number, number];
  /** Размер логотипа в мини-карточке «Другие кейсы» по макету, px */
  logoSizeSmall: [number, number];
  /** Акцентный цвет кейса: жалюзи и градиенты */
  accent: string;
  /** Фон карточки кейса в слайдере «Другие кейсы» */
  cardBg: string;
  /** Градиент рамки логотипа в мини-карточке */
  logoStroke: [string, string];
  /** Цвет колец сцены технологий */
  techColor: string;
  /** Цвет жалюзи и градиента шапки кейса */
  heroColor: string;
}

/** Пузырь технологии на странице кейса */
export interface ProjectTechBubble {
  /** Название технологии */
  label: string;
  /** Диаметр по макету, px */
  size: number;
  /** Позиция левого верхнего угла на сцене 1320x487 по макету */
  x: number;
  y: number;
  /** Логотип, который показывается по ховеру (если есть) */
  logo?: string;
}

/** Кольцо-декор на сцене технологий */
export interface ProjectTechRing {
  /** Диаметр по макету, px */
  size: number;
  /** Позиция на сцене по макету */
  x: number;
  y: number;
}
