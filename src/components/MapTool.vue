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
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import gcoord from 'gcoord';
import { read, utils } from 'xlsx'

const uploadRef = ref()

function uploadFile(file:any) {
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

function clearMap() {
  map && map.clearMap();
}

let map;

function initMap() {
  map = new AMap.Map('map')
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
</style>
