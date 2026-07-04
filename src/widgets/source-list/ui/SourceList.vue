<script setup lang="ts">
import type { SourceItem } from '@/entities/query/model/types';
import { ui } from '@/shared/config/ui';

defineProps<{
  sources: SourceItem[];
}>();

const openUrl = (source: SourceItem): string => source.document_url;
</script>

<template>
  <div
    v-if="sources.length === 0"
    class="sources sources_empty"
  />

  <section
    v-else
    class="sources sources_loaded"
  >
    <h3 class="sources__title">
      {{ ui.sourcesTitle }}
    </h3>
    <ul class="sources__list">
      <li
        v-for="source in sources"
        :key="source.document_id + source.chunk_text.slice(0, 20)"
        class="sources__item"
      >
        <div class="sources__head">
          <span class="sources__name">{{ source.title }}</span>
          <span class="sources__score">{{ Math.round(source.confidence * 100) }}%</span>
        </div>
        <p class="sources__excerpt">
          {{ source.chunk_text }}
        </p>
        <div class="sources__meta">
          <span v-if="source.geo">{{ source.geo }}</span>
          <span v-if="source.year">{{ source.year }}</span>
        </div>
        <a
          class="sources__link"
          :href="openUrl(source)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ ui.sourceOpen }}
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sources {
  margin-top: 12px;
}

.sources_empty {
  display: none;
}

.sources__title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
}

.sources__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sources__item {
  padding: 10px 0;
  border-top: 1px solid #e5e7eb;
}

.sources__item:first-child {
  border-top: none;
  padding-top: 0;
}

.sources__head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.sources__name {
  font-weight: 500;
}

.sources__score {
  font-size: 12px;
  color: #6b7280;
}

.sources__excerpt {
  margin: 0 0 6px;
  font-size: 13px;
  color: #374151;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sources__meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.sources__link {
  font-size: 13px;
}
</style>
