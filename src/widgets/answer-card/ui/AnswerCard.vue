<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';

import type { QueryMessage } from '@/entities/query/model/types';
import ContradictionList from '@/widgets/contradiction-list/ui/ContradictionList.vue';
import SourceList from '@/widgets/source-list/ui/SourceList.vue';
import { downloadAnswerMarkdown } from '@/shared/lib/exportAnswerMarkdown';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { ui } from '@/shared/config/ui';

const props = defineProps<{
  message: QueryMessage;
  queryText?: string;
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

const onExport = (): void => {
  if (!props.message.response) {
    return;
  }
  downloadAnswerMarkdown(props.message.response, props.queryText ?? '');
};
</script>

<template>
  <Card
    v-if="message.status === 'process'"
    class="border-border"
  >
    <CardContent class="flex items-center gap-3 py-6">
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
    v-else-if="message.response"
    class="border-border shadow-sm"
  >
    <CardHeader class="pb-2">
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {{ ui.confidence }} {{ Math.round(message.response.confidence * 100) }}%
        </Badge>
        <Badge variant="outline">
          {{ ui.performanceTotal }} {{ message.response.performance.total_time_ms }}
        </Badge>
        <Badge
          v-if="message.response.performance.embed_time_ms"
          variant="outline"
        >
          {{ ui.performanceEmbed }} {{ message.response.performance.embed_time_ms }}
        </Badge>
        <Badge variant="outline">
          {{ ui.performanceSearch }} {{ message.response.performance.es_time_ms ?? message.response.performance.search_time_ms }}
        </Badge>
        <Badge variant="outline">
          {{ ui.performanceLlm }} {{ message.response.performance.synth_time_ms ?? message.response.performance.llm_time_ms }}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          type="button"
          class="ml-auto"
          @click="onExport"
        >
          {{ ui.answerExportMarkdown }}
        </Button>
      </div>
    </CardHeader>
    <CardContent class="prose prose-sm max-w-none dark:prose-invert">
      <div v-html="html" />
    </CardContent>
    <CardFooter class="flex-col items-stretch gap-4 border-t pt-4">
      <section
        v-if="message.response.gaps.length > 0"
        class="space-y-2"
      >
        <h3 class="text-sm font-medium">
          {{ ui.answerGaps }}
        </h3>
        <ul class="list-inside list-disc text-sm text-muted-foreground">
          <li
            v-for="gap in message.response.gaps"
            :key="gap"
          >
            {{ gap }}
          </li>
        </ul>
      </section>

      <section
        v-if="message.response.recommendations.length > 0"
        class="space-y-2"
      >
        <h3 class="text-sm font-medium">
          {{ ui.answerRecommendations }}
        </h3>
        <ul class="list-inside list-disc text-sm text-muted-foreground">
          <li
            v-for="item in message.response.recommendations"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </section>

      <section
        v-if="message.response.related.experts.length > 0 || message.response.related.facilities.length > 0"
        class="space-y-2"
      >
        <h3 class="text-sm font-medium">
          {{ ui.answerExperts }} / {{ ui.answerFacilities }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <Badge
            v-for="expert in message.response.related.experts"
            :key="`e-${expert}`"
            variant="secondary"
          >
            {{ expert }}
          </Badge>
          <Badge
            v-for="facility in message.response.related.facilities"
            :key="`f-${facility}`"
            variant="outline"
          >
            {{ facility }}
          </Badge>
        </div>
      </section>

      <SourceList
        v-if="message.response.sources.length > 0"
        :sources="message.response.sources"
        :confidence="message.response.confidence"
      />
      <ContradictionList :items="message.response.contradictions ?? []" />
    </CardFooter>
  </Card>
</template>
