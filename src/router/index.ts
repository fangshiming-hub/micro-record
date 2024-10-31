import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/MapTool.vue';
import FaceApi from '../views/faceApi/FaceApi.vue';
import FullScreenVue from '../components/layout/FullScreen.vue';
import { RouteRecordRaw } from 'vue-router' ;


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: FullScreenVue,
    children: [
      {
        path: 'map',
        component: HelloWorld,
      },
      {
        path: 'face',
        component: FaceApi
      }
    ]
  },

]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

  export default router
