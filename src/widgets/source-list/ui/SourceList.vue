<script setup lang="ts">
import { RouterLink } from 'vue-router';

import type { SourceItem } from '@/entities/query/model/types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { ui } from '@/shared/config/ui';
import { formatGeoLabel } from '@/shared/lib/formatDomainLabels';

defineProps<{
  sources: SourceItem[];
  confidence: number;
}>();

const documentLink = (source: SourceItem): string | { path: string; query?: { page: string } } => {
  if (source.page_num) {
    return {
      path: `/documents/${source.document_id}`,
      query: { page: String(source.page_num) },
    };
  }
  return `/documents/${source.document_id}`;
};
</script>

<template>
  <section>
    <h3 class="mb-3 text-sm font-medium">
      {{ ui.resultsSources }}
    </h3>
    <p
      v-if="sources.length === 0"
      class="rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground"
    >
      {{ confidence > 0.5 ? ui.sourcesRequired : ui.emptySources }}
    </p>
    <div
      v-else
      class="grid gap-3 lg:grid-cols-2"
    >
      <Card
        v-for="source in sources"
        :key="source.document_id"
        class="border-border"
      >
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-2">
            <CardTitle class="text-sm font-medium leading-snug">
              <RouterLink
                :to="documentLink(source)"
                class="hover:underline"
              >
                {{ source.title }}
              </RouterLink>
            </CardTitle>
          </div>
          <div
            v-if="source.page_label"
            class="mt-2 flex items-center gap-2"
          >
            <span class="text-xs text-muted-foreground">
              {{ ui.sourceLookAt }}
            </span>
            <Badge variant="outline">
              {{ source.page_label }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-0">
          <blockquote class="border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-muted-foreground">
            {{ source.chunk_text }}
          </blockquote>
          <div
            v-if="source.geo || source.year"
            class="flex gap-2 text-xs text-muted-foreground"
          >
            <span v-if="source.geo">{{ formatGeoLabel(source.geo) }}</span>
            <Separator
              v-if="source.geo && source.year"
              orientation="vertical"
              class="h-4"
            />
            <span v-if="source.year">{{ source.year }}</span>
          </div>
          <RouterLink
            :to="documentLink(source)"
            class="text-sm text-primary underline-offset-4 hover:underline"
          >
            {{ source.page_num ? ui.sourceOpenAtPage : ui.sourceOpen }}
          </RouterLink>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
