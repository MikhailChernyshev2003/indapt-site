export interface IDetailVacancy {
  id: number;
  title: string;
  format: string;
  city: string;
  work: string[];
  requirements: string[];
  conditions: {
    title: string;
    text: string[];
  }[];
};
