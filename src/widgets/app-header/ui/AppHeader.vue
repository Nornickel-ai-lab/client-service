<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';

import MlProviderToggle from '@/features/ml-provider/toggle/ui/MlProviderToggle.vue';
import { useUserStore } from '@/entities/user/model/userStore';
import { redirectToEsaLogin } from '@/shared/lib/authRedirect';
import { Button } from '@/shared/ui/button';
import { ui } from '@/shared/config/ui';

const route = useRoute();
const store = useUserStore();

const onLogout = (): void => {
  store.logout();
  redirectToEsaLogin();
};

const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(`${path}/`);
};
</script>

<template>
  <header class="flex items-center justify-between border-b border-border bg-background px-4 py-3">
    <nav class="flex items-center gap-4">
      <RouterLink
        to="/"
        class="text-sm font-medium transition-colors"
        :class="isActive('/') && route.path === '/' ? 'text-foreground' : 'text-muted-foreground'"
      >
        {{ ui.navSearch }}
      </RouterLink>
      <RouterLink
        to="/upload"
        class="text-sm font-medium transition-colors"
        :class="isActive('/upload') ? 'text-foreground' : 'text-muted-foreground'"
      >
        {{ ui.navUpload }}
      </RouterLink>
    </nav>
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
</template>
