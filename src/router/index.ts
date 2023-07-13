import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue';
import FaceApi from '../views/faceApi/FaceApi.vue'


const routes = [
  {
    path: '/',
    component: HelloWorld
  },
  {
    path: '/face',
    component: FaceApi
  }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

  export default router