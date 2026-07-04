<script setup lang="ts">
import ChatInput from '@/features/chat/send-message/ui/ChatInput.vue';
import ChatMessages from '@/widgets/chat-messages/ui/ChatMessages.vue';
import { ui } from '@/shared/config/ui';
</script>

<template>
  <div class="flex h-full flex-col bg-muted/30">
    <header class="border-b border-border bg-background px-4 py-3">
      <h1 class="text-base font-semibold">
        {{ ui.chatTitle }}
      </h1>
    </header>
    <ChatMessages />
    <ChatInput />
  </div>
</template>
