<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import { ui } from '@/shared/config/ui';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';

const store = useMlProviderStore();
const { isLocal, ollamaAvailable, gigachatAvailable, loaded } = storeToRefs(store);

const switchDisabled = computed(() => {
  if (isLocal.value) {
    return !gigachatAvailable.value;
  }
  return !ollamaAvailable.value;
});

onMounted(async () => {
  await store.loadProviders();
});

const onToggle = (value: boolean): void => {
  store.toggleLocal(value);
};
</script>

<template>
  <div
    v-if="loaded"
    class="flex items-center justify-between gap-2"
  >
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
</template>
