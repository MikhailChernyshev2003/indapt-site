import type { ServiceItem } from '@l-services/types';

/** Заглушка для услуг, страницы которых ещё не свёрстаны */
export const SERVICE_FALLBACK_HREF = '/in-progress';

/**
 * Реестр услуг. Порядок совпадает с макетом и с ключами services.services.
 * Чтобы подключить новую страницу услуги, достаточно поставить ready: true
 * и добавить файл pages/services/<slug>.vue.
 */
export const SERVICES: ServiceItem[] = [
  {
    slug: 'analytics-planning',
    labelKey: 'analyticsPlanning',
    image: '/images/main/services/analytics-planning.png',
    color: '#DF7201',
    bg: '#F4EBE5',
    ready: true,
  },
  {
    slug: 'engineering',
    labelKey: 'engineering',
    image: '/images/main/services/engineering.png',
    color: '#3E3E3E',
    bg: '#E1E4EB',
    ready: true,
  },
  {
    slug: 'machine-learning',
    labelKey: 'machineLearning',
    image: '/images/main/services/machine-learning.png',
    color: '#FA3A59',
    bg: '#F5E5EF',
    ready: true,
  },
  {
    slug: 'design',
    labelKey: 'design',
    image: '/images/main/services/design.png',
    color: '#8D19FC',
    bg: '#ECE6FE',
    ready: true,
  },
  {
    slug: 'development',
    labelKey: 'development',
    image: '/images/main/services/development.png',
    color: '#1764F6',
    bg: '#E0EAFE',
    ready: true,
  },
  {
    slug: 'support',
    labelKey: 'support',
    image: '/images/main/services/support.png',
    color: '#0099B6',
    bg: '#D0F7F9',
    ready: true,
  },
  {
    slug: 'marketing',
    labelKey: 'marketing',
    image: '/images/main/services/marketing.png',
    color: '#DD9000',
    bg: '#F8F4C7',
    ready: true,
  },
  {
    slug: 'web3',
    labelKey: 'web3',
    image: '/images/main/services/web-3.png',
    color: '#42A400',
    bg: '#DCF5D0',
    ready: true,
  },
];

/** Ссылка на услугу: страница, если свёрстана, иначе заглушка */
export const getServiceHref = (service: ServiceItem): string =>
  service.ready ? `/services/${service.slug}` : SERVICE_FALLBACK_HREF;

/**
 * Отрасли в блоке «Экспертиза для различных отраслей».
 * Порядок задан макетом страницы услуги и отличается от порядка
 * в меню шапки, поэтому список описан отдельно.
 * Ссылки и ключи переводов те же, что у навигации по экспертизе.
 */
export const SERVICE_EXPERTISE_LINKS = [
  { href: '/expertise', i18nKey: 'header.prom' },
  { href: '/expertise?tab=fintech', i18nKey: 'header.fintech' },
  { href: '/expertise?tab=trade', i18nKey: 'header.trade' },
  { href: '/expertise?tab=health', i18nKey: 'header.health' },
  { href: '/expertise?tab=transport', i18nKey: 'header.transport' },
  { href: '/expertise?tab=science', i18nKey: 'header.science' },
];
