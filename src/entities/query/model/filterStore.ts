import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type {
  GeoFilter,
  QueryConstructorState,
  QueryFiltersPayload,
} from '@/entities/query/model/filterTypes';
import { hasConstructorInput } from '@/shared/lib/buildStructuredQuery';

const emptyConstructor = (): QueryConstructorState => {
  return {
    material: '',
    process: '',
    conditions: '',
    geo: [],
    yearFrom: null,
    yearTo: null,
  };
};

export const useFilterStore = defineStore('queryFilters', () => {
  const geo = ref<GeoFilter[]>([]);
  const yearFrom = ref<number | null>(null);
  const yearTo = ref<number | null>(null);
  const material = ref('');
  const process = ref('');
  const conditions = ref('');

  const constructorState = computed((): QueryConstructorState => {
    return {
      material: material.value,
      process: process.value,
      conditions: conditions.value,
      geo: [...geo.value],
      yearFrom: yearFrom.value,
      yearTo: yearTo.value,
    };
  });

  const hasActiveFilters = computed(() => {
    return geo.value.length > 0
      || yearFrom.value !== null
      || yearTo.value !== null
      || material.value.trim().length > 0
      || process.value.trim().length > 0
      || conditions.value.trim().length > 0;
  });

  const hasConstructorDraft = computed(() => {
    return hasConstructorInput(constructorState.value);
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

  const setConstructorState = (state: QueryConstructorState): void => {
    material.value = state.material;
    process.value = state.process;
    conditions.value = state.conditions;
    geo.value = [...state.geo];
    yearFrom.value = state.yearFrom;
    yearTo.value = state.yearTo;
  };

  const reset = (): void => {
    geo.value = [];
    yearFrom.value = null;
    yearTo.value = null;
    material.value = '';
    process.value = '';
    conditions.value = '';
  };

  const resetConstructor = (): void => {
    setConstructorState(emptyConstructor());
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
    const materialValue = material.value.trim();
    if (materialValue) {
      payload.material = materialValue;
    }
    const processValue = process.value.trim();
    if (processValue) {
      payload.process = processValue;
    }
    const conditionsValue = conditions.value.trim();
    if (conditionsValue) {
      payload.conditions = conditionsValue;
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
    material,
    process,
    conditions,
    constructorState,
    hasActiveFilters,
    hasConstructorDraft,
    toggleGeo,
    setConstructorState,
    reset,
    resetConstructor,
    toPayload,
  };
});
