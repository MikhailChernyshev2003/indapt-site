/** Same order as header «Экспертиза» and expertise tabs */
export const EXPERTISE_NAV_HREFS = [
  '/expertise',
  '/expertise?tab=transport',
  '/expertise?tab=trade',
  '/expertise?tab=fintech',
  '/expertise?tab=science',
  '/expertise?tab=health',
] as const;

export const EXPERTISE_NAV_I18N_KEYS = [
  'header.prom',
  'header.transport',
  'header.trade',
  'header.fintech',
  'header.science',
  'header.health',
] as const;

/**
 * Подменю «Услуги» в шапке. Порядок взят из макета меню и отличается
 * от порядка реестра услуг: поддержка стоит последней. В меню подменю
 * делится пополам на две колонки, поэтому важны и порядок, и число пунктов
 */
export const SERVICES_NAV_LINKS = [
  { href: '/services/analytics-planning', i18nKey: 'header.analytics' },
  { href: '/services/engineering', i18nKey: 'header.engineering' },
  { href: '/services/machine-learning', i18nKey: 'header.ml' },
  { href: '/services/design', i18nKey: 'header.design' },
  { href: '/services/development', i18nKey: 'header.development' },
  { href: '/services/marketing', i18nKey: 'header.marketing' },
  { href: '/services/web3', i18nKey: 'header.web' },
  { href: '/services/support', i18nKey: 'header.support' },
] as const;
