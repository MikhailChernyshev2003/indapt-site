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
