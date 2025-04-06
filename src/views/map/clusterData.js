import Supercluster from 'supercluster';
import gcoord from 'gcoord';

/**
 * 创建点聚合器
 * @param {Array} pointData - 原始点数据数组
 * @param {Object} options - 聚合器配置选项
 * @returns {Object} 聚合器实例和其方法
 */
export function createClusterManager(pointData, options = {}) {
  // 默认配置
  const defaultOptions = {
    radius: 60,           // 聚合半径（像素）
    maxZoom: 18,          // 最大缩放级别，超过此级别不再聚合
    minZoom: 3,           // 最小缩放级别
    minPoints: 2,         // 形成聚类的最小点数
    extent: 512,          // 瓦片大小
    nodeSize: 64,         // 内部 kd-tree 的节点大小
    // 自定义聚合属性的计算方法
    map: (props) => ({
      value: props.value,
      status: props.status,
      count: 1,
      // 初始化各状态计数
      statusCounts: {
        '在线': props.status === '在线' ? 1 : 0,
        '离线': props.status === '离线' ? 1 : 0,
        '报警': props.status === '报警' ? 1 : 0,
        '超速': props.status === '超速' ? 1 : 0
      }
    }),
    reduce: (accumulated, props) => {
      accumulated.count += props.count;
      accumulated.value = (accumulated.value * (accumulated.count - 1) + props.value) / accumulated.count;
      
      // 更新各状态计数
      accumulated.statusCounts['在线'] += props.statusCounts['在线'];
      accumulated.statusCounts['离线'] += props.statusCounts['离线'];
      accumulated.statusCounts['报警'] += props.statusCounts['报警'];
      accumulated.statusCounts['超速'] += props.statusCounts['超速'];
      
      // 状态优先级：报警 > 超速 > 离线 > 在线
      const statusPriority = {
        '报警': 3,
        '超速': 2,
        '离线': 1,
        '在线': 0
      };
      
      // 保留优先级最高的状态
      if (statusPriority[props.status] > statusPriority[accumulated.status]) {
        accumulated.status = props.status;
      }
    }
  };
  
  // 合并选项
  const mergedOptions = { ...defaultOptions, ...options };
  
  // 创建聚合器实例
  const index = new Supercluster(mergedOptions);
  
  // 保存原始点数据的引用
  let originalPointsData = [...pointData];
  
  // 将原始点数据转换为 GeoJSON 格式
  const points = pointData.map((point, idx) => ({
    type: 'Feature',
    properties: {
      id: idx,
      value: point.value,
      status: point.status,
      longitude: point.longitude,
      latitude: point.latitude,
      originalPoint: point // 保存原始点数据
    },
    geometry: {
      type: 'Point',
      coordinates: [point.longitude, point.latitude]
    }
  }));
  
  // 加载数据到聚合器
  index.load(points);
  
  /**
   * 获取指定边界和缩放级别的聚合结果
   * @param {AMap.Map} map - 高德地图实例
   * @returns {Array} 聚合后的点数组
   */
  function getClusters(map) {
    // 获取当前地图边界
    const bounds = map.getBounds();
    const bbox = [
      bounds.getSouthWest().lng,
      bounds.getSouthWest().lat,
      bounds.getNorthEast().lng,
      bounds.getNorthEast().lat
    ];
    
    // 获取当前缩放级别
    const zoom = map.getZoom();
    
    // 获取聚合结果
    return index.getClusters(bbox, zoom);
  }
  
  /**
   * 在高德地图上渲染聚合点
   * @param {AMap.Map} map - 高德地图实例
   * @param {Function} onClusterClick - 点击聚合点的回调函数
   * @param {Function} onPointClick - 点击单个点的回调函数
   * @returns {Array} 创建的标记数组
   */
  function renderClusters(map, onClusterClick, onPointClick) {
    // 清除地图上的所有标记
    map.clearMap();
    
    // 获取聚合结果
    const clusters = getClusters(map);
    
    // 创建标记数组
    const markers = [];
    
    // 遍历聚合结果并创建标记
    clusters.forEach(cluster => {
      const [lng, lat] = cluster.geometry.coordinates;
      
      // 将 WGS84 坐标转换为 GCJ02
      const position = gcoord.transform([lng, lat], gcoord.WGS84, gcoord.GCJ02);
      
      let marker;
      
      if (cluster.properties.cluster) {
        // 这是一个聚合点
        const pointCount = cluster.properties.point_count;
        const clusterId = cluster.properties.cluster_id;
        const status = cluster.properties.status || '在线';
        
        // 根据状态设置不同的颜色
        let color = '#2196F3'; // 默认蓝色
        if (status === '报警') {
          color = '#F44336'; // 报警红色
        } else if (status === '离线') {
          color = '#9E9E9E'; // 离线灰色
        } else if (status === '超速') {
          color = '#FF9800'; // 超速橙色
        }
        
        // 获取状态计数
        const statusCounts = cluster.properties.statusCounts || {
          '在线': 0,
          '离线': 0,
          '报警': 0,
          '超速': 0
        };
        
        // 创建聚合标记
        marker = new AMap.Marker({
          position: position,
          content: `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: ${color};
              color: white;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 0 5px rgba(0,0,0,0.3);
              font-size: 14px;
            ">
              <div style="font-size: 10px;">
                ${statusCounts['在线'] > 0 ? `在:${statusCounts['在线']}` : ''}
              </div>
              <div style="font-size: 10px;">
                ${statusCounts['离线'] > 0 ? `离:${statusCounts['离线']}` : ''}
              </div>
              <div style="font-size: 10px;">
                ${statusCounts['报警'] > 0 ? `警:${statusCounts['报警']}` : ''}
              </div>
              <div style="font-size: 10px;">
                ${statusCounts['超速'] > 0 ? `超:${statusCounts['超速']}` : ''}
              </div>
            </div>
          `,
          offset: new AMap.Pixel(-30, -30),
          zIndex: 100
        });
        
        // 添加点击事件
        if (onClusterClick) {
          marker.on('click', () => {
            onClusterClick(clusterId, marker, cluster);
          });
        }
      } else {
        // 这是单个点
        const point = cluster.properties.originalPoint || {
          longitude: lng,
          latitude: lat,
          value: cluster.properties.value,
          status: cluster.properties.status
        };
        
        // 根据状态设置不同的颜色
        let color = '#2196F3'; // 默认蓝色
        if (point.status === '报警') {
          color = '#F44336'; // 报警红色
        } else if (point.status === '离线') {
          color = '#9E9E9E'; // 离线灰色
        } else if (point.status === '超速') {
          color = '#FF9800'; // 超速橙色
        }
        
        // 创建单个点标记
        marker = new AMap.Marker({
          position: position,
          title: `值: ${point.value}, 状态: ${point.status}`,
          content: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
          offset: new AMap.Pixel(-8, -8),
          zIndex: 90
        });
        
        // 添加点击事件
        if (onPointClick) {
          marker.on('click', () => {
            onPointClick(point, marker, cluster);
          });
        }
      }
      
      // 添加标记到地图
      map.add(marker);
      markers.push(marker);
    });
    
    return markers;
  }
  
  /**
   * 获取指定聚合的子点
   * @param {Number} clusterId - 聚合点ID
   * @returns {Array} 子点数组
   */
  function getClusterChildren(clusterId) {
    return index.getChildren(clusterId);
  }
  
  /**
   * 获取指定聚合的原始点
   * @param {Number} clusterId - 聚合点ID
   * @param {Number} limit - 限制返回的点数量
   * @param {Number} offset - 起始偏移量
   * @returns {Array} 原始点数组
   */
  function getClusterLeaves(clusterId, limit = 10, offset = 0) {
    return index.getLeaves(clusterId, limit, offset);
  }
  
  /**
   * 展开聚合点
   * @param {Number} clusterId - 聚合点ID
   * @param {AMap.Map} map - 高德地图实例
   * @param {Function} onPointClick - 点击单个点的回调函数
   * @returns {Array} 创建的标记数组
   */
  function expandCluster(clusterId, map, onPointClick) {
    // 获取聚合的原始点
    const leaves = getClusterLeaves(clusterId, Infinity);
    
    // 创建标记数组
    const markers = [];
    
    // 遍历原始点并创建标记
    leaves.forEach(leaf => {
      const [lng, lat] = leaf.geometry.coordinates;
      
      // 将 WGS84 坐标转换为 GCJ02
      const position = gcoord.transform([lng, lat], gcoord.WGS84, gcoord.GCJ02);
      
      const point = leaf.properties.originalPoint || {
        longitude: lng,
        latitude: lat,
        value: leaf.properties.value,
        status: leaf.properties.status
      };
      
      // 根据状态设置不同的颜色
      let color = '#2196F3'; // 默认蓝色
      if (point.status === '报警') {
        color = '#F44336'; // 报警红色
      } else if (point.status === '离线') {
        color = '#9E9E9E'; // 离线灰色
      } else if (point.status === '超速') {
        color = '#FF9800'; // 超速橙色
      }
      
      // 创建单个点标记
      const marker = new AMap.Marker({
        position: position,
        title: `值: ${point.value}, 状态: ${point.status}`,
        content: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
        offset: new AMap.Pixel(-8, -8),
        zIndex: 90
      });
      
      // 添加点击事件
      if (onPointClick) {
        marker.on('click', () => {
          onPointClick(point, marker, leaf);
        });
      }
      
      // 添加标记到地图
      map.add(marker);
      markers.push(marker);
    });
    
    // 调整地图视野以包含所有点
    map.setFitView(markers);
    
    return markers;
  }
  
  /**
   * 更新单个点的数据和状态
   * @param {Number} pointId - 点的ID（在原始数组中的索引）
   * @param {Object} newData - 新的点数据，可包含 value、status 等属性
   * @param {AMap.Map} [map] - 高德地图实例，如果提供则自动重新渲染地图
   * @param {Function} [onClusterClick] - 点击聚合点的回调函数
   * @param {Function} [onPointClick] - 点击单个点的回调函数
   * @returns {Boolean} 更新是否成功
   */
  function updatePoint(pointId, newData, map, onClusterClick, onPointClick) {
    // 检查点ID是否有效
    if (pointId < 0 || pointId >= originalPointsData.length) {
      console.error(`无效的点ID: ${pointId}`);
      return false;
    }
    
    // 更新原始数据
    const originalPoint = originalPointsData[pointId];
    originalPointsData[pointId] = {
      ...originalPoint,
      ...newData
    };
    
    // 重新创建 GeoJSON 格式的点数据
    const updatedPoints = originalPointsData.map((point, idx) => ({
      type: 'Feature',
      properties: {
        id: idx,
        value: point.value,
        status: point.status,
        longitude: point.longitude,
        latitude: point.latitude,
        originalPoint: point // 保存原始点数据
      },
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude]
      }
    }));
    
    // 重新加载数据到聚合器
    index.load(updatedPoints);
    
    // 如果提供了地图实例，重新渲染地图
    if (map) {
      renderClusters(map, onClusterClick, onPointClick);
    }
    
    return true;
  }
  
  /**
   * 批量更新多个点的数据和状态
   * @param {Array} updates - 更新数据数组，每个元素为 {id, data} 形式的对象
   * @param {AMap.Map} [map] - 高德地图实例，如果提供则自动重新渲染地图
   * @param {Function} [onClusterClick] - 点击聚合点的回调函数
   * @param {Function} [onPointClick] - 点击单个点的回调函数
   * @returns {Object} 更新结果，包含成功和失败的更新数量
   */
  function updatePoints(updates, map, onClusterClick, onPointClick) {
    let successCount = 0;
    let failCount = 0;
    
    // 遍历更新数据数组
    updates.forEach(update => {
      const { id, data } = update;
      
      // 检查点ID是否有效
      if (id < 0 || id >= originalPointsData.length) {
        console.error(`无效的点ID: ${id}`);
        failCount++;
        return;
      }
      
      // 更新原始数据
      originalPointsData[id] = {
        ...originalPointsData[id],
        ...data
      };
      
      successCount++;
    });
    
    // 重新创建 GeoJSON 格式的点数据
    const updatedPoints = originalPointsData.map((point, idx) => ({
      type: 'Feature',
      properties: {
        id: idx,
        value: point.value,
        status: point.status,
        longitude: point.longitude,
        latitude: point.latitude,
        originalPoint: point // 保存原始点数据
      },
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude]
      }
    }));
    
    // 重新加载数据到聚合器
    index.load(updatedPoints);
    
    // 如果提供了地图实例，重新渲染地图
    if (map) {
      renderClusters(map, onClusterClick, onPointClick);
    }
    
    return {
      success: successCount,
      fail: failCount,
      total: updates.length
    };
  }
  
  /**
   * 更新所有点的数据
   * @param {Array} newPointsData - 新的点数据数组
   * @param {AMap.Map} [map] - 高德地图实例，如果提供则自动重新渲染地图
   * @param {Function} [onClusterClick] - 点击聚合点的回调函数
   * @param {Function} [onPointClick] - 点击单个点的回调函数
   */
  function updateAllPoints(newPointsData, map, onClusterClick, onPointClick) {
    // 更新原始数据引用
    originalPointsData = [...newPointsData];
    
    // 重新创建 GeoJSON 格式的点数据
    const updatedPoints = newPointsData.map((point, idx) => ({
      type: 'Feature',
      properties: {
        id: idx,
        value: point.value,
        status: point.status,
        longitude: point.longitude,
        latitude: point.latitude,
        originalPoint: point // 保存原始点数据
      },
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude]
      }
    }));
    
    // 重新加载数据到聚合器
    index.load(updatedPoints);
    
    // 如果提供了地图实例，重新渲染地图
    if (map) {
      renderClusters(map, onClusterClick, onPointClick);
    }
    
    return true;
  }
  
  /**
   * 获取所有原始点数据
   * @returns {Array} 原始点数据数组
   */
  function getAllPoints() {
    return [...originalPointsData];
  }
  
  // 返回聚合器实例和方法
  return {
    index,
    getClusters,
    renderClusters,
    getClusterChildren,
    getClusterLeaves,
    expandCluster,
    updatePoint,
    updatePoints,
    updateAllPoints,
    getAllPoints
  };
}
