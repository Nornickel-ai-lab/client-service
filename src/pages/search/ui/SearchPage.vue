<script setup lang="ts">
import MainLayout from '@/app/layouts/MainLayout.vue';
import SearchForm from '@/features/search/submit-query/ui/SearchForm.vue';
import FilterPanel from '@/widgets/filter-panel/ui/FilterPanel.vue';
import SearchThread from '@/widgets/search-thread/ui/SearchThread.vue';
import { ui } from '@/shared/config/ui';
</script>

<template>
  <MainLayout>
    <div class="flex min-h-0 flex-1 flex-col">
      <header class="border-b border-border bg-background px-6 py-4">
        <h1 class="text-lg font-semibold">
          {{ ui.searchTitle }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ ui.searchHint }}
        </p>
      </header>
      <div class="border-b border-border bg-muted/20 px-6 py-4">
        <FilterPanel />
      </div>
      <SearchThread />
      <SearchForm />
    </div>
  </MainLayout>
</template>
