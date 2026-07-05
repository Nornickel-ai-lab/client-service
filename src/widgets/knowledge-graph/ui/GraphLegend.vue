<script setup lang="ts">
import { ui } from '@/shared/config/ui';
</script>

<template>
  <div class="graph-legend">
    <div class="graph-legend__item">
      <span
        class="graph-legend__entity-dot"
        aria-hidden="true"
      />
      <span>{{ ui.graphLegendEntity }}</span>
    </div>
    <div class="graph-legend__item">
      <span
        class="graph-legend__document-card"
        aria-hidden="true"
      />
      <span>{{ ui.graphLegendDocument }}</span>
    </div>
    <div class="graph-legend__item">
      <svg
        class="graph-legend__line"
        width="36"
        height="10"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="5"
          x2="36"
          y2="5"
          class="graph-legend__link"
        />
      </svg>
      <span>{{ ui.graphLegendLink }}</span>
    </div>
    <div class="graph-legend__item">
      <svg
        class="graph-legend__line graph-legend__line--animated"
        width="36"
        height="10"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="5"
          x2="36"
          y2="5"
          class="graph-legend__contradiction"
        />
      </svg>
      <span>{{ ui.graphLegendContradiction }}</span>
    </div>
  </div>
</template>

<style scoped>
.graph-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.graph-legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.graph-legend__entity-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--muted);
  flex-shrink: 0;
}

.graph-legend__document-card {
  width: 28px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
  flex-shrink: 0;
}

.graph-legend__link {
  stroke: var(--muted-foreground);
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.75;
}

.graph-legend__contradiction {
  stroke: var(--destructive);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 5 4;
}

.graph-legend__line--animated .graph-legend__contradiction {
  animation: graph-legend-dash 1.2s linear infinite;
}

@keyframes graph-legend-dash {
  to {
    stroke-dashoffset: -18;
  }
}
</style>
