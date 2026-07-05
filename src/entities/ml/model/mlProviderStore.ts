import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { fetchMlProviders } from '@/entities/ml/api/mlApi';
import type { MlProviderId, MlProviderOption } from '@/entities/ml/model/types';

const STORAGE_KEY = 'ml_provider';

const readStoredProvider = (): MlProviderId => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'cloud') {
    return 'gigachat';
  }
  if (stored === 'gigachat' || stored === 'ollama') {
    return stored;
  }
  return 'gigachat';
};

export const useMlProviderStore = defineStore('mlProvider', () => {
  const provider = ref<MlProviderId>(readStoredProvider());
  const options = ref<MlProviderOption[]>([]);
  const loaded = ref(false);

  const ollamaOption = computed(() => {
    const found = options.value.find((item) => {
      return item.id === 'ollama';
    });
    return found ?? null;
  });

  const gigachatOption = computed(() => {
    const found = options.value.find((item) => {
      return item.id === 'gigachat';
    });
    return found ?? null;
  });

  const ollamaAvailable = computed(() => {
    return ollamaOption.value?.available ?? false;
  });

  const gigachatAvailable = computed(() => {
    return gigachatOption.value?.available ?? false;
  });

  const isLocal = computed(() => {
    return provider.value === 'ollama';
  });

  const setProvider = (value: MlProviderId): void => {
    if (value === 'ollama' && !ollamaAvailable.value) {
      return;
    }
    if (value === 'gigachat' && !gigachatAvailable.value) {
      return;
    }
    provider.value = value;
    localStorage.setItem(STORAGE_KEY, value);
  };

  const toggleLocal = (enabled: boolean): void => {
    setProvider(enabled ? 'ollama' : 'gigachat');
  };

  const loadProviders = async (): Promise<void> => {
    try {
      const response = await fetchMlProviders();
      options.value = response.providers;
      loaded.value = true;
      provider.value = 'gigachat';
      localStorage.setItem(STORAGE_KEY, 'gigachat');
    } catch {
      loaded.value = true;
      provider.value = 'gigachat';
      localStorage.setItem(STORAGE_KEY, 'gigachat');
    }
  };

  return {
    provider,
    options,
    loaded,
    ollamaOption,
    gigachatOption,
    ollamaAvailable,
    gigachatAvailable,
    isLocal,
    setProvider,
    toggleLocal,
    loadProviders,
  };
});
