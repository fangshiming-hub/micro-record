<template>
  <div class="map-tool">
    <div id="map" class="map"></div>
    <div class="tool-wrap">
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :before-upload="uploadFile"
        :on-change="uploadFile"
        :on-success="uploadFile"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        class="upload-demo"
        accept=".csv"
      >
        <template #trigger>
          <el-button type="primary">选择csv文件</el-button>
        </template>
      </el-upload>
    </div>

  </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue';
import gcoord from 'gcoord';
import { read, utils } from 'xlsx'
import { pointData } from './testData'
import { createClusterManager } from './clusterData'

const uploadRef = ref()
const useCluster = ref(true) // 是否使用聚合功能
const currentZoom = ref(13) // 当前地图缩放级别
const clusterMinZoom = ref(15) // 开启聚合的最小缩放级别
let clusterManager = null

function uploadFile(file) {
  console.log(file)
  clearMap();
  if (file.raw) {
    const fileReader = new FileReader();
    fileReader.onload = (ev) => {
      const result = ev.target.result;
      const csv = read(result, {type: 'buffer'});
      const points = utils.sheet_to_json(csv.Sheets.Sheet1);
      drawLine(points)
    }
    fileReader.readAsArrayBuffer(file.raw)
  }
}

function drawLine(points) {
  const path = points.map(item => {
    return gcoord.transform([item.x, item.y], gcoord.WGS84, gcoord.GCJ02)
  })
  const polyline = new AMap.Polyline({
    path: path,
    isOutline: true,
    outlineColor: '#ffeeff',
    borderWeight: 3,
    strokeColor: "#3366FF",
    strokeOpacity: 1,
    strokeWeight: 6,
    // 折线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    strokeDasharray: [10, 5],
    lineJoin: 'round',
    lineCap: 'round',
    zIndex: 50,
  })
  map.add(polyline);
  map.setFitView(polyline)
}

// 切换聚合模式
function toggleClusterMode() {
  useCluster.value = !useCluster.value;
  clearMap();
  
  if (useCluster.value) {
    // 使用聚合模式
    renderClusteredPoints();
  } else {
    // 使用普通模式
    drawPoints(pointData);
  }
}

// 检查是否应该使用聚合
// 当缩放级别小于或等于指定的最小聚合缩放级别时启用聚合
function shouldUseCluster() {
  // 如果用户关闭了聚合功能，直接返回 false
  if (!useCluster.value) return false;
  
  // 比较缩放级别，注意浮点数的比较
  return parseFloat(currentZoom.value) <= parseFloat(clusterMinZoom.value);
}

// 保存上一次的状态以避免重复更新
let lastClusterState = null;

// 更新地图显示
function updateMapDisplay() {
  // 计算当前是否应该聚合
  const shouldCluster = shouldUseCluster();
  
  // 如果状态没有变化，则不更新
  if (lastClusterState === shouldCluster) {
    return;
  }
  
  // 更新状态
  lastClusterState = shouldCluster;
  
  // 清除地图
  clearMap();
  
  // 根据状态绘制点
  if (shouldCluster) {
    renderClusteredPoints();
  } else {
    drawPoints(pointData);
  }
}

// 渲染聚合点
function renderClusteredPoints() {
  if (!clusterManager) {
    // 初始化聚合管理器
    clusterManager = createClusterManager(pointData, {
      // 强制最小点数为1，确保即使只有一个点也使用聚合样式
      minPoints: 1
    });
  }
  
  // 渲染聚合点
  clusterManager.renderClusters(
    map,
    handleClusterClick,
    handlePointClick
  );
}

// 处理点击聚合点
function handleClusterClick(clusterId, marker, cluster) {
  // 获取状态计数
  const statusCounts = cluster.properties.statusCounts || {
    '在线': 0,
    '离线': 0,
    '报警': 0,
    '超速': 0
  };
  
  // 创建信息窗体显示详细统计信息
  const infoWindow = new AMap.InfoWindow({
    content: `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin-top: 0; margin-bottom: 10px;">聚合点详情</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div style="text-align: center; padding: 5px; background-color: #2196F3; color: white; border-radius: 4px; flex: 1; margin-right: 5px;">
            <div>在线</div>
            <div style="font-size: 16px; font-weight: bold;">${statusCounts['在线']}</div>
          </div>
          <div style="text-align: center; padding: 5px; background-color: #9E9E9E; color: white; border-radius: 4px; flex: 1; margin-right: 5px;">
            <div>离线</div>
            <div style="font-size: 16px; font-weight: bold;">${statusCounts['离线']}</div>
          </div>
          <div style="text-align: center; padding: 5px; background-color: #F44336; color: white; border-radius: 4px; flex: 1; margin-right: 5px;">
            <div>报警</div>
            <div style="font-size: 16px; font-weight: bold;">${statusCounts['报警']}</div>
          </div>
          <div style="text-align: center; padding: 5px; background-color: #FF9800; color: white; border-radius: 4px; flex: 1;">
            <div>超速</div>
            <div style="font-size: 16px; font-weight: bold;">${statusCounts['超速']}</div>
          </div>
        </div>
        <button id="expandCluster" style="width: 100%; padding: 8px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">展开聚合点</button>
      </div>
    `,
    offset: new AMap.Pixel(0, -30)
  });
  
  // 在标记位置打开信息窗体
  infoWindow.open(map, marker.getPosition());
  
  // 添加点击事件到展开按钮
  setTimeout(() => {
    const expandButton = document.getElementById('expandCluster');
    if (expandButton) {
      expandButton.onclick = () => {
        infoWindow.close();
        // 展开聚合点
        clusterManager.expandCluster(clusterId, map, handlePointClick);
      };
    }
  }, 100);
}

// 处理点击单个点
function handlePointClick(point, marker, cluster) {
  // 创建信息窗体
  const infoWindow = new AMap.InfoWindow({
    content: `
      <div style="padding: 10px;">
        <p>经度: ${point.longitude.toFixed(6)}</p>
        <p>纬度: ${point.latitude.toFixed(6)}</p>
        <p>数值: ${point.value}</p>
        <p>状态: ${point.status}</p>
      </div>
    `,
    offset: new AMap.Pixel(0, -30)
  });
  
  // 在标记位置打开信息窗体
  infoWindow.open(map, marker.getPosition());
}

function clearMap() {
  map && map.clearMap();
}

function drawPoints(points) {
  if (!map) return;
  
  // 创建点标记
  points.forEach(point => {
    // 转换坐标系（WGS84 到 GCJ02）
    const position = gcoord.transform(
      [point.longitude, point.latitude], 
      gcoord.WGS84, 
      gcoord.GCJ02
    );
    
    // 创建标记
    const marker = new AMap.Marker({
      position: position,
      title: `值: ${point.value}, 状态: ${point.status}`,
      clickable: true
    });
    
    // 根据状态设置不同的样式
    let color = '#2196F3'; // 默认蓝色
    if (point.status === '报警') {
      color = '#F44336'; // 报警红色
    } else if (point.status === '离线') {
      color = '#9E9E9E'; // 离线灰色
    } else if (point.status === '超速') {
      color = '#FF9800'; // 超速橙色
    }
    
    // 设置点的样式 - 增大点的大小
    marker.setContent(`<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`);
    
    // 添加到地图
    map.add(marker);
    
    // 添加点击事件
    marker.on('click', () => {
      // 创建信息窗体
      const infoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <p>经度: ${point.longitude.toFixed(6)}</p>
            <p>纬度: ${point.latitude.toFixed(6)}</p>
            <p>数值: ${point.value}</p>
            <p>状态: ${point.status}</p>
          </div>
        `,
        offset: new AMap.Pixel(0, -30)
      });
      
      // 在标记位置打开信息窗体
      infoWindow.open(map, marker.getPosition());
    });
  });
  
  // 调整地图视野以包含所有点
  map.setFitView();
}

let map;

function initMap() {
  map = new AMap.Map('map', {
    zoom: 13,  // 设置初始缩放级别
    center: [116.404, 39.915]  // 设置初始中心点
  });
  
  // 创建控制面板
  const controlPanel = document.createElement('div');
  controlPanel.className = 'map-control-panel';
  
  // 创建切换按钮
  const toggleButton = document.createElement('button');
  toggleButton.className = 'el-button el-button--primary el-button--small';
  toggleButton.textContent = useCluster.value ? '关闭聚合' : '开启聚合';
  toggleButton.onclick = () => {
    toggleClusterMode();
    toggleButton.textContent = useCluster.value ? '关闭聚合' : '开启聚合';
  };
  
  // 创建缩放级别显示
  const zoomDisplay = document.createElement('div');
  zoomDisplay.className = 'zoom-display';
  zoomDisplay.innerHTML = `当前缩放级别: <span id="current-zoom">${currentZoom.value}</span>`;
  
  // 创建聚合级别设置
  const clusterZoomSetting = document.createElement('div');
  clusterZoomSetting.className = 'cluster-zoom-setting';
  clusterZoomSetting.innerHTML = `
    <label>聚合级别设置:</label>
    <input 
      type="number" 
      min="1" 
      max="20" 
      value="${clusterMinZoom.value}" 
      class="el-input__inner"
      style="width: 60px; margin: 0 5px;"
    />
    <span>级及以下聚合</span>
  `;
  
  // 添加输入框事件
  const input = clusterZoomSetting.querySelector('input');
  input.addEventListener('change', (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 20) {
      clusterMinZoom.value = value;
      updateMapDisplay();
    }
  });
  
  // 添加到控制面板
  controlPanel.appendChild(zoomDisplay);
  controlPanel.appendChild(clusterZoomSetting);
  controlPanel.appendChild(toggleButton);
  
  // 使用高德地图的控件工厂创建自定义控件
  const customControl = {
    dom: controlPanel,
    addTo: function() {
      map.getContainer().appendChild(this.dom);
    },
    removeFrom: function() {
      if (this.dom.parentNode) {
        this.dom.parentNode.removeChild(this.dom);
      }
    }
  };
  
  // 设置样式
  controlPanel.style.position = 'absolute';
  controlPanel.style.top = '10px';
  controlPanel.style.right = '10px';
  controlPanel.style.zIndex = '100';
  controlPanel.style.backgroundColor = 'white';
  controlPanel.style.padding = '10px';
  controlPanel.style.borderRadius = '4px';
  controlPanel.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
  controlPanel.style.display = 'flex';
  controlPanel.style.flexDirection = 'column';
  controlPanel.style.gap = '10px';
  
  // 添加到地图
  customControl.addTo();
  
  // 初始化地图后绘制点数据
  if (shouldUseCluster()) {
    renderClusteredPoints();
  } else {
    drawPoints(pointData);
  }
  
  // 监听地图 moveend 事件
  map.on('moveend', handleMapMoveEnd);
  
  // 监听地图 zoomend 事件
  map.on('zoomend', () => {
    // 更新当前缩放级别
    currentZoom.value = map.getZoom();
    
    // 更新缩放级别显示
    const zoomElement = document.getElementById('current-zoom');
    if (zoomElement) {
      zoomElement.textContent = currentZoom.value.toFixed(1);
    }
    
    // 根据缩放级别更新地图显示
    updateMapDisplay();
  });
}

// 处理地图移动结束事件
function handleMapMoveEnd() {
  console.log('地图移动结束');
  
  // 获取当前地图中心点
  const center = map.getCenter();
  console.log('当前中心点:', center.lng, center.lat);
  
  // 获取当前缩放级别
  const zoom = map.getZoom();
  console.log('当前缩放级别:', zoom);
  
  // 获取当前地图可视区域
  const bounds = map.getBounds();
  console.log('当前可视区域:', bounds);
  
  // 如果使用聚合模式并且缩放级别符合聚合条件，则重新渲染聚合点
  // 但只在地图移动时更新，不在缩放时更新，避免重复触发
  if (shouldUseCluster() && clusterManager && lastClusterState === true) {
    renderClusteredPoints();
  }
}

onMounted(() => {
  initMap()
})
</script>

<style lang="scss" scoped>
.map-tool {
  height: 100vh;
  display: flex;

  .map {
    flex: 1;
    min-width: 400px;
  }

  .tool-wrap {
    width: 400px;
  }
}

.map-control-panel {
  .zoom-display {
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .cluster-zoom-setting {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    
    label {
      margin-right: 5px;
    }
  }
  
  button {
    width: 100%;
  }
}
</style>
