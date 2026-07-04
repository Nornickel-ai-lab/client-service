import { createRouter, createWebHistory } from 'vue-router';

import SearchPage from '@/pages/search/ui/SearchPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: SearchPage,
    },
  ],
});
