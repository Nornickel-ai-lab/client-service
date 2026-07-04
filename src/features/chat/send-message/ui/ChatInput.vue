<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { useChatStore } from '@/entities/query/model/chatStore';
import { ui } from '@/shared/config/ui';

const chatStore = useChatStore();
const { inputStatus } = storeToRefs(chatStore);

const text = ref('');

const submit = async (): Promise<void> => {
  const value = text.value;
  text.value = '';
  await chatStore.sendMessage(value);
};

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submit();
  }
};
</script>

<template>
  <form
    class="chat-input"
    @submit.prevent="submit"
  >
    <textarea
      v-model="text"
      class="chat-input__field"
      :placeholder="ui.chatPlaceholder"
      rows="2"
      :disabled="inputStatus === 'process'"
      @keydown="onKeydown"
    />
    <button
      class="chat-input__submit"
      type="submit"
      :disabled="inputStatus === 'process' || text.trim().length === 0"
    >
      {{ ui.chatSubmit }}
    </button>
  </form>
</template>

<style scoped>
.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.chat-input__field {
  flex: 1;
  resize: none;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
}

.chat-input__field:focus {
  outline: 2px solid #93c5fd;
  border-color: #3b82f6;
}

.chat-input__submit {
  align-self: flex-end;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
}
</style>
