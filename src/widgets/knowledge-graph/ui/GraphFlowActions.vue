<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core';

const { fitView } = useVueFlow();

const focusNodes = (nodeIds: string[]): void => {
  if (!nodeIds.length) {
    return;
  }
  fitView({
    nodes: nodeIds,
    padding: 0.35,
    duration: 350,
  });
};

defineExpose({
  focusNodes,
});
</script>

<template>
  <span class="hidden" />
</template>
