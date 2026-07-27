// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// ✅ Đảm bảo app.use(pinia) được gọi TRƯỚC app.mount('#app')
app.use(pinia)
app.mount('#app')