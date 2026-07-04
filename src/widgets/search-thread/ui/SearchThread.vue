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
  <ScrollArea class="min-h-0 flex-1 px-6">
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 py-6">
      <div
        v-if="messages.length === 0"
        class="rounded-lg border border-dashed border-border bg-background px-6 py-12 text-center"
      >
       
      </div>

      <template
        v-for="message in messages"
        :key="message.id"
      >
        <div
          v-if="message.role === 'user'"
          class="flex justify-end"
        >
          <div class="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground whitespace-pre-wrap">
            {{ message.text }}
          </div>
        </div>
        <AnswerCard
          v-else
          :message="message"
          @retry="onRetry"
        />
      </template>
    </div>
  </ScrollArea>
</template>
