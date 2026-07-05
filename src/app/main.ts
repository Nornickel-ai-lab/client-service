import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/app/App.vue';
import ThemeProvider from '@/app/providers/ThemeProvider.vue';
import { router } from '@/app/router';
import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import '@/app/styles/index.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.component('ThemeProvider', ThemeProvider);

void useMlProviderStore(pinia).loadProviders();

app.mount('#app');
