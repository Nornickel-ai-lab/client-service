import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { fetchMlProviders } from '@/entities/ml/api/mlApi';
import type { MlProviderId, MlProviderOption } from '@/entities/ml/model/types';

const STORAGE_KEY = 'ml_provider';

export const useMlProviderStore = defineStore('mlProvider', () => {
  const provider = ref<MlProviderId>(
    (localStorage.getItem(STORAGE_KEY) as MlProviderId | null) ?? 'cloud',
  );
  const options = ref<MlProviderOption[]>([]);
  const loaded = ref(false);

  const ollamaOption = computed(() => {
    const found = options.value.find((item) => {
      return item.id === 'ollama';
    });
    return found ?? null;
  });

  const cloudOption = computed(() => {
    const found = options.value.find((item) => {
      return item.id === 'cloud';
    });
    return found ?? null;
  });

  const ollamaAvailable = computed(() => {
    return ollamaOption.value?.available ?? false;
  });

  const cloudAvailable = computed(() => {
    return cloudOption.value?.available ?? false;
  });

  const isLocal = computed(() => {
    return provider.value === 'ollama';
  });

  const setProvider = (value: MlProviderId): void => {
    if (value === 'ollama' && !ollamaAvailable.value) {
      return;
    }
    if (value === 'cloud' && !cloudAvailable.value) {
      return;
    }
    provider.value = value;
    localStorage.setItem(STORAGE_KEY, value);
  };

  const toggleLocal = (enabled: boolean): void => {
    setProvider(enabled ? 'ollama' : 'cloud');
  };

  const loadProviders = async (): Promise<void> => {
    try {
      const response = await fetchMlProviders();
      options.value = response.providers;
      loaded.value = true;
      if (provider.value === 'ollama' && !ollamaAvailable.value && cloudAvailable.value) {
        setProvider('cloud');
      }
      if (provider.value === 'cloud' && !cloudAvailable.value && ollamaAvailable.value) {
        setProvider('ollama');
      }
    } catch {
      loaded.value = true;
    }
  };

  return {
    provider,
    options,
    loaded,
    ollamaOption,
    cloudOption,
    ollamaAvailable,
    cloudAvailable,
    isLocal,
    setProvider,
    toggleLocal,
    loadProviders,
  };
});
