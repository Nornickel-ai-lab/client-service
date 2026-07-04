<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { ui } from '@/shared/config/ui';

const store = useMlProviderStore();
const { isLocal, ollamaAvailable, cloudAvailable, loaded } = storeToRefs(store);

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
    class="flex flex-col gap-2"
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
      :disabled="!ollamaAvailable || !cloudAvailable"
      @update:model-value="onToggle"
    />
  </div>
</template>
