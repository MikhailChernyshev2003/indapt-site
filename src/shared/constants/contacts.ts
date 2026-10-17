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
    name: '191002, Щербаков пер., 17/3с1,<br/> БЦ &laquo;Премьер&raquo;',
    shortName: 'Россия, Санкт-Петербург',
    coordinates: {
      long: 59.927727,
      lat: 30.345820,
    },
  },
  {
    id: 3,
    name: 'Meydan Free Zone,<br/> Meydan Grandstand, 6th Floor',
    shortName: 'ОАЭ, Дубай',
    coordinates: {
      long: 25.155022,
      lat: 55.299637,
    },
  },
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
    name: '191002, Shcherbakov Lane, 17/3 bldg. 1,<br/>Premier Business Center',
    shortName: 'Russia, Saint Petersburg',
    coordinates: {
      long: 59.927727,
      lat: 30.345820,
    },
  },
  {
    id: 3,
    name: 'Meydan Free Zone,<br/> Meydan Grandstand, 6th Floor',
    shortName: 'UAE, Dubai',
    coordinates: {
      long: 25.155022,
      lat: 55.299637,
    },
  },
];
