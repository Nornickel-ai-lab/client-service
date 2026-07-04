<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchDocumentBlob } from '@/entities/document/api/documentApi';
import { useDocumentStore } from '@/entities/document/model/documentStore';
import type { DocumentItem } from '@/entities/document/model/types';
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { ui } from '@/shared/config/ui';

const route = useRoute();
const store = useDocumentStore();
const document = ref<DocumentItem | null>(null);
const fileUrl = ref<string | null>(null);
const loadError = ref<string | null>(null);

const load = async (): Promise<void> => {
  const documentId = String(route.params.id ?? '');
  if (!documentId) {
    return;
  }
  loadError.value = null;
  document.value = await store.loadDocument(documentId);
  if (!document.value) {
    loadError.value = ui.documentNotFound;
    return;
  }
  try {
    const blob = await fetchDocumentBlob(documentId);
    if (fileUrl.value) {
      URL.revokeObjectURL(fileUrl.value);
    }
    fileUrl.value = URL.createObjectURL(blob);
  } catch {
    loadError.value = ui.documentLoadFailed;
  }
};

onMounted(() => {
  load();
});

onUnmounted(() => {
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value);
  }
});

const isPdf = (): boolean => {
  return document.value?.filename.toLowerCase().endsWith('.pdf') ?? false;
};
</script>

<template>
  <div class="mx-auto flex h-full max-w-5xl flex-col border-x border-border bg-muted/30">
    <AppHeader />
    <main class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <div
        v-if="!document && !loadError"
        class="flex flex-col gap-2"
      >
        <Skeleton class="h-8 w-64" />
        <Skeleton class="h-96 w-full" />
      </div>
      <p
        v-else-if="loadError"
        class="text-sm text-destructive"
      >
        {{ loadError }}
      </p>
      <template v-else-if="document">
        <div class="flex items-center justify-between gap-2">
          <div>
            <h1 class="text-base font-semibold">
              {{ document.title }}
            </h1>
            <p class="text-sm text-muted-foreground">
              {{ document.filename }}
            </p>
          </div>
          <Button
            v-if="fileUrl"
            variant="outline"
            size="sm"
            as="a"
            :href="fileUrl"
            :download="document.filename"
          >
            {{ ui.documentDownload }}
          </Button>
        </div>
        <iframe
          v-if="fileUrl && isPdf()"
          :src="fileUrl"
          class="min-h-[70vh] w-full rounded-md border border-border bg-background"
          :title="document.title"
        />
        <p
          v-else-if="fileUrl"
          class="text-sm text-muted-foreground"
        >
          {{ ui.documentPreviewUnavailable }}
        </p>
      </template>
    </main>
  </div>
</template>
