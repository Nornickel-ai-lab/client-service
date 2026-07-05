<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { X } from 'lucide-vue-next';

import { useFilterStore } from '@/entities/query/model/filterStore';
import QueryFiltersModal from '@/features/search/query-constructor/ui/QueryFiltersModal.vue';
import { ui } from '@/shared/config/ui';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

const store = useFilterStore();
const { hasActiveFilters, material, process, conditions, geo, yearFrom, yearTo } = storeToRefs(store);

const activeChips = computed((): string[] => {
  const chips: string[] = [];
  const materialValue = material.value.trim();
  if (materialValue) {
    chips.push(`${ui.queryConstructorMaterial}: ${materialValue}`);
  }
  const processValue = process.value.trim();
  if (processValue) {
    chips.push(`${ui.queryConstructorProcess}: ${processValue}`);
  }
  const conditionsValue = conditions.value.trim();
  if (conditionsValue) {
    chips.push(conditionsValue.length > 40 ? `${conditionsValue.slice(0, 37)}…` : conditionsValue);
  }
  if (geo.value.length > 0) {
    const labels: Record<string, string> = {
      RU: ui.filterGeoRu,
      foreign: ui.filterGeoForeign,
      world: ui.filterGeoWorld,
    };
    chips.push(geo.value.map((item) => labels[item] ?? item).join(', '));
  }
  if (yearFrom.value !== null || yearTo.value !== null) {
    const from = yearFrom.value ?? '…';
    const to = yearTo.value ?? '…';
    chips.push(`${from}–${to}`);
  }
  return chips;
});
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-3">
    <div class="flex flex-wrap items-center gap-2">
      <QueryFiltersModal />
      <Button
        v-if="hasActiveFilters"
        variant="ghost"
        size="sm"
        type="button"
        class="text-xs"
        @click="store.reset()"
      >
        <X class="size-3.5" />
        {{ ui.filterReset }}
      </Button>
      <div
        v-if="activeChips.length > 0"
        class="flex min-w-0 flex-1 flex-wrap gap-1.5"
      >
        <Badge
          v-for="(chip, index) in activeChips"
          :key="`${chip}-${index}`"
          variant="secondary"
          class="max-w-full truncate font-normal"
        >
          {{ chip }}
        </Badge>
      </div>
    </div>
  </div>
</template>
