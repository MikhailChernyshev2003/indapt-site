/**
 * Чем наполнена медиа-плоскость:
 * fluid — жидкий градиент, rings — расходящиеся фирменные шестиугольники,
 * orb — «3D-рендер» шара, waves — звуковая волна, dots — пульсирующая матрица,
 * image — картинка (src), video — ролик (src, mp4/webm)
 */
export type MediaKind = 'fluid' | 'rings' | 'orb' | 'waves' | 'dots' | 'image' | 'video';

/** Положение плоскости на орбите вокруг сферы, в мировых единицах */
export interface MediaPlacement {
  x: number;
  y: number;
  z: number;
  /** Ширина плоскости; высота — по aspect */
  w: number;
}

export interface MediaSlot {
  kind: MediaKind;
  /** Ширина к высоте */
  aspect: number;
  src?: string;
  /** Вариант палитры процедурного ролика */
  palette?: 0 | 1 | 2;
  desktop: MediaPlacement;
  /** null — на телефоне плоскости нет */
  mobile: MediaPlacement | null;
}

export interface ServiceGroup {
  /** Ключ в aiProduction.services.groups */
  key: string;
  /** Ключи услуг внутри группы */
  items: string[];
  shape: 'hexagon' | 'star' | 'circle';
}
