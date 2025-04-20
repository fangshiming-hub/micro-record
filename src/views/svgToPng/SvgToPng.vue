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
      <div v-if="!svgContent" class="upload-hint">
        <i class="upload-icon">📁</i>
        <p>将SVG文件拖拽到此处</p>
      </div>
      <!-- SVG预览区域 -->
      <div v-else class="preview-area" v-html="svgContent"></div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions" v-if="svgContent">
      <button @click="convertToPng" class="convert-btn">转换为PNG</button>
      <button @click="downloadPng" class="download-btn" :disabled="!pngUrl">下载PNG</button>
      <button @click="resetAll" class="reset-btn">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 状态变量
const isDragging = ref(false)
const svgContent = ref('')
const pngUrl = ref('')

// 处理文件拖拽
const handleDrop = async (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  
  if (file && file.type === 'image/svg+xml') {
    const reader = new FileReader()
    reader.onload = (e) => {
      svgContent.value = e.target.result
    }
    reader.readAsText(file)
  } else {
    alert('请拖拽SVG文件！')
  }
}

// 转换为PNG
const convertToPng = () => {
  const svg = document.querySelector('.preview-area svg')
  if (!svg) return

  // 创建Canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // 设置Canvas尺寸
  const svgRect = svg.getBoundingClientRect()
  canvas.width = svgRect.width
  canvas.height = svgRect.height

  // 将SVG转换为图片
  const img = new Image()
  const svgBlob = new Blob([svgContent.value], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  img.onload = () => {
    ctx.drawImage(img, 0, 0)
    pngUrl.value = canvas.toDataURL('image/png')
    URL.revokeObjectURL(url)
  }

  img.src = url
}

// 下载PNG
const downloadPng = () => {
  if (!pngUrl.value) return
  
  const link = document.createElement('a')
  link.download = 'converted.png'
  link.href = pngUrl.value
  link.click()
}

// 重置所有状态
const resetAll = () => {
  svgContent.value = ''
  pngUrl.value = ''
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

.preview-area {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-area svg {
  max-width: 100%;
  max-height: 100%;
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

.convert-btn {
  background-color: #409eff;
  color: white;
}

.download-btn {
  background-color: #67c23a;
  color: white;
}

.download-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reset-btn {
  background-color: #f56c6c;
  color: white;
}

button:hover:not(:disabled) {
  opacity: 0.8;
}
</style>
