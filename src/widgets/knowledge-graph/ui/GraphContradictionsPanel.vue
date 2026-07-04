<script setup lang="ts">
import type { GraphContradictionDto } from '@/entities/graph/model/types';
import { ui } from '@/shared/config/ui';
import { Badge } from '@/shared/ui/badge';
import { ScrollArea } from '@/shared/ui/scroll-area';

defineProps<{
  items: GraphContradictionDto[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();

const onSelect = (id: string): void => {
  emit('select', id);
};
</script>

<template>
  <aside class="graph-contradictions">
    <div class="graph-contradictions__header">
      <h2 class="graph-contradictions__title">
        {{ ui.graphContradictionsTitle }}
      </h2>
      <Badge variant="secondary">
        {{ items.length }}
      </Badge>
    </div>
    <ScrollArea class="graph-contradictions__list">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="graph-contradictions__item"
        :class="{ 'graph-contradictions__item--active': selectedId === item.id }"
        @click="onSelect(item.id)"
      >
        <div class="graph-contradictions__item-head">
          <p class="graph-contradictions__docs">
            {{ item.doc_a_title ?? item.source }} / {{ item.doc_b_title ?? item.target }}
          </p>
          <Badge
            v-if="item.confidence != null"
            variant="outline"
            class="shrink-0"
          >
            {{ Math.round(item.confidence * 100) }}%
          </Badge>
        </div>
        <p
          v-if="item.summary"
          class="graph-contradictions__summary"
        >
          {{ item.summary }}
        </p>
        <p class="graph-contradictions__hint">
          {{ ui.graphContradictionFocus }}
        </p>
      </button>
    </ScrollArea>
  </aside>
</template>

<style scoped>
.graph-contradictions {
  display: flex;
  width: 320px;
  flex-shrink: 0;
  flex-direction: column;
  border-left: 1px solid var(--border);
  background: var(--background);
}

.graph-contradictions__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  padding: 12px 14px;
}

.graph-contradictions__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.graph-contradictions__list {
  flex: 1;
  min-height: 0;
  padding: 8px;
}

.graph-contradictions__item {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 6px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  padding: 10px 12px;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.graph-contradictions__item + .graph-contradictions__item {
  margin-top: 8px;
}

.graph-contradictions__item:hover {
  border-color: color-mix(in oklch, var(--destructive) 35%, var(--border));
}

.graph-contradictions__item--active {
  border-color: var(--destructive);
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--destructive) 40%, transparent);
}

.graph-contradictions__item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.graph-contradictions__docs {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--card-foreground);
}

.graph-contradictions__summary {
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.graph-contradictions__hint {
  font-size: 10px;
  color: var(--muted-foreground);
}
</style>
