<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { ui } from '@/shared/config/ui';

const store = useMlProviderStore();
const { isLocal, ollamaAvailable, loaded } = storeToRefs(store);

const initProviders = async (): Promise<void> => {
  await store.loadProviders();
};

onMounted(() => {
  initProviders();
});

const onToggle = (value: boolean): void => {
  store.toggleLocal(value);
};
</script>

<template>
  <div
    v-if="loaded"
    class="flex items-center gap-2"
  >
    <Label
      for="ml-provider-toggle"
      class="text-xs text-muted-foreground"
    >
      {{ isLocal ? ui.mlProviderLocal : ui.mlProviderCloud }}
    </Label>
    <Switch
      id="ml-provider-toggle"
      :model-value="isLocal"
      :disabled="!ollamaAvailable"
      size="sm"
      :aria-label="ui.mlProviderToggle"
      @update:model-value="onToggle"
    />
  </div>
</template>
