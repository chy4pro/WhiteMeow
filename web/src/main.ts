import { createApp } from 'vue'
import router from './router'
import '@unocss/reset/normalize.css'
import 'uno.css'
// import '@/utils/rem.js';
import 'ant-design-vue/dist/reset.css';
import "@/index.css";


import { createPinia } from 'pinia'

import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')