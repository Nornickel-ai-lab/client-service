<script setup lang="ts">
import { useRouter } from 'vue-router';

import SearchForm from '@/features/search/submit-query/ui/SearchForm.vue';
import { useUserStore } from '@/entities/user/model/userStore';
import SearchThread from '@/widgets/search-thread/ui/SearchThread.vue';
import { Button } from '@/shared/ui/button';
import { ui } from '@/shared/config/ui';

const store = useUserStore();
const router = useRouter();

const onLogout = async (): Promise<void> => {
  store.logout();
  await router.push('/login');
};
</script>

<template>
  <div class="mx-auto flex h-full max-w-3xl flex-col border-x border-border bg-muted/30">
    <header class="flex items-center justify-between border-b border-border bg-background px-4 py-3">
      <h1 class="text-base font-semibold">
        {{ ui.navSearch }}
      </h1>
      <Button
        variant="ghost"
        size="sm"
        type="button"
        @click="onLogout"
      >
        {{ ui.navLogout }}
      </Button>
    </header>
    <SearchThread />
    <SearchForm />
  </div>
</template>
