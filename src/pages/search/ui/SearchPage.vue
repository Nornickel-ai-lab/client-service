<script setup lang="ts">
import SearchForm from '@/features/search/submit-query/ui/SearchForm.vue';
import MlProviderToggle from '@/features/ml-provider/toggle/ui/MlProviderToggle.vue';
import { useUserStore } from '@/entities/user/model/userStore';
import SearchThread from '@/widgets/search-thread/ui/SearchThread.vue';
import { redirectToEsaLogin } from '@/shared/lib/authRedirect';
import { Button } from '@/shared/ui/button';
import { ui } from '@/shared/config/ui';

const store = useUserStore();

const onLogout = (): void => {
  store.logout();
  redirectToEsaLogin();
};
</script>

<template>
  <div class="mx-auto flex h-full max-w-3xl flex-col border-x border-border bg-muted/30">
    <header class="flex items-center justify-between border-b border-border bg-background px-4 py-3">
      <h1 class="text-base font-semibold">
        {{ ui.navSearch }}
      </h1>
      <div class="flex items-center gap-2">
        <MlProviderToggle />
        <Button
          variant="ghost"
          size="sm"
          type="button"
          @click="onLogout"
        >
          {{ ui.navLogout }}
        </Button>
      </div>
    </header>
    <SearchThread />
    <SearchForm />
  </div>
</template>
