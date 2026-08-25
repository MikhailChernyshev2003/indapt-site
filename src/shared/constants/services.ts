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
