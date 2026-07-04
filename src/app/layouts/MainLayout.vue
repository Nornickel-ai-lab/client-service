<script setup lang="ts">
import AppSidebar from '@/widgets/app-sidebar/ui/AppSidebar.vue';
</script>

<template>
  <div class="flex h-full min-h-0 bg-background">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <slot />
    </div>
  </div>
</template>
