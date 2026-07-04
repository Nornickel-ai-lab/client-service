<script setup lang="ts">
import MainLayout from '@/app/layouts/MainLayout.vue';
import UploadDropzone from '@/features/upload/document/ui/UploadDropzone.vue';
import { ui } from '@/shared/config/ui';
</script>

<template>
  <MainLayout>
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header class="border-b border-border bg-background px-6 py-4">
        <h1 class="text-lg font-semibold">
          {{ ui.uploadTitle }}
        </h1>
      </header>
      <main class="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
        <UploadDropzone />
      </main>
    </div>
  </MainLayout>
</template>
