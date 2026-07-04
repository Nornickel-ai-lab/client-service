<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

import { useDocumentStore } from '@/entities/document/model/documentStore';
import type { DocumentItem } from '@/entities/document/model/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { ui } from '@/shared/config/ui';

const props = defineProps<{
  searchQuery?: string;
}>();

const store = useDocumentStore();
const { items, loaded, loading } = storeToRefs(store);

const filteredItems = computed(() => {
  const query = props.searchQuery?.trim().toLowerCase() ?? '';
  if (!query) {
    return items.value;
  }
  return items.value.filter((item) => {
    return item.title.toLowerCase().includes(query)
      || item.filename.toLowerCase().includes(query);
  });
});

const emptyLabel = computed(() => {
  if (items.value.length === 0) {
    return ui.emptyDocuments;
  }
  return ui.documentsSearchEmpty;
});

onMounted(async () => {
  await store.loadDocuments();
  if (store.hasProcessing) {
    store.startPolling();
  }
});

onUnmounted(() => {
  store.stopPolling();
});

const statusLabel = (status: DocumentItem['status']): string => {
  if (status === 'done') {
    return ui.statusDone;
  }
  if (status === 'failed') {
    return ui.statusFailed;
  }
  return ui.statusProcessing;
};

const statusVariant = (status: DocumentItem['status']): 'default' | 'secondary' | 'destructive' => {
  if (status === 'done') {
    return 'default';
  }
  if (status === 'failed') {
    return 'destructive';
  }
  return 'secondary';
};

const formatDate = (value: string): string => {
  return new Date(value).toLocaleString('ru-RU');
};
</script>

<template>
  <section class="flex flex-col gap-3">
    <div
      v-if="!loaded && loading"
      class="flex flex-col gap-2"
    >
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-10 w-full" />
    </div>
    <p
      v-else-if="filteredItems.length === 0"
      class="text-sm text-muted-foreground"
    >
      {{ emptyLabel }}
    </p>
    <div
      v-else
      class="overflow-hidden rounded-md border border-border"
    >
      <table class="w-full text-sm">
        <thead class="border-b border-border bg-muted/40 text-left">
          <tr>
            <th class="px-3 py-2 font-medium">
              {{ ui.documentName }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ ui.documentStatus }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ ui.documentCreated }}
            </th>
            <th class="px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.id"
            class="border-b border-border last:border-b-0"
          >
            <td class="px-3 py-2">
              <div class="font-medium">
                {{ item.title }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ item.filename }}
              </div>
              <p
                v-if="item.error_message"
                class="mt-1 text-xs text-destructive"
              >
                {{ item.error_message }}
              </p>
            </td>
            <td class="px-3 py-2">
              <Badge :variant="statusVariant(item.status)">
                {{ statusLabel(item.status) }}
              </Badge>
            </td>
            <td class="px-3 py-2 text-muted-foreground">
              {{ formatDate(item.created_at) }}
            </td>
            <td class="px-3 py-2">
              <Button
                v-if="item.status === 'done'"
                variant="link"
                class="h-auto p-0"
                as-child
              >
                <RouterLink :to="`/documents/${item.id}`">
                  {{ ui.sourceOpen }}
                </RouterLink>
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
