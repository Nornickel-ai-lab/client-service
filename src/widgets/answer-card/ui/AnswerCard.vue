<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';

import type { QueryMessage } from '@/entities/query/model/types';
import SourceList from '@/widgets/source-list/ui/SourceList.vue';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { ui } from '@/shared/config/ui';

const props = defineProps<{
  message: QueryMessage;
}>();

const emit = defineEmits<{
  retry: [id: string];
}>();

const md = new MarkdownIt();

const html = computed(() => {
  if (!props.message.response?.answer_md) {
    return '';
  }
  return md.render(props.message.response.answer_md);
});

const onRetry = (): void => {
  emit('retry', props.message.id);
};
</script>

<template>
  <Card
    v-if="message.status === 'idle'"
    class="border-dashed bg-muted/40"
  >
    <CardContent class="py-4 text-sm text-muted-foreground">
      {{ ui.emptyResults }}
    </CardContent>
  </Card>

  <Card
    v-else-if="message.status === 'process'"
    class="border-border"
  >
    <CardContent class="flex items-center gap-3 py-4">
      <Skeleton class="h-4 w-4 rounded-full" />
      <span class="text-sm text-muted-foreground">{{ ui.statusProcessing }}</span>
    </CardContent>
  </Card>

  <Card
    v-else-if="message.status === 'error'"
    class="border-destructive/40 bg-destructive/5"
  >
    <CardContent class="py-4">
      <p class="mb-3 text-sm text-destructive">
        {{ message.error ?? ui.statusFailed }}
      </p>
      <Button
        variant="outline"
        size="sm"
        type="button"
        @click="onRetry"
      >
        {{ ui.retry }}
      </Button>
    </CardContent>
  </Card>

  <Card
    v-else
    class="border-border"
  >
    <CardHeader class="pb-2">
      <div
        v-if="message.response"
        class="flex flex-wrap gap-2"
      >
        <Badge variant="secondary">
          {{ ui.confidence }} {{ Math.round(message.response.confidence * 100) }}%
        </Badge>
        <Badge variant="outline">
          {{ ui.performanceTotal }} {{ message.response.performance.total_time_ms }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="prose prose-sm max-w-none dark:prose-invert">
      <div v-html="html" />
    </CardContent>
    <CardFooter
      v-if="message.response"
      class="flex-col items-stretch border-t pt-4"
    >
      <SourceList :sources="message.response.sources" />
    </CardFooter>
  </Card>
</template>
