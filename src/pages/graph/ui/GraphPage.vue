<script setup lang="ts">
import MainLayout from '@/app/layouts/MainLayout.vue';
import { ui } from '@/shared/config/ui';
import GraphLegend from '@/widgets/knowledge-graph/ui/GraphLegend.vue';
import KnowledgeGraph from '@/widgets/knowledge-graph/ui/KnowledgeGraph.vue';
</script>

<template>
  <MainLayout>
    <div class="flex min-h-0 flex-1 flex-col">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-6 py-3">
        <h1 class="text-lg font-semibold">
          {{ ui.graphTitle }}
        </h1>
        <GraphLegend />
      </header>
      <KnowledgeGraph />
    </div>
  </MainLayout>
</template>
