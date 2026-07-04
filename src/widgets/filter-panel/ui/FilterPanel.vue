<script setup lang="ts">
import { ref } from 'vue';
import { SlidersHorizontal } from 'lucide-vue-next';

import QueryConstructorModal from '@/features/search/query-constructor/ui/QueryConstructorModal.vue';
import { Button } from '@/shared/ui/button';
import { ui } from '@/shared/config/ui';

const constructorOpen = ref(false);
</script>

<template>
  <div class="flex items-center px-6 py-3">
    <Button
      variant="outline"
      size="sm"
      type="button"
      @click="constructorOpen = true"
    >
      <SlidersHorizontal class="size-4" />
      {{ ui.queryConstructorOpen }}
    </Button>
    <QueryConstructorModal v-model:open="constructorOpen" />
  </div>
</template>
