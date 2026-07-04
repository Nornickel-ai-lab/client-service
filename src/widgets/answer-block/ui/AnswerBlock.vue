<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';

import type { ChatMessage } from '@/entities/query/model/types';
import SourceList from '@/widgets/source-list/ui/SourceList.vue';
import { ui } from '@/shared/config/ui';

const props = defineProps<{
  message: ChatMessage;
}>();

const emit = defineEmits<{
  retry: [id: string];
}>();

const html = computed(() => {
  if (!props.message.response?.answer_md) {
    return '';
  }
  return marked.parse(props.message.response.answer_md, { async: false }) as string;
});

const onRetry = (): void => {
  emit('retry', props.message.id);
};
</script>

<template>
  <div
    v-if="message.status === 'idle'"
    class="answer answer_idle"
  >
    {{ ui.chatIdle }}
  </div>

  <div
    v-else-if="message.status === 'process'"
    class="answer answer_process"
  >
    <span class="answer__spinner" />
    {{ ui.statusProcess }}
  </div>

  <div
    v-else-if="message.status === 'error'"
    class="answer answer_error"
  >
    <p class="answer__error-text">
      {{ message.error ?? ui.statusError }}
    </p>
    <button
      type="button"
      class="answer__retry"
      @click="onRetry"
    >
      {{ ui.retry }}
    </button>
  </div>

  <div
    v-else
    class="answer answer_loaded"
  >
    <div
      class="answer__body"
      v-html="html"
    />
    <p
      v-if="message.response"
      class="answer__meta"
    >
      <span>{{ ui.confidence }}: {{ Math.round(message.response.confidence * 100) }}%</span>
      <span>{{ ui.performanceTotal }}: {{ message.response.performance.total_time_ms }}</span>
    </p>
    <SourceList
      v-if="message.response"
      :sources="message.response.sources"
    />
  </div>
</template>

<style scoped>
.answer {
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.answer_idle {
  color: #6b7280;
  background: #f9fafb;
}

.answer_process {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
}

.answer__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.answer_error {
  border-color: #fecaca;
  background: #fef2f2;
}

.answer__error-text {
  margin: 0 0 8px;
  color: #b91c1c;
}

.answer__retry {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
}

.answer_loaded {
  background: #fff;
}

.answer__body :deep(p) {
  margin: 0 0 8px;
}

.answer__body :deep(p:last-child) {
  margin-bottom: 0;
}

.answer__meta {
  margin: 12px 0 0;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
