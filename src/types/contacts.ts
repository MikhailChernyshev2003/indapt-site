export interface Coordinates {
  long: number;
  lat: number;
}

export interface Subsidiary {
  id: number;
  name: string;
  shortName: string;
  coordinates: Coordinates;
}
