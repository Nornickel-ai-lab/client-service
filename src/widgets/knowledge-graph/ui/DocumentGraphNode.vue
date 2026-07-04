<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface DocumentNodeData {
  title: string;
  label: string;
}

defineProps<{
  data: DocumentNodeData;
  selected?: boolean;
}>();
</script>

<template>
  <div
    class="document-graph-node"
    :class="{ 'document-graph-node--selected': selected }"
  >
    <Handle
      type="target"
      :position="Position.Top"
      class="document-graph-node__handle"
    />
    <p class="document-graph-node__title">
      {{ data.title }}
    </p>
    <p class="document-graph-node__label">
      {{ data.label }}
    </p>
    <Handle
      type="source"
      :position="Position.Bottom"
      class="document-graph-node__handle"
    />
  </div>
</template>

<style scoped>
.document-graph-node {
  width: 168px;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  padding: 8px 10px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.document-graph-node--selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}

.document-graph-node__title {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--card-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.document-graph-node__label {
  margin-top: 4px;
  font-size: 10px;
  color: var(--muted-foreground);
}

.document-graph-node__handle {
  opacity: 0;
  width: 1px;
  height: 1px;
  min-width: 0;
  min-height: 0;
  border: 0;
  background: transparent;
}
</style>
