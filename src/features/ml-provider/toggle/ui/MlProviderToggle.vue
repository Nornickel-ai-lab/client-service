<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import { ui } from '@/shared/config/ui';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';

const store = useMlProviderStore();
const { loaded, gigachatOption } = storeToRefs(store);

onMounted(async () => {
  await store.loadProviders();
  store.setProvider('gigachat');
});
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
      {{ gigachatOption?.label ?? ui.mlProviderCloud }}
    </Label>
    <Switch
      id="ml-provider-toggle"
      :model-value="false"
      disabled
    />
  </div>
</template>
