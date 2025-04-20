<template>
  <div class="home-container">
    <h1 class="title">应用功能列表</h1>
    <div class="route-buttons">
      <el-button 
        v-for="route in routes" 
        :key="route.path" 
        type="primary" 
        @click="navigateTo(route.path)"
        class="route-button"
      >
        {{ route.name }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const routes = ref([
  { path: '/map', name: '地图工具' },
  { path: '/face', name: '人脸识别' },
  { path: '/svgToPng', name: 'svg转png' },
  // 可以根据需要添加更多路由
]);

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.title {
  margin-bottom: 30px;
  color: #409EFF;
}

.route-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 800px;
}

.route-button {
  min-width: 150px;
  height: 50px;
  font-size: 16px;
}
</style>
