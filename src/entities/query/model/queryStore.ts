import { defineStore } from 'pinia';
import { ref } from 'vue';

import { postQuery } from '@/entities/query/api/queryApi';
import type { ChatMessage } from '@/entities/query/model/types';
import { parseApiError } from '@/shared/api/errorHandler';

const createId = (): string => {
  return crypto.randomUUID();
};

export const useQueryStore = defineStore('query', () => {
  const messages = ref<ChatMessage[]>([]);
  const inputStatus = ref<'idle' | 'process'>('idle');

  const sendMessage = async (text: string): Promise<void> => {
    const trimmed = text.trim();
    if (!trimmed || inputStatus.value === 'process') {
      return;
    }

    messages.value.push({
      id: createId(),
      role: 'user',
      text: trimmed,
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
      const response = await postQuery(trimmed);
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
