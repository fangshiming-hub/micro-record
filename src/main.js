import { createApp } from 'vue'
import router from './router/index'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
  .use(ElementPlus)
  .use(router)
  .mount('#app')
