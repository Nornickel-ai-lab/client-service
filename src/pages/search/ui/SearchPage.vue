<script setup lang="ts">
import SearchForm from '@/features/search/submit-query/ui/SearchForm.vue';
import SearchThread from '@/widgets/search-thread/ui/SearchThread.vue';
import { ui } from '@/shared/config/ui';
</script>

<template>
  <div class="mx-auto flex h-full max-w-3xl flex-col border-x border-border bg-muted/30">
    <header class="border-b border-border bg-background px-4 py-3">
      <h1 class="text-base font-semibold">
        {{ ui.navSearch }}
      </h1>
    </header>
    <SearchThread />
    <SearchForm />
  </div>
</template>
