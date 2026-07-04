<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useChatStore } from '@/entities/query/model/chatStore';
import AnswerBlock from '@/widgets/answer-block/ui/AnswerBlock.vue';
import { ui } from '@/shared/config/ui';

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);

const onRetry = (id: string): void => {
  chatStore.retryMessage(id);
};
</script>

<template>
  <div class="chat-messages">
    <div
      v-if="messages.length === 0"
      class="chat-messages__empty"
    >
      {{ ui.chatEmpty }}
    </div>

    <div
      v-for="message in messages"
      :key="message.id"
      class="chat-messages__row"
      :class="`chat-messages__row_${message.role}`"
    >
      <div
        v-if="message.role === 'user'"
        class="chat-messages__user"
      >
        {{ message.text }}
      </div>
      <AnswerBlock
        v-else
        :message="message"
        @retry="onRetry"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-messages__empty {
  margin: auto;
  color: #6b7280;
}

.chat-messages__row {
  display: flex;
  max-width: 100%;
}

.chat-messages__row_user {
  justify-content: flex-end;
}

.chat-messages__row_assistant {
  justify-content: flex-start;
}

.chat-messages__user {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  white-space: pre-wrap;
}

.chat-messages__row_assistant {
  width: 100%;
}
</style>
