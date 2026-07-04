<script setup lang="ts">
import type { SourceItem } from '@/entities/query/model/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { ui } from '@/shared/config/ui';

defineProps<{
  sources: SourceItem[];
}>();

const openUrl = (source: SourceItem): string => {
  return source.document_url;
};
</script>

<template>
  <section v-if="sources.length > 0">
    <h3 class="mb-3 text-sm font-medium">
      {{ ui.resultsSources }}
    </h3>
    <div class="flex flex-col gap-3">
      <Card
        v-for="source in sources"
        :key="source.document_id + source.chunk_text.slice(0, 20)"
        class="border-border"
      >
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-2">
            <CardTitle class="text-sm font-medium">
              {{ source.title }}
            </CardTitle>
            <Badge variant="secondary">
              {{ Math.round(source.confidence * 100) }}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-0">
          <p class="line-clamp-3 text-sm text-muted-foreground">
            {{ source.chunk_text }}
          </p>
          <div
            v-if="source.geo || source.year"
            class="flex gap-2 text-xs text-muted-foreground"
          >
            <span v-if="source.geo">{{ source.geo }}</span>
            <Separator
              v-if="source.geo && source.year"
              orientation="vertical"
              class="h-4"
            />
            <span v-if="source.year">{{ source.year }}</span>
          </div>
          <Button
            variant="link"
            class="h-auto p-0"
            as="a"
            :href="openUrl(source)"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ ui.sourceOpen }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
