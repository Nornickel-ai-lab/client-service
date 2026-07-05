import { ui } from '@/shared/config/ui';

const geoCodeLabels = ui.geoCodeLabels as Record<string, string>;
const countryLabels = ui.countryLabels as Record<string, string>;
const graphNodeLabels = ui.graphNodeLabels as Record<string, string>;

export const formatGeoLabel = (raw: string): string => {
  if (!raw.trim()) {
    return raw;
  }
  return raw
    .split('|')
    .map((part) => {
      const key = part.trim();
      return geoCodeLabels[key] ?? countryLabels[key] ?? key;
    })
    .join(', ');
};

export const formatGraphNodeLabel = (label: string): string => {
  return graphNodeLabels[label] ?? label;
};
