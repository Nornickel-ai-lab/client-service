export interface QueryFiltersPayload {
  geo?: string[];
  year_from?: number;
  year_to?: number;
}

export type GeoFilter = 'RU' | 'foreign' | 'world';
