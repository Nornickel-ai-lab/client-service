<script setup lang="ts">
import type { ContradictionItem } from '@/entities/query/model/types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ui } from '@/shared/config/ui';

defineProps<{
  items: ContradictionItem[];
}>();
</script>

<template>
  <section
    v-if="items.length > 0"
    class="mt-4"
  >
    <h3 class="mb-3 text-sm font-medium">
      {{ ui.resultsContradictions }}
    </h3>
    <div class="flex flex-col gap-3">
      <Card
        v-for="item in items"
        :key="item.id"
        class="border-destructive/30"
      >
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-2">
            <CardTitle class="text-sm font-medium">
              {{ item.doc_a_title }} / {{ item.doc_b_title }}
            </CardTitle>
            <Badge variant="secondary">
              {{ Math.round(item.confidence * 100) }}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="pt-0 text-sm text-muted-foreground">
          {{ item.summary }}
        </CardContent>
      </Card>
    </div>
  </section>
</template>
