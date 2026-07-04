import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/app/App.vue';
import '@/app/styles/index.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
