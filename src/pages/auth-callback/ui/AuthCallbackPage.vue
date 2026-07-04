<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useUserStore } from '@/entities/user/model/userStore';
import { redirectToEsaLogin } from '@/shared/lib/authRedirect';
import { ui } from '@/shared/config/ui';

const route = useRoute();
const router = useRouter();
const store = useUserStore();

onMounted(async () => {
  const token = route.query.access_token;
  if (typeof token !== 'string' || token.length === 0) {
    redirectToEsaLogin();
    return;
  }
  try {
    await store.acceptToken(token);
    await router.replace('/');
  } catch {
    store.clearSession();
    redirectToEsaLogin();
  }
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
    {{ ui.authCallbackProcessing }}
  </div>
</template>
