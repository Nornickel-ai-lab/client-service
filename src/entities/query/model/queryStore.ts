import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import { useFilterStore } from '@/entities/query/model/filterStore';
import { postQuery } from '@/entities/query/api/queryApi';
import type { QueryMessage } from '@/entities/query/model/types';
import { parseApiError } from '@/shared/api/errorHandler';
import {
  buildSearchQueryText,
  buildStructuredQuery,
  hasConstructorInput,
} from '@/shared/lib/buildStructuredQuery';
import { normalizeQueryResponse } from '@/shared/lib/normalizeQueryResponse';

const createId = (): string => {
  return crypto.randomUUID();
};

export const useQueryStore = defineStore('query', () => {
  const messages = ref<QueryMessage[]>([]);
  const inputStatus = ref<'idle' | 'process'>('idle');

  const sendMessage = async (
    text: string,
    options?: { applyConstructor?: boolean; clearConstructorAfter?: boolean },
  ): Promise<void> => {
    const applyConstructor = options?.applyConstructor ?? true;
    const filterStore = useFilterStore();
    const constructor = filterStore.constructorState;
    const useConstructor = applyConstructor && hasConstructorInput(constructor);
    const queryText = useConstructor
      ? buildSearchQueryText(text, constructor)
      : text.trim();

    if (!queryText || inputStatus.value === 'process') {
      return;
    }

    const displayText = text.trim()
      ? text.trim()
      : buildStructuredQuery(constructor);

    messages.value.push({
      id: createId(),
      role: 'user',
      text: displayText || queryText,
      status: 'loaded',
      response: null,
      error: null,
    });

    const assistantId = createId();
    messages.value.push({
      id: assistantId,
      role: 'assistant',
      text: '',
      status: 'process',
      response: null,
      error: null,
    });

    inputStatus.value = 'process';

    try {
      const mlStore = useMlProviderStore();
      const filters = useConstructor ? filterStore.toPayload() : undefined;
      const response = normalizeQueryResponse(
        await postQuery(queryText, mlStore.provider, filters),
      );
      const index = messages.value.findIndex((item) => {
        return item.id === assistantId;
      });
      if (index !== -1) {
        messages.value[index] = {
          ...messages.value[index],
          status: 'loaded',
          response,
        };
      }
      if (options?.clearConstructorAfter) {
        filterStore.reset();
      }
    } catch (error) {
      const index = messages.value.findIndex((item) => {
        return item.id === assistantId;
      });
      if (index !== -1) {
        messages.value[index] = {
          ...messages.value[index],
          status: 'error',
          error: parseApiError(error),
        };
      }
    }

    inputStatus.value = 'idle';
  };

  const retryMessage = async (assistantId: string): Promise<void> => {
    const assistantIndex = messages.value.findIndex((item) => {
      return item.id === assistantId;
    });
    if (assistantIndex <= 0) {
      return;
    }
    const userMessage = messages.value[assistantIndex - 1];
    if (userMessage.role !== 'user') {
      return;
    }
    messages.value.splice(assistantIndex, 1);
    await sendMessage(userMessage.text);
  };

  return {
    messages,
    inputStatus,
    sendMessage,
    retryMessage,
  };
});
