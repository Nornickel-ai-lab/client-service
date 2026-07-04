<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface EntityNodeData {
  title: string;
  label: string;
}

defineProps<{
  data: EntityNodeData;
  selected?: boolean;
}>();
</script>

<template>
  <div
    class="entity-graph-node"
    :class="{ 'entity-graph-node--selected': selected }"
  >
    <Handle
      type="target"
      :position="Position.Top"
      class="entity-graph-node__handle"
    />
    <div class="entity-graph-node__dot" />
    <p class="entity-graph-node__title">
      {{ data.title }}
    </p>
    <Handle
      type="source"
      :position="Position.Bottom"
      class="entity-graph-node__handle"
    />
  </div>
</template>

<style scoped>
.entity-graph-node {
  width: 96px;
  text-align: center;
  cursor: default;
  transition: opacity 0.15s ease;
}

.entity-graph-node__dot {
  width: 14px;
  height: 14px;
  margin: 0 auto;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--muted);
}

.entity-graph-node--selected .entity-graph-node__dot {
  border-color: var(--primary);
  background: color-mix(in oklch, var(--primary) 25%, transparent);
}

.entity-graph-node__title {
  margin-top: 6px;
  font-size: 10px;
  line-height: 1.25;
  color: var(--muted-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.entity-graph-node__handle {
  opacity: 0;
  width: 1px;
  height: 1px;
  min-width: 0;
  min-height: 0;
  border: 0;
  background: transparent;
}
</style>
