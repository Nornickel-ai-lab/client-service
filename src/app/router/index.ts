import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/entities/user/model/userStore';
import AuthCallbackPage from '@/pages/auth-callback/ui/AuthCallbackPage.vue';
import DashboardPage from '@/pages/dashboard/ui/DashboardPage.vue';
import DocumentPage from '@/pages/documents/ui/DocumentPage.vue';
import DocumentsListPage from '@/pages/documents/ui/DocumentsListPage.vue';
import GraphPage from '@/pages/graph/ui/GraphPage.vue';
import SearchPage from '@/pages/search/ui/SearchPage.vue';
import UploadPage from '@/pages/upload/ui/UploadPage.vue';
import { redirectToEsaLogin } from '@/shared/lib/authRedirect';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth/callback',
      component: AuthCallbackPage,
      meta: { public: true },
    },
    {
      path: '/login',
      beforeEnter: (): boolean => {
        redirectToEsaLogin();
        return false;
      },
      component: AuthCallbackPage,
      meta: { public: true },
    },
    {
      path: '/',
      component: SearchPage,
    },
    {
      path: '/upload',
      component: UploadPage,
    },
    {
      path: '/graph',
      component: GraphPage,
    },
    {
      path: '/dashboard',
      component: DashboardPage,
    },
    {
      path: '/documents',
      component: DocumentsListPage,
    },
    {
      path: '/documents/:id',
      component: DocumentPage,
    },
  ],
});

router.beforeEach(async (to) => {
  const store = useUserStore();
  if (to.meta.public) {
    return true;
  }
  if (!store.isAuthenticated()) {
    redirectToEsaLogin();
    return false;
  }
  if (!store.user) {
    try {
      await store.loadProfile();
    } catch {
      store.clearSession();
      redirectToEsaLogin();
      return false;
    }
  }
  return true;
});
