<template>
  <div class="container">
    <h2>人脸识别</h2>
    <div class="upload-area">
      <input type="file" @change="onFileSelected" accept="image/*" class="file-input">
      <div class="upload-tip">点击或拖拽图片到此处</div>
    </div>
    <div class="content-area">
      <div class="img-box" v-if="imageUrl">
        <img :src="imageUrl" ref="imageRef" @load="detectFace">
        <canvas ref="canvasRef" class="face-canvas"></canvas>
      </div>
      <div class="loading" v-if="isLoading">
        <div class="loading-text">{{ loadingText }}</div>
      </div>
      <div class="result" v-if="detectionResult">
        {{ detectionResult }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as faceapi from 'face-api.js'

const imageUrl = ref('')
const imageRef = ref<HTMLImageElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
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
        const displaySize = { 
          width: imageRef.value.width, 
          height: imageRef.value.height 
        }
        faceapi.matchDimensions(canvasRef.value, displaySize)
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        faceapi.draw.drawDetections(canvasRef.value, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvasRef.value, resizedDetections)
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

onMounted(() => {
  loadModels()
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  border-radius: 8px;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #409EFF;
}

.file-input {
  margin-bottom: 10px;
}

.upload-tip {
  color: #666;
  font-size: 14px;
}

.content-area {
  position: relative;
}

.img-box {
  width: 400px;
  height: 600px;
  margin: 0 auto;
  position: relative;
  border: 1px solid #eee;
  overflow: hidden;
}

.img-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.face-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
}

.result {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}
</style>