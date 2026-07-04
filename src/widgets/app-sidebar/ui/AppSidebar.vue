<script setup lang="ts">
import ThemeToggle from '@/features/theme/toggle/ui/ThemeToggle.vue';
import MlProviderToggle from '@/features/ml-provider/toggle/ui/MlProviderToggle.vue';
import { useUserStore } from '@/entities/user/model/userStore';
import { redirectToEsaLogin } from '@/shared/lib/authRedirect';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { ui } from '@/shared/config/ui';
import { FileUp, LogOut, Search } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

const route = useRoute();
const store = useUserStore();
const { user } = storeToRefs(store);

const roleLabel = computed(() => {
  if (user.value?.role === 'admin') {
    return ui.userRoleAdmin;
  }
  return ui.userRoleResearcher;
});

const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const onLogout = (): void => {
  store.logout();
  redirectToEsaLogin();
};
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
    <div class="border-b border-sidebar-border px-4 py-5">
      <p class="text-sm font-semibold tracking-tight">
        {{ ui.appBrand }}
      </p>
      <p
        v-if="user"
        class="mt-1 truncate text-xs text-muted-foreground"
      >
        {{ user.email }}
      </p>
      <p
        v-if="user"
        class="text-xs text-muted-foreground"
      >
        {{ roleLabel }}
      </p>
    </div>

    <nav class="flex flex-1 flex-col gap-1 p-3">
      <RouterLink
        to="/"
        class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
        :class="isActive('/') && route.path === '/' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/70'"
      >
        <Search class="size-4" />
        {{ ui.navSearch }}
      </RouterLink>
      <RouterLink
        to="/upload"
        class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
        :class="isActive('/upload') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/70'"
      >
        <FileUp class="size-4" />
        {{ ui.navUpload }}
      </RouterLink>
    </nav>

    <div class="space-y-3 border-t border-sidebar-border p-3">
      <div class="rounded-md border border-sidebar-border bg-background/40 px-3 py-2">
        <MlProviderToggle />
      </div>
      <ThemeToggle />
      <Separator />
      <Button
        variant="ghost"
        size="sm"
        class="w-full justify-start gap-2"
        type="button"
        @click="onLogout"
      >
        <LogOut class="size-4" />
        {{ ui.navLogout }}
      </Button>
    </div>
  </aside>
</template>
