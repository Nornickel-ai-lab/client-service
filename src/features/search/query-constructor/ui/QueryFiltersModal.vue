<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui';
import { SlidersHorizontal, X } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { useFilterStore } from '@/entities/query/model/filterStore';
import QueryFiltersForm from '@/features/search/query-constructor/ui/QueryFiltersForm.vue';
import { useSubmitQuery } from '@/features/search/submit-query/model/useSubmitQuery';
import { hasConstructorInput } from '@/shared/lib/buildStructuredQuery';
import { ui } from '@/shared/config/ui';
import { Button } from '@/shared/ui/button';

const open = ref(false);
const formRef = ref<InstanceType<typeof QueryFiltersForm> | null>(null);
const filterStore = useFilterStore();
const { constructorState } = storeToRefs(filterStore);
const { submit, inputStatus } = useSubmitQuery();

const onSearch = async (): Promise<void> => {
  if (!hasConstructorInput(constructorState.value) || inputStatus.value === 'process') {
    return;
  }
  const yearsValid = await formRef.value?.validateYears();
  if (yearsValid === false) {
    return;
  }
  open.value = false;
  await submit('');
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <Button
        type="button"
        variant="outline"
        size="sm"
      >
        <SlidersHorizontal class="size-3.5" />
        {{ ui.filterOpen }}
      </Button>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="filters-modal__overlay" />
      <DialogContent class="filters-modal__content">
        <div class="filters-modal__header">
          <div>
            <DialogTitle class="filters-modal__title">
              {{ ui.filterTitle }}
            </DialogTitle>
            <DialogDescription class="filters-modal__description">
              {{ ui.queryConstructorDescription }}
            </DialogDescription>
          </div>
          <DialogClose as-child>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              :aria-label="ui.filterClose"
            >
              <X class="size-4" />
            </Button>
          </DialogClose>
        </div>

        <QueryFiltersForm ref="formRef" />

        <div class="filters-modal__footer">
          <Button
            type="button"
            variant="outline"
            @click="open = false"
          >
            {{ ui.filterApply }}
          </Button>
          <Button
            type="button"
            :disabled="!hasConstructorInput(constructorState) || inputStatus === 'process'"
            @click="onSearch"
          >
            {{ ui.searchSubmit }}
          </Button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.filters-modal__overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 45%);
}

.filters-modal__content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 51;
  display: flex;
  max-height: min(90vh, 720px);
  width: min(560px, calc(100vw - 32px));
  transform: translate(-50%, -50%);
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--background);
  padding: 20px;
  box-shadow: 0 24px 48px rgb(0 0 0 / 20%);
}

.filters-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.filters-modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.filters-modal__description {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--muted-foreground);
}

.filters-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}
</style>
