<script setup lang="ts">
import { ref } from 'vue';

import MainLayout from '@/app/layouts/MainLayout.vue';
import DocumentTable from '@/widgets/document-table/ui/DocumentTable.vue';
import { ui } from '@/shared/config/ui';
import { Input } from '@/shared/ui/input';

const searchQuery = ref('');
</script>

<template>
  <MainLayout>
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header class="border-b border-border bg-background px-6 py-4">
        <h1 class="text-lg font-semibold">
          {{ ui.documentsTitle }}
        </h1>
      </header>
      <main class="mx-auto flex w-full max-w-5xl flex-col gap-4 p-6">
        <Input
          v-model="searchQuery"
          type="search"
          :placeholder="ui.documentsSearchPlaceholder"
        />
        <DocumentTable :search-query="searchQuery" />
      </main>
    </div>
  </MainLayout>
</template>
