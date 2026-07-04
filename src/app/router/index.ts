import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/entities/user/model/userStore';
import LoginPage from '@/pages/login/ui/LoginPage.vue';
import SearchPage from '@/pages/search/ui/SearchPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: LoginPage,
      meta: { public: true },
    },
    {
      path: '/',
      component: SearchPage,
    },
  ],
});

router.beforeEach(async (to) => {
  const store = useUserStore();
  if (to.meta.public) {
    if (to.path === '/login' && store.isAuthenticated()) {
      return '/';
    }
    return true;
  }
  if (!store.isAuthenticated()) {
    return '/login';
  }
  if (!store.user) {
    try {
      await store.loadProfile();
    } catch {
      store.clearSession();
      return '/login';
    }
  }
  return true;
});
