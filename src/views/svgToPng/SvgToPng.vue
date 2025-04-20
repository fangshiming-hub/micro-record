<template>
  <div class="svg-to-png-container">
    <!-- 拖拽区域 -->
    <div 
      class="drop-zone"
      @dragover.prevent
      @drop.prevent="handleDrop"
      :class="{ 'dragging': isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
    >
      <div v-if="files.length === 0" class="upload-hint">
        <i class="upload-icon">📁</i>
        <p>将SVG文件拖拽到此处</p>
        <p class="sub-hint">支持批量上传</p>
      </div>
      <!-- 文件列表 -->
      <div v-else class="files-list">
        <div v-for="(file, index) in files" :key="index" class="file-item">
          <div class="file-preview" v-html="file.svgContent"></div>
          <div class="file-info">
            <span class="file-name">{{ file.name }}</span>
            <div class="file-status">
              <span v-if="file.converting" class="status converting">转换中...</span>
              <span v-else-if="file.pngUrl" class="status converted">已转换</span>
              <span v-else class="status pending">待转换</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions" v-if="files.length > 0">
      <button @click="convertAllToPng" class="convert-btn" :disabled="isConverting">
        {{ isConverting ? '转换中...' : '全部转换为PNG' }}
      </button>
      <button @click="downloadFiles" class="download-btn" :disabled="!hasConvertedFiles">
        {{ files.length > 1 ? '打包下载全部' : '下载PNG' }}
      </button>
      <button @click="resetAll" class="reset-btn">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import JSZip from 'jszip'

// 状态变量
const isDragging = ref(false)
const files = ref([])
const isConverting = ref(false)

// 计算属性
const hasConvertedFiles = computed(() => {
  return files.value.some(file => file.pngUrl)
})

// 处理文件拖拽
const handleDrop = async (event) => {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files)
  
  // 过滤出SVG文件
  const svgFiles = droppedFiles.filter(file => file.type === 'image/svg+xml')
  
  if (svgFiles.length === 0) {
    alert('请拖拽SVG文件！')
    return
  }

  // 读取每个SVG文件
  for (const file of svgFiles) {
    const reader = new FileReader()
    reader.onload = (e) => {
      files.value.push({
        name: file.name,
        svgContent: e.target.result,
        pngUrl: '',
        converting: false
      })
    }
    reader.readAsText(file)
  }
}

// 转换单个SVG为PNG
const convertToPng = async (file) => {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    container.innerHTML = file.svgContent
    const svg = container.querySelector('svg')
    
    if (!svg) {
      resolve(null)
      return
    }

    // 创建Canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // 获取SVG的viewBox属性或设置默认尺寸
    let width = 800
    let height = 600
    
    if (svg.getAttribute('viewBox')) {
      const [, , w, h] = svg.getAttribute('viewBox').split(' ').map(Number)
      width = w
      height = h
    }
    
    canvas.width = width
    canvas.height = height

    // 将SVG转换为图片
    const img = new Image()
    const svgBlob = new Blob([file.svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      const pngUrl = canvas.toDataURL('image/png')
      URL.revokeObjectURL(url)
      resolve(pngUrl)
    }

    img.src = url
  })
}

// 转换所有文件
const convertAllToPng = async () => {
  if (isConverting.value) return
  isConverting.value = true

  try {
    for (const file of files.value) {
      if (!file.pngUrl) {
        file.converting = true
        file.pngUrl = await convertToPng(file)
        file.converting = false
      }
    }
  } finally {
    isConverting.value = false
  }
}

// 下载文件（区分单文件和多文件）
const downloadFiles = async () => {
  // 获取已转换的文件
  const convertedFiles = files.value.filter(file => file.pngUrl)
  
  // 如果只有一个文件，直接下载
  if (convertedFiles.length === 1) {
    const file = convertedFiles[0]
    const link = document.createElement('a')
    link.href = file.pngUrl
    link.download = file.name.replace('.svg', '.png')
    link.click()
    return
  }
  
  // 多个文件，使用zip打包下载
  const zip = new JSZip()
  
  // 添加所有已转换的PNG文件到zip
  convertedFiles.forEach(file => {
    const base64Data = file.pngUrl.replace(/^data:image\/png;base64,/, '')
    const fileName = file.name.replace('.svg', '.png')
    zip.file(fileName, base64Data, { base64: true })
  })
  
  // 生成并下载zip文件
  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const link = document.createElement('a')
  link.href = url
  link.download = 'converted_images.zip'
  link.click()
  URL.revokeObjectURL(url)
}

// 重置所有状态
const resetAll = () => {
  files.value = []
  isConverting.value = false
}
</script>

<style scoped>
.svg-to-png-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.dragging {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.upload-hint {
  text-align: center;
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.sub-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.files-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #fff;
}

.file-preview {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview svg {
  max-width: 100%;
  max-height: 100%;
}

.file-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-size: 14px;
  color: #333;
}

.file-status {
  font-size: 12px;
}

.status {
  padding: 2px 6px;
  border-radius: 3px;
}

.status.converting {
  background-color: #e6a23c;
  color: white;
}

.status.converted {
  background-color: #67c23a;
  color: white;
}

.status.pending {
  background-color: #909399;
  color: white;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.convert-btn {
  background-color: #409eff;
  color: white;
}

.download-btn {
  background-color: #67c23a;
  color: white;
}

.reset-btn {
  background-color: #f56c6c;
  color: white;
}

button:hover:not(:disabled) {
  opacity: 0.8;
}
</style>
