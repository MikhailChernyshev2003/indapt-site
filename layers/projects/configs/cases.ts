import type { ProjectCaseItem } from '@l-projects/types';

import University from '@l-expertise/assets/images/cases/university.svg?url';
// Свой файл: в общем логотип Газпромнефти лежит в квадрате с полями,
// и при заданном по макету размере знак выходил в 1,7 раза мельче
import Gazpromneft from '@l-projects/assets/images/logos/gazpromneft.svg?url';
import Bmw from '@l-expertise/assets/images/cases/bmw.svg?url';
import K31 from '@l-expertise/assets/images/cases/k31.svg?url';
import Kassir from '@l-expertise/assets/images/cases/kassir.svg?url';
import Zaslon from '@l-expertise/assets/images/cases/zaslon.svg?url';

/** Кейсы в порядке разводящей страницы макета */
export const PROJECT_CASES: ProjectCaseItem[] = [
  {
    slug: 'university',
    i18nKey: 'university',
    tab: 'science',
    logo: University,
    logoSize: [185, 228],
    logoSizeTablet: [150, 184],
    logoSizeMobile: [174, 214],
    logoSizeSmall: [75, 93],
    accent: '#1764f6',
    cardBg: '#e1f2ff',
    techColor: '#0081ff',
    heroColor: '#0081ff',
  },
  {
    slug: 'gazprom',
    i18nKey: 'gazprom',
    tab: 'transport',
    logo: Gazpromneft,
    logoSize: [118, 198],
    logoSizeTablet: [105, 176],
    logoSizeMobile: [131, 219],
    logoSizeSmall: [44, 74],
    accent: '#0095ef',
    cardBg: '#e1f4ff',
    techColor: '#0095ef',
    heroColor: '#0095ef',
  },
  {
    slug: 'bmw',
    i18nKey: 'bmw',
    tab: 'trade',
    logo: Bmw,
    logoSize: [180, 180],
    logoSizeTablet: [140, 140],
    logoSizeMobile: [154, 154],
    logoSizeSmall: [72, 72],
    accent: '#1764f6',
    cardBg: '#e1f2ff',
    techColor: '#1764f6',
    heroColor: '#1764f6',
  },
  {
    slug: 'k31',
    i18nKey: 'k31',
    tab: 'health',
    logo: K31,
    logoSize: [250, 116],
    logoSizeTablet: [133, 62],
    logoSizeMobile: [176, 82],
    logoSizeSmall: [82, 38],
    accent: '#f1842c',
    cardBg: '#ffefe1',
    techColor: '#ff7f18',
    heroColor: '#f1842c',
  },
  {
    slug: 'kassir',
    i18nKey: 'kassir',
    tab: 'fintech',
    logo: Kassir,
    logoSize: [180, 180],
    logoSizeTablet: [140, 140],
    logoSizeMobile: [158, 158],
    logoSizeSmall: [69, 81],
    accent: '#b18200',
    cardBg: '#fffbee',
    techColor: '#ffd152',
    heroColor: '#ffc627',
  },
  {
    slug: 'zaslon',
    i18nKey: 'zaslon',
    tab: 'industry',
    logo: Zaslon,
    logoSize: [195, 186],
    logoSizeTablet: [139, 133],
    logoSizeMobile: [160, 153],
    logoSizeSmall: [78, 75],
    accent: '#f32941',
    cardBg: '#ffe1e5',
    techColor: '#f32f46',
    heroColor: '#f32941',
  },
];

/** Путь страницы кейса */
export const getProjectHref = (slug: string) => `/projects/${slug}`;

/** Кейс по слагу */
export const getProjectCase = (slug: string) =>
  PROJECT_CASES.find(item => item.slug === slug);
