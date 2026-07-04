<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useFilterStore } from '@/entities/query/model/filterStore';
import type { GeoFilter } from '@/entities/query/model/filterTypes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ui } from '@/shared/config/ui';

const store = useFilterStore();
const { geo, yearFrom, yearTo, hasActiveFilters } = storeToRefs(store);

const geoOptions: { id: GeoFilter; label: string }[] = [
  { id: 'RU', label: ui.filterGeoRu },
  { id: 'foreign', label: ui.filterGeoForeign },
  { id: 'world', label: ui.filterGeoWorld },
];

const isGeoActive = (value: GeoFilter): boolean => {
  return geo.value.includes(value);
};
</script>

<template>
  <Card class="border-border shadow-none">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between gap-2">
        <CardTitle class="text-sm font-medium">
          {{ ui.filterTitle }}
        </CardTitle>
        <Button
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          type="button"
          @click="store.reset()"
        >
          {{ ui.filterReset }}
        </Button>
      </div>
    </CardHeader>
    <CardContent class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <Label for="year-from">{{ ui.filterYearFrom }}</Label>
        <Input
          id="year-from"
          type="number"
          min="1900"
          max="2100"
          :model-value="yearFrom ?? ''"
          @update:model-value="(value) => { yearFrom = value ? Number(value) : null; }"
        />
      </div>
      <div class="space-y-2">
        <Label for="year-to">{{ ui.filterYearTo }}</Label>
        <Input
          id="year-to"
          type="number"
          min="1900"
          max="2100"
          :model-value="yearTo ?? ''"
          @update:model-value="(value) => { yearTo = value ? Number(value) : null; }"
        />
      </div>
    </CardContent>
  </Card>
</template>
