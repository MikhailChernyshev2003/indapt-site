import type { ExpertiseCase } from '@l-expertise/types';

import Gazpromneft from '@l-expertise/assets/images/cases/gazpromneft.svg?url';
import K31 from '@l-expertise/assets/images/cases/k31.svg?url';
import University from '@l-expertise/assets/images/cases/university.svg?url';
import Bmw from '@l-expertise/assets/images/cases/bmw.svg?url';
import Kassir from '@l-expertise/assets/images/cases/kassir.svg?url';
import Zaslon from '@l-expertise/assets/images/cases/zaslon.svg?url';

export const expertiseCases: ExpertiseCase[] = [
  {
    name: 'expertise.transport.case.name',
    num: 1,
    label: 'expertise.transport.case.label',
    text: 'expertise.transport.case.text',
    image: Gazpromneft,
    tab: 'transport',
  },
  {
    name: 'expertise.science.case.name',
    num: 2,
    label: 'expertise.science.case.label',
    text: 'expertise.science.case.text',
    image: University,
    tab: 'science',
  },
  {
    name: 'expertise.trade.case.name',
    num: 3,
    label: 'expertise.trade.case.label',
    text: 'expertise.trade.case.text',
    image: Bmw,
    tab: 'trade',
  },
  {
    name: 'expertise.health.case.name',
    num: 4,
    label: 'expertise.health.case.label',
    text: 'expertise.health.case.text',
    image: K31,
    tab: 'health',
  },
  {
    name: 'expertise.fintech.case.name',
    num: 5,
    label: 'expertise.fintech.case.label',
    text: 'expertise.fintech.case.text',
    image: Kassir,
    tab: 'fintech',
  },
  {
    name: 'expertise.industry.case.name',
    num: 6,
    label: 'expertise.industry.case.label',
    text: 'expertise.industry.case.text',
    image: Zaslon,
    tab: 'industry',
  },
];
