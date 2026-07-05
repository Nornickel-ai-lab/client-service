<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import { useFilterStore } from '@/entities/query/model/filterStore';
import type { GeoFilter } from '@/entities/query/model/filterTypes';
import {
  maxFilterYear,
  MIN_FILTER_YEAR,
  validateFilterYears,
} from '@/features/search/query-constructor/model/filterFormSchema';
import { ui } from '@/shared/config/ui';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

const store = useFilterStore();
const { material, process, conditions, geo, yearFrom, yearTo } = storeToRefs(store);

const yearFromInput = ref('');
const yearToInput = ref('');
const yearFromError = ref('');
const yearToError = ref('');

watch(
  yearFrom,
  (value) => {
    yearFromInput.value = value === null ? '' : String(value);
  },
  { immediate: true },
);

watch(
  yearTo,
  (value) => {
    yearToInput.value = value === null ? '' : String(value);
  },
  { immediate: true },
);

const geoOptions: { id: GeoFilter; label: string }[] = [
  { id: 'RU', label: ui.filterGeoRu },
  { id: 'foreign', label: ui.filterGeoForeign },
  { id: 'world', label: ui.filterGeoWorld },
];

const isGeoActive = (value: GeoFilter): boolean => geo.value.includes(value);

const applyYearErrors = (errors: Record<string, string>): void => {
  yearFromError.value = errors.yearFrom ?? '';
  yearToError.value = errors.yearTo ?? '';
};

const syncYearsToStore = async (): Promise<boolean> => {
  const result = await validateFilterYears(yearFromInput.value, yearToInput.value);
  applyYearErrors(result.errors);
  if (!result.valid) {
    return false;
  }
  yearFrom.value = result.values.yearFrom;
  yearTo.value = result.values.yearTo;
  return true;
};

const onYearFromInput = (value: string | number): void => {
  yearFromInput.value = String(value);
  yearFromError.value = '';
  yearToError.value = '';
};

const onYearToInput = (value: string | number): void => {
  yearToInput.value = String(value);
  yearFromError.value = '';
  yearToError.value = '';
};

defineExpose({
  validateYears: syncYearsToStore,
});
</script>

<template>
  <form
    class="query-filters"
    @submit.prevent
  >
    <p class="query-filters__description">
      {{ ui.queryConstructorDescription }}
    </p>

    <div class="query-filters__grid">
      <div class="space-y-2">
        <Label for="filter-material">{{ ui.queryConstructorMaterial }}</Label>
        <Input
          id="filter-material"
          v-model="material"
          :placeholder="ui.queryConstructorMaterialPlaceholder"
        />
      </div>
      <div class="space-y-2">
        <Label for="filter-process">{{ ui.queryConstructorProcess }}</Label>
        <Input
          id="filter-process"
          v-model="process"
          :placeholder="ui.queryConstructorProcessPlaceholder"
        />
      </div>
      <div class="space-y-2 sm:col-span-2">
        <Label for="filter-conditions">{{ ui.queryConstructorConditions }}</Label>
        <Textarea
          id="filter-conditions"
          v-model="conditions"
          rows="2"
          :placeholder="ui.queryConstructorConditionsPlaceholder"
        />
      </div>
      <div class="space-y-2 sm:col-span-2">
        <Label>{{ ui.filterGeo }}</Label>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="option in geoOptions"
            :key="option.id"
            type="button"
            size="sm"
            :variant="isGeoActive(option.id) ? 'default' : 'outline'"
            @click="store.toggleGeo(option.id)"
          >
            {{ option.label }}
          </Button>
        </div>
      </div>
      <div class="space-y-2">
        <Label for="filter-year-from">{{ ui.filterYearFrom }}</Label>
        <Input
          id="filter-year-from"
          :model-value="yearFromInput"
          type="number"
          inputmode="numeric"
          :min="MIN_FILTER_YEAR"
          :max="maxFilterYear()"
          :placeholder="String(MIN_FILTER_YEAR)"
          :aria-invalid="Boolean(yearFromError)"
          @update:model-value="onYearFromInput"
          @blur="syncYearsToStore"
        />
        <p
          v-if="yearFromError"
          class="text-xs text-destructive"
        >
          {{ yearFromError }}
        </p>
      </div>
      <div class="space-y-2">
        <Label for="filter-year-to">{{ ui.filterYearTo }}</Label>
        <Input
          id="filter-year-to"
          :model-value="yearToInput"
          type="number"
          inputmode="numeric"
          :min="MIN_FILTER_YEAR"
          :max="maxFilterYear()"
          :placeholder="String(maxFilterYear())"
          :aria-invalid="Boolean(yearToError)"
          @update:model-value="onYearToInput"
          @blur="syncYearsToStore"
        />
        <p
          v-if="yearToError"
          class="text-xs text-destructive"
        >
          {{ yearToError }}
        </p>
      </div>
    </div>
  </form>
</template>

<style scoped>
.query-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: visible;
}

.query-filters__description {
  display: none;
}

.query-filters__grid {
  display: grid;
  gap: 12px;
  overflow: visible;
}

@media (min-width: 640px) {
  .query-filters__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
