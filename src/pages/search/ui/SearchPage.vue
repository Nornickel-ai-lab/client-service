<script setup lang="ts">
import SearchForm from '@/features/search/submit-query/ui/SearchForm.vue';
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue';
import SearchThread from '@/widgets/search-thread/ui/SearchThread.vue';
</script>

<template>
  <div class="mx-auto flex h-full max-w-3xl flex-col border-x border-border bg-muted/30">
    <AppHeader />
    <SearchThread />
    <SearchForm />
  </div>
</template>
