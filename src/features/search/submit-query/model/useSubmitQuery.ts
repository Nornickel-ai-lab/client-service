import type { Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useQueryStore } from '@/entities/query/model/queryStore';
import type { ChatMessage } from '@/entities/query/model/types';

interface SubmitQueryResult {
  messages: Ref<ChatMessage[]>;
  inputStatus: Ref<'idle' | 'process'>;
  submit: (text: string) => Promise<void>;
  retry: (assistantId: string) => Promise<void>;
}

export const useSubmitQuery = (): SubmitQueryResult => {
  const store = useQueryStore();
  const { messages, inputStatus } = storeToRefs(store);

  return {
    messages,
    inputStatus,
    submit: store.sendMessage,
    retry: store.retryMessage,
  };
};
