import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { GeoFilter, QueryFiltersPayload } from '@/entities/query/model/filterTypes';

export const useFilterStore = defineStore('queryFilters', () => {
  const geo = ref<GeoFilter[]>([]);
  const yearFrom = ref<number | null>(null);
  const yearTo = ref<number | null>(null);

  const hasActiveFilters = computed(() => {
    return geo.value.length > 0 || yearFrom.value !== null || yearTo.value !== null;
  });

  const toggleGeo = (value: GeoFilter): void => {
    if (geo.value.includes(value)) {
      geo.value = geo.value.filter((item) => {
        return item !== value;
      });
      return;
    }
    geo.value = [...geo.value, value];
  };

  const reset = (): void => {
    geo.value = [];
    yearFrom.value = null;
    yearTo.value = null;
  };

  const toPayload = (): QueryFiltersPayload | undefined => {
    const payload: QueryFiltersPayload = {};
    if (geo.value.length > 0) {
      payload.geo = [...geo.value];
    }
    if (yearFrom.value !== null) {
      payload.year_from = yearFrom.value;
    }
    if (yearTo.value !== null) {
      payload.year_to = yearTo.value;
    }
    if (Object.keys(payload).length === 0) {
      return undefined;
    }
    return payload;
  };

  return {
    geo,
    yearFrom,
    yearTo,
    hasActiveFilters,
    toggleGeo,
    reset,
    toPayload,
  };
});
