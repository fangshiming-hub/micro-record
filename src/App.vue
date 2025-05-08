<template>
  <div class="app-container">
    <div class="app-header">
      <tags-view />
    </div>
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
        <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTagsViewStore } from '@/stores/tagsView.ts'
import TagsView from '@/components/TagsView/index.vue'

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<style lang="scss">
.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .app-header {
    height: 60px;
    background-color: #000;
  }
  .app-content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
