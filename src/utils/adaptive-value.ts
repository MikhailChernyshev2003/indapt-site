/**
 * Возвращает значение в зависимости от типа устройства.
 * @template T - Тип возвращаемого значения.
 * @param {Object} params - Значения для разных устройств.
 * @param {T} params.d - Значение для десктопа (обязательное).
 * @param {T} [params.t] - Значение для планшета (по умолчанию = desktop).
 * @param {T} [params.m] - Значение для мобильного (по умолчанию = tablet).
 * @returns {T} Значение для текущего устройства.
 */
export function adaptiveValue<T = any>(
  {
    d: desktop,
    t: tablet = desktop,
    m: mobile = tablet,
  }: {
    d: T;
    t?: T;
    m?: T;
  },
): T {
  const { isMobile, isTablet } = useDevice();

  if (isMobile.value) return mobile;
  if (isTablet.value) return tablet;
  return desktop;
}
