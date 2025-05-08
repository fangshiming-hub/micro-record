<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
          {{ tag.title }}
          <span v-if="!isAffix(tag)" class="menu-close" @click.prevent.stop="closeSelectedTag(tag)">×</span>
      </router-link>
    </div>
    <!-- 右键菜单 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

// 访问过的视图
const visitedViews = computed(() => tagsViewStore.visitedViews)

// 右键菜单相关
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<any>({})

// 判断是否是当前激活的路由
const isActive = (tag: any) => {
  return tag.path === route.path
}

// 判断是否是固定的标签
const isAffix = (tag: any) => {
  return tag.meta && tag.meta.affix
}

// 关闭选中的标签页
const closeSelectedTag = async (view: any) => {
  await tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView()
  }
}

// 关闭其他标签页
const closeOthersTags = async (view: any) => {
  if (view.path !== route.path) {
    router.push(view)
  }
  await tagsViewStore.delOthersViews(view)
}

// 关闭所有标签页
const closeAllTags = async (view: any) => {
  await tagsViewStore.delAllViews()
  if (view.meta && view.meta.affix) {
    return
  }
  toLastView()
}

// 刷新选中的标签页
const refreshSelectedTag = (view: any) => {
  tagsViewStore.delCachedView(view)
  router.replace({ path: '/redirect' + view.path })
}

// 打开右键菜单
const openMenu = (tag: any, e: MouseEvent) => {
  const menuMinWidth = 105
  const offsetLeft = e.clientX
  const offsetWidth = document.body.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  left.value = offsetLeft > maxLeft ? maxLeft : offsetLeft
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

// 跳转到最后一个标签页
const toLastView = () => {
  const latestView = visitedViews.value.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

// 点击其他区域关闭右键菜单
const closeMenu = () => {
  visible.value = false
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    console.log('route.path', route.path)
    addTags()
  }
)

// 添加标签页
const addTags = () => {
  const { name, path, meta, query } = route
  console.log('name', name, path, meta, query)
  if (name) {
    tagsViewStore.addView({
      name,
      path,
      meta,
      query
    })
  }
}

onMounted(() => {
  addTags()
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 100%;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  padding: 0 12px;

  .tags-view-wrapper {
    height: 100%;
    display: flex;
    column-gap: 12px;
    align-items: center;
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 24px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      text-decoration: none;

      

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 4px;
        }
        .menu-close{
          color: #fff;
        }
      }

      .menu-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        text-align: center;
        margin-left: 4px;
        transition: background-color .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        color: #495060;

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style> 