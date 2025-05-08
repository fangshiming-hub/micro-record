<template>
  <div class="container">
    <h2 class="page-title">人脸识别系统</h2>
    
    <!-- 左侧操作区 -->
    <div class="main-content">
      <div class="left-panel">
        <div class="upload-area">
          <div class="section-title">图片上传</div>
          <div class="button-group">
            <input type="file" @change="onFileSelected" accept="image/*" class="file-input" ref="fileInput">
            <button class="reset-btn" @click="resetUpload" :disabled="!imageUrl">
              <i class="reset-icon">↺</i>重置
            </button>
            <button class="paste-btn" @click="pasteImage">
              <i class="paste-icon">📋</i>从剪贴板粘贴
            </button>
          </div>
          <div class="upload-tip">支持点击上传、拖拽或 Ctrl+V 粘贴图片</div>
        </div>
        
        <div class="action-area" v-if="imageUrl">
          <button class="detect-btn" @click="detectFace" :disabled="isLoading">
            <i class="detect-icon">🔍</i>开始人脸检测
          </button>
        </div>
        
        <div class="result-area">
          <div class="loading" v-if="isLoading">
            <div class="loading-text">{{ loadingText }}</div>
          </div>
          <div class="result" v-if="detectionResult">
            {{ detectionResult }}
          </div>
        </div>
      </div>
      
      <!-- 右侧预览区 -->
      <div class="right-panel">
        <div class="preview-title">图片预览</div>
        <div class="preview-container">
          <div class="img-box" v-if="imageUrl">
            <img :src="imageUrl" ref="imageRef">
            <canvas ref="canvasRef" class="face-canvas"></canvas>
          </div>
          <div class="empty-preview" v-else>
            <div class="empty-text">请先上传图片</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts"> 
export default {
  name: 'FaceApi'
}
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as faceapi from 'face-api.js'

const imageUrl = ref('')
const imageRef = ref<HTMLImageElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const detectionResult = ref('')
const isLoading = ref(false)
const loadingText = ref('')
const isModelLoaded = ref(false)

const loadModels = async () => {
  try {
    isLoading.value = true
    loadingText.value = '正在加载人脸识别模型...'
    
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ])
    
    isModelLoaded.value = true
    loadingText.value = '模型加载完成'
  } catch (error) {
    console.error('模型加载失败:', error)
    loadingText.value = '模型加载失败，请刷新页面重试'
  } finally {
    isLoading.value = false
  }
}

const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  if (!file.type.includes('image/')) {
    alert('请选择图片文件')
    return
  }
  
  imageUrl.value = URL.createObjectURL(file)
}

const detectFace = async () => {
  if (!imageRef.value || !isModelLoaded.value) return
  
  try {
    isLoading.value = true
    loadingText.value = '正在进行人脸检测...'
    
    const detections = await faceapi.detectAllFaces(imageRef.value)
      .withFaceLandmarks()
      .withFaceExpressions()
    
    if (detections.length > 0) {
      detectionResult.value = `检测到 ${detections.length} 张人脸`
      
      if (canvasRef.value && imageRef.value) {
        // 获取图片的原始尺寸和显示尺寸
        const originalSize = {
          width: imageRef.value.naturalWidth,
          height: imageRef.value.naturalHeight
        }
        
        const displaySize = {
          width: imageRef.value.clientWidth,
          height: imageRef.value.clientHeight
        }

        // 计算缩放比例
        const scale = Math.min(
          displaySize.width / originalSize.width,
          displaySize.height / originalSize.height
        )

        // 计算实际显示尺寸
        const actualDisplaySize = {
          width: Math.round(originalSize.width * scale),
          height: Math.round(originalSize.height * scale)
        }

        // 计算居中偏移
        const offsetX = Math.round((displaySize.width - actualDisplaySize.width) / 2)
        const offsetY = Math.round((displaySize.height - actualDisplaySize.height) / 2)
        
        // 设置canvas尺寸与容器相同
        canvasRef.value.width = displaySize.width
        canvasRef.value.height = displaySize.height
        
        // 获取绘图上下文并进行变换
        const ctx = canvasRef.value.getContext('2d')
        if (ctx) {
          // 清除之前的内容
          ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
          
          // 移动到居中位置
          ctx.translate(offsetX, offsetY)
          
          // 缩放检测结果
          const resizedDetections = faceapi.resizeResults(detections, {
            width: actualDisplaySize.width,
            height: actualDisplaySize.height
          })
          
          // 绘制检测结果
          faceapi.draw.drawDetections(canvasRef.value, resizedDetections)
          faceapi.draw.drawFaceLandmarks(canvasRef.value, resizedDetections)
          
          // 重置变换
          ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
      }
    } else {
      detectionResult.value = '未检测到人脸'
    }
  } catch (error) {
    console.error('人脸检测失败:', error)
    detectionResult.value = '人脸检测失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 重置上传
const resetUpload = () => {
  imageUrl.value = ''
  detectionResult.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

// 从剪贴板粘贴图片
const pasteImage = async () => {
  try {
    // 创建一个隐藏的文本框来触发粘贴事件
    const textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.left = '-99999px'
    document.body.appendChild(textArea)
    textArea.focus()
    
    // 触发粘贴命令
    document.execCommand('paste')
    
    // 获取剪贴板数据
    const items = (event as ClipboardEvent)?.clipboardData?.items
    if (!items) {
      alert('无法访问剪贴板，请使用 Ctrl+V 快捷键尝试粘贴')
      document.body.removeChild(textArea)
      return
    }
    
    // 查找图片类型的数据
    let found = false
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()
        if (blob) {
          imageUrl.value = URL.createObjectURL(blob)
          found = true
          break
        }
      }
    }
    
    if (!found) {
      alert('剪贴板中未找到图片')
    }
    
    // 清理临时元素
    document.body.removeChild(textArea)
  } catch (error) {
    console.error('从剪贴板读取失败:', error)
    alert('从剪贴板读取失败，请使用 Ctrl+V 快捷键尝试粘贴')
  }
}

// 添加全局粘贴事件监听
const handleGlobalPaste = async (e: ClipboardEvent) => {
  // 阻止默认粘贴行为
  e.preventDefault()
  
  try {
    // 获取剪贴板数据
    const items = e.clipboardData?.items
    if (!items) return
    
    // 查找图片类型的数据
    let found = false
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()
        if (blob) {
          imageUrl.value = URL.createObjectURL(blob)
          found = true
          break
        }
      }
    }
    
    if (!found && items.length > 0) {
      alert('剪贴板中未找到图片')
    }
  } catch (error) {
    console.error('粘贴处理失败:', error)
    alert('粘贴处理失败，请重试')
  }
}

// 监听窗口大小变化，重新进行检测
let resizeTimeout: number | null = null
const handleResize = () => {
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout)
  }
  resizeTimeout = window.setTimeout(() => {
    if (imageUrl.value && !isLoading.value) {
      detectFace()
    }
  }, 300)
}

onMounted(() => {
  loadModels()
  // 添加全局粘贴事件监听
  document.addEventListener('paste', handleGlobalPaste)
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

// 在组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('paste', handleGlobalPaste)
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout)
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-title {
  text-align: center;
  color: #303133;
  margin-bottom: 30px;
  font-size: 24px;
}

.main-content {
  display: flex;
  gap: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.left-panel {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

.section-title,
.preview-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.upload-area {
  background-color: #f8f9fb;
  padding: 20px;
  border-radius: 8px;
  border: 2px dashed #dcdfe6;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #409EFF;
  background-color: #f5f7fa;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.file-input {
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.reset-btn,
.paste-btn,
.detect-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  width: 100%;
}

.reset-btn {
  background-color: #f56c6c;
  color: white;
}

.paste-btn {
  background-color: #409EFF;
  color: white;
}

.detect-btn {
  background-color: #67c23a;
  color: white;
  font-size: 16px;
  padding: 12px 20px;
}

.reset-btn:hover,
.paste-btn:hover,
.detect-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.reset-btn:disabled,
.paste-btn:disabled,
.detect-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
  transform: none;
}

.upload-tip {
  color: #909399;
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
}

.preview-container {
  background-color: #f8f9fb;
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-box {
  width: 100%;
  height: 600px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  overflow: hidden;
}

.img-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

.face-canvas {
  position: absolute;
  pointer-events: none;
}

.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
  width: 100%;
  color: #909399;
  font-size: 16px;
  background-color: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
}

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 25px;
  border-radius: 4px;
  z-index: 1000;
}

.result {
  text-align: center;
  padding: 15px;
  background-color: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  font-size: 15px;
}

.reset-icon,
.paste-icon,
.detect-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-panel {
    flex: none;
    width: 100%;
  }
  
  .right-panel {
    width: 100%;
  }
}
</style>