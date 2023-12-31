import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Router from './router/index.js'
import { createPinia } from 'pinia'

createApp(App).use(Router).use(createPinia()).mount('#app')
