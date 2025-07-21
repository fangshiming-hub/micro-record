import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import MapTool from '../components/MapTool.vue';
import FaceApi from '../views/faceApi/FaceApi.vue';
import MapTool from '../views/map/MapTool.vue';
import Home from '../views/home/home.vue';
import SvgToPng from '../views/svgToPng/SvgToPng.vue';
import GridLayout from '../views/grid/GridLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index.vue')
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    name: 'Home',
    meta: {
      title: '首页',
      affix: true,
      keepAlive: true
    }
  },
  {
    path: '/map',
    component: MapTool,
    name: 'MapTool',
    meta: {
      title: '地图',
      affix: false,
      keepAlive: true
    }
  },
  {
    path: '/face',
    component: FaceApi,
    name: 'FaceApi',
    meta: {
      title: '人脸识别',
      affix: false,
      keepAlive: true
    }
  },
  {
    path: '/svgToPng',
    component: SvgToPng,
    name: 'SvgToPng',
    meta: {
      title: 'svg转png',
      affix: false,
      keepAlive: true
    }
  },
  {
    path: '/grid',
    component: GridLayout,
    name: 'GridLayout',
    meta: {
      title: 'Grid网格布局',
      affix: false,
      keepAlive: true
    }
  }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

  export default router
