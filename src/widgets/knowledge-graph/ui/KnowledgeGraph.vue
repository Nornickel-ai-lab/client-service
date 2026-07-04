<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import {
  type Edge,
  type EdgeMouseEvent,
  type Node,
  type NodeMouseEvent,
  VueFlow,
} from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { fetchGraph } from '@/entities/graph/api/graphApi';
import type { GraphContradictionDto, GraphEdgeDto, GraphNodeDto } from '@/entities/graph/model/types';
import { applyForceLayout } from '@/shared/lib/graphForceLayout';
import { ui } from '@/shared/config/ui';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import DocumentGraphNode from '@/widgets/knowledge-graph/ui/DocumentGraphNode.vue';
import EntityGraphNode from '@/widgets/knowledge-graph/ui/EntityGraphNode.vue';
import GraphContradictionsPanel from '@/widgets/knowledge-graph/ui/GraphContradictionsPanel.vue';
import GraphFlowActions from '@/widgets/knowledge-graph/ui/GraphFlowActions.vue';

const router = useRouter();
const containerRef = ref<HTMLElement | null>(null);
const flowActionsRef = ref<InstanceType<typeof GraphFlowActions> | null>(null);
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
const graphEdges = ref<GraphEdgeDto[]>([]);
const loading = ref(false);
const loadError = ref<string | null>(null);
const hoverNodeId = ref<string | null>(null);
const selectedContradictionId = ref<string | null>(null);

const nodeTypes = {
  document: DocumentGraphNode,
  entity: EntityGraphNode,
};

const adjacency = ref<Map<string, Set<string>>>(new Map());

const contradictions = computed((): GraphContradictionDto[] => {
  return graphEdges.value
    .filter((edge) => {
      return edge.type === 'CONTRADICTS';
    })
    .map((edge) => {
      return edge as GraphContradictionDto;
    });
});

const buildAdjacency = (edgesList: GraphEdgeDto[]): Map<string, Set<string>> => {
  const map = new Map<string, Set<string>>();
  const addLink = (left: string, right: string): void => {
    if (!map.has(left)) {
      map.set(left, new Set());
    }
    map.get(left)?.add(right);
  };
  edgesList.forEach((edge) => {
    addLink(edge.source, edge.target);
    addLink(edge.target, edge.source);
  });
  return map;
};

const nodeDimensions = (node: GraphNodeDto): { width: number; height: number } => {
  if (node.document_id) {
    return { width: 168, height: 56 };
  }
  return { width: 96, height: 48 };
};

const buildFlowGraph = (
  graphNodes: GraphNodeDto[],
  edgesList: GraphEdgeDto[],
  width: number,
  height: number,
): void => {
  const layoutNodes = graphNodes.map((node) => {
    return {
      id: node.id,
      ...nodeDimensions(node),
    };
  });
  const positions = applyForceLayout(
    layoutNodes,
    edgesList.map((edge) => {
      return { source: edge.source, target: edge.target };
    }),
    width,
    height,
  );

  nodes.value = graphNodes.map((node) => {
    const position = positions.get(node.id) ?? { x: width / 2, y: height / 2 };
    const dimensions = nodeDimensions(node);
    return {
      id: node.id,
      type: node.document_id ? 'document' : 'entity',
      position: {
        x: position.x - dimensions.width / 2,
        y: position.y - dimensions.height / 2,
      },
      width: dimensions.width,
      height: dimensions.height,
      data: {
        title: node.title,
        label: node.label,
        documentId: node.document_id,
      },
      draggable: true,
      connectable: false,
      selectable: true,
    };
  });

  edges.value = edgesList.map((edge) => {
    const isContradiction = edge.type === 'CONTRADICTS';
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'default',
      animated: isContradiction,
      class: isContradiction ? 'graph-edge-contradicts' : 'graph-edge-link',
      style: isContradiction
        ? { stroke: 'var(--destructive)', strokeWidth: 2 }
        : { stroke: 'var(--muted-foreground)', strokeWidth: 1.5, opacity: 0.55 },
      data: {
        edgeType: edge.type,
        summary: edge.summary,
      },
    };
  });
};

const getContradictionNodeIds = (edgeId: string): string[] => {
  const edge = graphEdges.value.find((item) => {
    return item.id === edgeId;
  });
  if (!edge) {
    return [];
  }
  return [edge.source, edge.target];
};

const applyContradictionHighlight = (edgeId: string | null): void => {
  if (!edgeId) {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        style: { opacity: 1 },
      };
    });
    edges.value = edges.value.map((edge) => {
      const baseStyle = edge.style ?? {};
      const isContradiction = edge.class === 'graph-edge-contradicts';
      return {
        ...edge,
        style: {
          ...baseStyle,
          opacity: isContradiction ? 1 : baseStyle.opacity ?? 0.55,
        },
      };
    });
    return;
  }

  const activeEdge = graphEdges.value.find((item) => {
    return item.id === edgeId;
  });
  if (!activeEdge) {
    return;
  }

  const focusIds = new Set<string>([activeEdge.source, activeEdge.target]);

  nodes.value = nodes.value.map((node) => {
    return {
      ...node,
      style: {
        opacity: focusIds.has(node.id) ? 1 : 0.18,
      },
    };
  });

  edges.value = edges.value.map((edge) => {
    const baseStyle = edge.style ?? {};
    const isActive = edge.id === edgeId;
    return {
      ...edge,
      style: {
        ...baseStyle,
        opacity: isActive ? 1 : 0.1,
        strokeWidth: isActive ? 3 : baseStyle.strokeWidth,
      },
    };
  });
};

const applyHoverHighlight = (): void => {
  if (selectedContradictionId.value) {
    return;
  }

  const activeId = hoverNodeId.value;
  if (!activeId) {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        style: { opacity: 1 },
      };
    });
    edges.value = edges.value.map((edge) => {
      const baseStyle = edge.style ?? {};
      return {
        ...edge,
        style: {
          ...baseStyle,
          opacity: 1,
        },
      };
    });
    return;
  }

  const connected = adjacency.value.get(activeId) ?? new Set<string>();
  const visible = new Set<string>([activeId, ...connected]);

  nodes.value = nodes.value.map((node) => {
    return {
      ...node,
      style: {
        opacity: visible.has(node.id) ? 1 : 0.2,
      },
    };
  });

  edges.value = edges.value.map((edge) => {
    const highlighted = edge.source === activeId || edge.target === activeId;
    const baseStyle = edge.style ?? {};
    return {
      ...edge,
      style: {
        ...baseStyle,
        opacity: highlighted ? 1 : 0.15,
      },
    };
  });
};

watch(hoverNodeId, () => {
  applyHoverHighlight();
});

watch(selectedContradictionId, (edgeId) => {
  applyContradictionHighlight(edgeId);
});

const statsLabel = computed(() => {
  if (!nodes.value.length) {
    return '';
  }
  return `${nodes.value.length} · ${edges.value.length}`;
});

const load = async (): Promise<void> => {
  loading.value = true;
  loadError.value = null;
  nodes.value = [];
  edges.value = [];
  graphEdges.value = [];
  selectedContradictionId.value = null;

  try {
    const graph = await fetchGraph();
    graphEdges.value = graph.edges;
    adjacency.value = buildAdjacency(graph.edges);

    const width = containerRef.value?.clientWidth ?? 960;
    const height = containerRef.value?.clientHeight ?? 640;
    buildFlowGraph(graph.nodes, graph.edges, width, height);
  } catch {
    loadError.value = ui.graphLoadFailed;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  load();
});

const focusContradiction = (edgeId: string): void => {
  selectedContradictionId.value = edgeId;
  hoverNodeId.value = null;
  flowActionsRef.value?.focusNodes(getContradictionNodeIds(edgeId));
};

const onContradictionSelect = (edgeId: string): void => {
  if (selectedContradictionId.value === edgeId) {
    selectedContradictionId.value = null;
    return;
  }
  focusContradiction(edgeId);
};

const onNodeClick = ({ node }: NodeMouseEvent): void => {
  const documentId = node.data.documentId as string | null | undefined;
  if (documentId) {
    router.push(`/documents/${documentId}`);
  }
};

const onEdgeClick = ({ edge }: EdgeMouseEvent): void => {
  if (edge.data?.edgeType !== 'CONTRADICTS') {
    return;
  }
  focusContradiction(edge.id);
};

const onNodeMouseEnter = ({ node }: NodeMouseEvent): void => {
  if (selectedContradictionId.value) {
    return;
  }
  hoverNodeId.value = node.id;
};

const onNodeMouseLeave = (): void => {
  if (selectedContradictionId.value) {
    return;
  }
  hoverNodeId.value = null;
};

const onPaneClick = (): void => {
  hoverNodeId.value = null;
  selectedContradictionId.value = null;
};
</script>

<template>
  <div class="knowledge-graph-layout">
    <div
      ref="containerRef"
      class="knowledge-graph"
    >
      <div
        v-if="loading"
        class="knowledge-graph__overlay"
      >
        <Skeleton class="h-full w-full" />
      </div>
      <div
        v-else-if="loadError"
        class="knowledge-graph__overlay knowledge-graph__message"
      >
        <p class="text-sm text-destructive">
          {{ loadError }}
        </p>
        <Button
          variant="outline"
          size="sm"
          @click="load"
        >
          {{ ui.retry }}
        </Button>
      </div>
      <div
        v-else-if="!nodes.length"
        class="knowledge-graph__overlay knowledge-graph__message"
      >
        <p class="text-sm text-muted-foreground">
          {{ ui.graphEmpty }}
        </p>
      </div>
      <VueFlow
        v-else
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :min-zoom="0.15"
        :max-zoom="2"
        fit-view-on-init
        @node-click="onNodeClick"
        @edge-click="onEdgeClick"
        @node-mouse-enter="onNodeMouseEnter"
        @node-mouse-leave="onNodeMouseLeave"
        @pane-click="onPaneClick"
      >
        <GraphFlowActions ref="flowActionsRef" />
        <Background
          pattern-color="var(--border)"
          :gap="24"
        />
        <Controls />
        <MiniMap />
      </VueFlow>
      <p
        v-if="statsLabel && !loading && !loadError"
        class="knowledge-graph__stats"
      >
        {{ statsLabel }}
      </p>
    </div>
    <GraphContradictionsPanel
      v-if="!loading && !loadError && contradictions.length"
      :items="contradictions"
      :selected-id="selectedContradictionId"
      @select="onContradictionSelect"
    />
  </div>
</template>

<style scoped>
.knowledge-graph-layout {
  display: flex;
  min-height: 0;
  flex: 1;
}

.knowledge-graph {
  position: relative;
  min-height: 0;
  flex: 1;
  background: var(--background);
}

.knowledge-graph :deep(.vue-flow) {
  width: 100%;
  height: 100%;
}

.knowledge-graph :deep(.vue-flow__edge-path) {
  stroke-linecap: round;
}

.knowledge-graph :deep(.graph-edge-link .vue-flow__edge-path) {
  stroke: var(--muted-foreground);
  stroke-width: 1.5;
  opacity: 0.55;
}

.knowledge-graph :deep(.graph-edge-contradicts .vue-flow__edge-path) {
  stroke: var(--destructive);
  stroke-width: 2;
  opacity: 1;
}

.knowledge-graph :deep(.graph-edge-contradicts.animated .vue-flow__edge-path) {
  stroke-dasharray: 6 4;
}

.knowledge-graph__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.knowledge-graph__message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.knowledge-graph__stats {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 3;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 4px 8px;
  font-size: 11px;
  color: var(--muted-foreground);
}
</style>
