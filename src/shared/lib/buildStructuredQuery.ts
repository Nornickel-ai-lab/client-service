import type { GeoFilter } from '@/entities/query/model/filterTypes';
import { ui } from '@/shared/config/ui';

export interface QueryConstructorInput {
  material: string;
  process: string;
  conditions: string;
  geo: GeoFilter[];
  yearFrom: number | null;
  yearTo: number | null;
}

const geoLabel = (value: GeoFilter): string => {
  if (value === 'RU') {
    return ui.filterGeoRu;
  }
  if (value === 'foreign') {
    return ui.filterGeoForeign;
  }
  return ui.filterGeoWorld;
};

export const buildStructuredQuery = (input: QueryConstructorInput): string => {
  const lines: string[] = [];
  const material = input.material.trim();
  const process = input.process.trim();
  const conditions = input.conditions.trim();

  if (material) {
    lines.push(`${ui.queryConstructorMaterial}: ${material}`);
  }
  if (process) {
    lines.push(`${ui.queryConstructorProcess}: ${process}`);
  }
  if (conditions) {
    lines.push(`${ui.queryConstructorConditions}: ${conditions}`);
  }
  if (input.geo.length > 0) {
    const geoText = input.geo.map((item) => {
      return geoLabel(item);
    }).join(', ');
    lines.push(`${ui.filterGeo}: ${geoText}`);
  }
  if (input.yearFrom !== null || input.yearTo !== null) {
    const from = input.yearFrom ?? '…';
    const to = input.yearTo ?? '…';
    lines.push(`${ui.queryConstructorPeriod}: ${from}–${to}`);
  }

  if (lines.length === 0) {
    return '';
  }

  lines.push('');
  lines.push(ui.queryConstructorQuestion);
  return lines.join('\n');
};

export const buildConstructorFallbackQuestion = (input: QueryConstructorInput): string => {
  const parts = [
    input.material.trim(),
    input.process.trim(),
    input.conditions.trim(),
  ].filter(Boolean);
  if (parts.length === 0) {
    return ui.queryConstructorQuestion;
  }
  return `${parts.join('. ')}. ${ui.queryConstructorQuestion}`;
};

export const buildSearchQueryText = (
  userText: string,
  constructor: QueryConstructorInput,
): string => {
  const trimmed = userText.trim();
  if (trimmed) {
    return trimmed;
  }
  if (hasConstructorInput(constructor)) {
    return buildConstructorFallbackQuestion(constructor);
  }
  return '';
};

export const hasConstructorInput = (input: QueryConstructorInput): boolean => {
  return Boolean(
    input.material.trim()
    || input.process.trim()
    || input.conditions.trim()
    || input.geo.length > 0
    || input.yearFrom !== null
    || input.yearTo !== null,
  );
};
