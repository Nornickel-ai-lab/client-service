<script setup lang="ts">
import ChatInput from '@/features/chat/send-message/ui/ChatInput.vue';
import ChatMessages from '@/widgets/chat-messages/ui/ChatMessages.vue';
import { ui } from '@/shared/config/ui';
</script>

<template>
  <div class="chat-panel">
    <header class="chat-panel__header">
      <h1 class="chat-panel__title">
        {{ ui.chatTitle }}
      </h1>
    </header>
    <ChatMessages />
    <ChatInput />
  </div>
</template>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}

.chat-panel__header {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.chat-panel__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
</style>
