<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';
import { ref, watch } from 'vue';

import { useFilterStore } from '@/entities/query/model/filterStore';
import type { GeoFilter, QueryConstructorState } from '@/entities/query/model/filterTypes';
import { useSubmitQuery } from '@/features/search/submit-query/model/useSubmitQuery';
import { buildStructuredQuery, hasConstructorInput } from '@/shared/lib/buildStructuredQuery';
import { ui } from '@/shared/config/ui';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { YearPicker } from '@/shared/ui/year-picker';

const open = defineModel<boolean>('open', { default: false });

const store = useFilterStore();
const { submit, inputStatus } = useSubmitQuery();
const form = ref<QueryConstructorState>({
  material: '',
  process: '',
  conditions: '',
  geo: [],
  yearFrom: null,
  yearTo: null,
});

const geoOptions: { id: GeoFilter; label: string }[] = [
  { id: 'RU', label: ui.filterGeoRu },
  { id: 'foreign', label: ui.filterGeoForeign },
  { id: 'world', label: ui.filterGeoWorld },
];

watch(open, (value) => {
  if (value) {
    form.value = { ...store.constructorState };
  }
});

const isGeoActive = (value: GeoFilter): boolean => {
  return form.value.geo.includes(value);
};

const toggleGeo = (value: GeoFilter): void => {
  if (form.value.geo.includes(value)) {
    form.value.geo = form.value.geo.filter((item) => {
      return item !== value;
    });
    return;
  }
  form.value.geo = [...form.value.geo, value];
};

const canApply = (): boolean => {
  return hasConstructorInput(form.value);
};

const onSubmit = async (): Promise<void> => {
  if (!canApply() || inputStatus.value === 'process') {
    return;
  }
  const state = { ...form.value };
  store.setConstructorState(state);
  const text = buildStructuredQuery(state);
  if (!text.trim()) {
    return;
  }
  open.value = false;
  await submit(text);
};

const onDialogInteractOutside = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  if (target?.closest('[data-year-picker-content]') || target?.closest('.year-picker')) {
    event.preventDefault();
  }
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="query-constructor__overlay" />
      <DialogContent
        class="query-constructor__content"
        @pointer-down-outside="onDialogInteractOutside"
        @interact-outside="onDialogInteractOutside"
        @focus-outside="onDialogInteractOutside"
      >
        <div class="query-constructor__header">
          <DialogTitle class="query-constructor__title">
            {{ ui.queryConstructorTitle }}
          </DialogTitle>
          <DialogDescription class="query-constructor__description">
            {{ ui.queryConstructorDescription }}
          </DialogDescription>
        </div>

        <div class="query-constructor__grid">
          <div class="space-y-2">
            <Label for="constructor-material">{{ ui.queryConstructorMaterial }}</Label>
            <Input
              id="constructor-material"
              v-model="form.material"
              :placeholder="ui.queryConstructorMaterialPlaceholder"
            />
          </div>
          <div class="space-y-2">
            <Label for="constructor-process">{{ ui.queryConstructorProcess }}</Label>
            <Input
              id="constructor-process"
              v-model="form.process"
              :placeholder="ui.queryConstructorProcessPlaceholder"
            />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <Label for="constructor-conditions">{{ ui.queryConstructorConditions }}</Label>
            <Textarea
              id="constructor-conditions"
              v-model="form.conditions"
              rows="3"
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
                @click="toggleGeo(option.id)"
              >
                {{ option.label }}
              </Button>
            </div>
          </div>
          <div class="space-y-2">
            <Label>{{ ui.filterYearFrom }}</Label>
            <YearPicker v-model="form.yearFrom" />
          </div>
          <div class="space-y-2">
            <Label>{{ ui.filterYearTo }}</Label>
            <YearPicker v-model="form.yearTo" />
          </div>
        </div>

        <div class="query-constructor__actions">
          <DialogClose as-child>
            <Button
              variant="outline"
              type="button"
            >
              {{ ui.queryConstructorCancel }}
            </Button>
          </DialogClose>
          <Button
            type="button"
            :disabled="!canApply() || inputStatus === 'process'"
            @click="onSubmit"
          >
            {{ ui.searchSubmit }}
          </Button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.query-constructor__overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 45%);
}

.query-constructor__content {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 51;
  display: flex;
  max-height: min(90vh, 760px);
  width: min(640px, calc(100vw - 32px));
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--background);
  padding: 20px;
  transform: translate(-50%, -50%);
  box-shadow: 0 16px 40px rgb(0 0 0 / 18%);
}

.query-constructor__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.query-constructor__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.query-constructor__description {
  font-size: 12px;
  line-height: 1.45;
  color: var(--muted-foreground);
}

.query-constructor__grid {
  display: grid;
  gap: 14px;
  overflow: visible;
}

@media (min-width: 640px) {
  .query-constructor__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.query-constructor__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}
</style>
