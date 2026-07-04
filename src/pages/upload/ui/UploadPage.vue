<script setup lang="ts">
import UploadDropzone from '@/features/upload/document/ui/UploadDropzone.vue';
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue';
import DocumentTable from '@/widgets/document-table/ui/DocumentTable.vue';
</script>

<template>
  <div class="mx-auto flex h-full max-w-4xl flex-col border-x border-border bg-muted/30">
    <AppHeader />
    <main class="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
      <UploadDropzone />
      <DocumentTable />
    </main>
  </div>
</template>
