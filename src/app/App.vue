<script setup lang="ts">
import { RouterView } from 'vue-router';

import ThemeProvider from '@/app/providers/ThemeProvider.vue';
</script>

<template>
  <ThemeProvider>
    <div class="h-full bg-background">
      <RouterView />
    </div>
  </ThemeProvider>
</template>
