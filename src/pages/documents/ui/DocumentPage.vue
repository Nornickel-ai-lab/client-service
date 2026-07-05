<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import MainLayout from '@/app/layouts/MainLayout.vue';
import { buildDocumentFileUrl } from '@/entities/document/api/documentApi';
import { useDocumentStore } from '@/entities/document/model/documentStore';
import type { DocumentItem } from '@/entities/document/model/types';
import { ui } from '@/shared/config/ui';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

const route = useRoute();
const store = useDocumentStore();
const document = ref<DocumentItem | null>(null);
const loadError = ref<string | null>(null);
const loading = ref(false);

const isPdf = (item: DocumentItem | null = document.value): boolean => {
  return item?.filename.toLowerCase().endsWith('.pdf') ?? false;
};

const pageFromQuery = computed(() => {
  const raw = route.query.page;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null;
});

const fileViewUrl = computed(() => {
  if (!document.value) {
    return null;
  }
  const base = buildDocumentFileUrl(document.value.id);
  if (!base || !pageFromQuery.value || !isPdf(document.value)) {
    return base;
  }
  return `${base}#page=${pageFromQuery.value}`;
});

const load = async (): Promise<void> => {
  const documentId = String(route.params.id ?? '');
  if (!documentId) {
    return;
  }

  loading.value = true;
  loadError.value = null;
  document.value = null;

  const meta = await store.loadDocument(documentId);
  if (!meta) {
    loadError.value = ui.documentNotFound;
    loading.value = false;
    return;
  }
  document.value = meta;

  if (!fileViewUrl.value) {
    loadError.value = ui.documentLoadFailed;
  }
  loading.value = false;
};

watch(
  () => route.params.id,
  () => {
    load();
  },
  { immediate: true },
);
</script>

<template>
  <MainLayout>
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
      <div
        v-if="loading && !document"
        class="flex flex-col gap-2"
      >
        <Skeleton class="h-8 w-64" />
        <Skeleton class="h-96 w-full" />
      </div>
      <div
        v-else-if="loadError"
        class="flex flex-col gap-3"
      >
        <p class="text-sm text-destructive">
          {{ loadError }}
        </p>
        <Button
          variant="outline"
          size="sm"
          class="w-fit"
          @click="load"
        >
          {{ ui.retry }}
        </Button>
      </div>
      <template v-else-if="document">
        <div class="mb-4 flex items-center justify-between gap-2">
          <div>
            <h1 class="text-lg font-semibold">
              {{ document.title }}
            </h1>
            <p class="text-sm text-muted-foreground">
              {{ document.filename }}
              <span v-if="pageFromQuery"> · {{ ui.sourceLookAt }} {{ ui.sourcePage }} {{ pageFromQuery }}</span>
            </p>
          </div>
          <Button
            v-if="fileViewUrl"
            variant="outline"
            size="sm"
            as="a"
            :href="fileViewUrl"
            target="_blank"
            rel="noopener"
          >
            {{ ui.documentDownload }}
          </Button>
        </div>
        <iframe
          v-if="fileViewUrl && isPdf()"
          :key="`${fileViewUrl}-${pageFromQuery ?? 0}`"
          :src="fileViewUrl"
          class="min-h-[75vh] w-full rounded-lg border border-border bg-background"
          :title="document.title"
        />
        <p
          v-else-if="fileViewUrl"
          class="text-sm text-muted-foreground"
        >
          {{ ui.documentPreviewUnavailable }}
        </p>
      </template>
    </div>
  </MainLayout>
</template>
