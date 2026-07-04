<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { startReindexAll, startSeedMaterials } from '@/entities/ml/api/mlApi';
import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import { ui } from '@/shared/config/ui';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';

const store = useMlProviderStore();
const {
  isLocal,
  ollamaAvailable,
  gigachatAvailable,
  loaded,
  provider,
  ollamaOption,
  gigachatOption,
} = storeToRefs(store);

const bulkStatus = ref<'idle' | 'process' | 'error'>('idle');
const bulkError = ref<string | null>(null);

const activeOption = computed(() => {
  return isLocal.value ? ollamaOption.value : gigachatOption.value;
});

const embedLabel = computed(() => {
  const model = activeOption.value?.embed_model;
  if (!model) {
    return '';
  }
  return model;
});

const canRunBulk = computed(() => {
  if (isLocal.value) {
    return ollamaAvailable.value;
  }
  return gigachatAvailable.value;
});

const switchDisabled = computed(() => {
  return !ollamaAvailable.value || !gigachatAvailable.value;
});

onMounted(async () => {
  await store.loadProviders();
});

const onToggle = (value: boolean): void => {
  store.toggleLocal(value);
};

const runBulk = async (action: 'seed' | 'reindex'): Promise<void> => {
  if (!canRunBulk.value || bulkStatus.value === 'process') {
    return;
  }
  bulkStatus.value = 'process';
  bulkError.value = null;
  try {
    if (action === 'seed') {
      await startSeedMaterials(provider.value);
    } else {
      await startReindexAll(provider.value);
    }
    bulkStatus.value = 'idle';
  } catch {
    bulkStatus.value = 'error';
    bulkError.value = ui.mlBulkFailed;
  }
};
</script>

<template>
  <div
    v-if="loaded"
    class="ml-provider-panel"
  >
    <div class="flex items-center justify-between gap-2">
      <Label
        for="ml-provider-toggle"
        class="text-xs text-muted-foreground"
      >
        {{ isLocal ? ui.mlProviderLocal : ui.mlProviderGigachat }}
      </Label>
      <Switch
        id="ml-provider-toggle"
        :model-value="isLocal"
        :disabled="switchDisabled"
        @update:model-value="onToggle"
      />
    </div>
    <p
      v-if="embedLabel"
      class="text-[10px] leading-tight text-muted-foreground"
    >
      {{ embedLabel }}
    </p>
    <p
      v-if="isLocal && ollamaAvailable"
      class="text-[10px] leading-tight text-muted-foreground"
    >
      {{ ui.mlBulkHintLocal }}
    </p>
    <div class="flex flex-col gap-1.5">
      <Button
        variant="outline"
        size="sm"
        class="h-8 w-full text-xs"
        type="button"
        :disabled="!canRunBulk || bulkStatus === 'process'"
        @click="runBulk('seed')"
      >
        {{ ui.mlBulkSeed }}
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="h-8 w-full text-xs"
        type="button"
        :disabled="!canRunBulk || bulkStatus === 'process'"
        @click="runBulk('reindex')"
      >
        {{ ui.mlBulkReindex }}
      </Button>
    </div>
    <p
      v-if="bulkStatus === 'process'"
      class="text-[10px] text-muted-foreground"
    >
      {{ ui.mlBulkStarted }}
    </p>
    <p
      v-if="bulkError"
      class="text-[10px] text-destructive"
    >
      {{ bulkError }}
    </p>
  </div>
</template>

<style scoped>
.ml-provider-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
