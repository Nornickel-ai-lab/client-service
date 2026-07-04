export interface QueryFiltersPayload {
  geo?: string[];
  year_from?: number;
  year_to?: number;
  material?: string;
  process?: string;
  conditions?: string;
}

export type GeoFilter = 'RU' | 'foreign' | 'world';

export interface QueryConstructorState {
  material: string;
  process: string;
  conditions: string;
  geo: GeoFilter[];
  yearFrom: number | null;
  yearTo: number | null;
}
