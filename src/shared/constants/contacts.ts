import type { Subsidiary } from '~/types/contacts';

export const SUBSIDIARIES: Subsidiary[] = [
  {
    id: 1,
    name: 'ММДЦ &laquo;Москва-Сити&raquo;, башня &laquo;Федерация Восток&raquo;',
    shortName: 'Россия, Москва',
    coordinates: {
      long: 55.749581,
      lat: 37.537305,
    },
  },
  {
    id: 2,
    name: 'Россия,<br/> Санкт-Петербург,<br/> Невский проспект, д. 56',
    shortName: 'Россия, Санкт-Петербург',
    coordinates: {
      long: 59.934227,
      lat: 30.338137,
    },
  },
  // Временно скрыли
  // {
  //   id: 3,
  //   name: 'ОАЭ, Дубай,<br/> Шейх-Зайед-роуд,<br/> башня 21',
  //   shortName: 'ОАЭ, Дубай',
  //   coordinates: {
  //     long: 25.052762,
  //     lat: 55.231631,
  //   },
  // },
];

export const SUBSIDIARIES_ENG: Subsidiary[] = [
  {
    id: 1,
    name: '123112, Moscow, Presnenskaya Embankment, 12<br/>MIBC “Moscow City”, Federation Tower East',
    shortName: 'Russia, Moscow',
    coordinates: {
      long: 55.749581,
      lat: 37.537305,
    },
  },
  {
    id: 2,
    name: '',
    shortName: 'Russia, Saint Petersburg',
    coordinates: {
      long: 59.934227,
      lat: 30.338137,
    },
  },
  // Временно скрыли
  // {
  //   id: 3,
  //   name: 'ОАЭ, Дубай,<br/> Шейх-Зайед-роуд,<br/> башня 21',
  //   shortName: 'UAE, Dubai',
  //   coordinates: {
  //     long: 25.052762,
  //     lat: 55.231631,
  //   },
  // },
];
