<script setup lang="ts">
import { useSubmitQuery } from '@/features/search/submit-query/model/useSubmitQuery';
import AnswerCard from '@/widgets/answer-card/ui/AnswerCard.vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { ui } from '@/shared/config/ui';

const { messages, retry } = useSubmitQuery();

const onRetry = (id: string): void => {
  retry(id);
};
</script>

<template>
  <ScrollArea class="flex-1 px-4">
    <div class="flex min-h-full flex-col gap-3 py-4">
      <p
        v-if="messages.length === 0"
        class="m-auto text-sm text-muted-foreground"
      >
        {{ ui.emptyResults }}
      </p>

      <div
        v-for="message in messages"
        :key="message.id"
        class="flex w-full"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          v-if="message.role === 'user'"
          class="max-w-[80%] rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground whitespace-pre-wrap"
        >
          {{ message.text }}
        </div>
        <div
          v-else
          class="w-full max-w-full"
        >
          <AnswerCard
            :message="message"
            @retry="onRetry"
          />
        </div>
      </div>
    </div>
  </ScrollArea>
</template>
