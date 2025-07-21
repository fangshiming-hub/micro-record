<template>
  <div class="grid-layout-demo">
    <h1>CSS Grid 布局完整指南</h1>
    <p class="intro">CSS Grid 是一个二维布局系统，本指南涵盖从基础概念到高级用法的完整内容。</p>

    <!-- 基础概念 -->
    <section class="demo-section">
      <h2>📚 核心概念</h2>
      <div class="concept-grid">
        <div class="concept-card">
          <h3>📏 网格线编号</h3>
          <p>从1开始，用于定位：<code>grid-column: 1 / 3</code> (从线1到线3)</p>
        </div>
        
        <div class="concept-card">
          <h3>🔢 repeat()函数</h3>
          <p>简化重复：<code>repeat(3, 1fr) = 1fr 1fr 1fr</code></p>
        </div>
        
        <div class="concept-card">
          <h3>📊 fr单位</h3>
          <p>剩余空间占比：<code>1fr 2fr 1fr</code> = 25% 50% 25%</p>
        </div>
        
        <div class="concept-card">
          <h3>⚖️ minmax()函数</h3>
          <p>设置范围：<code>minmax(200px, 1fr)</code>最小200px，最大剩余空间</p>
        </div>
      </div>
    </section>

    <!-- auto-fill vs auto-fit对比 -->
    <section class="demo-section">
      <h2>🔄 auto-fill vs auto-fit 区别详解</h2>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h3>auto-fill</h3>
          <p><strong>创建固定网格结构，保留空列</strong></p>
          <div class="demo-grid auto-fill-demo">
            <div class="demo-item">项目1</div>
            <div class="demo-item">项目2</div>
          </div>
          <p class="note">容器宽度足够容纳4列，但只放2个项目，保留空白列</p>
          <code>grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));</code>
        </div>
        
        <div class="comparison-item">
          <h3>auto-fit</h3>
          <p><strong>根据内容自适应，折叠空列</strong></p>
          <div class="demo-grid auto-fit-demo">
            <div class="demo-item">项目1</div>
            <div class="demo-item">项目2</div>
          </div>
          <p class="note">同样条件下，空列被折叠，项目平分可用空间</p>
          <code>grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));</code>
        </div>
      </div>
    </section>

    <!-- 基础网格布局 -->
    <section class="demo-section">
      <h2>基础网格布局</h2>
      <div class="grid-container basic-grid">
        <div class="grid-item">1</div>
        <div class="grid-item">2</div>
        <div class="grid-item">3</div>
        <div class="grid-item">4</div>
        <div class="grid-item">5</div>
        <div class="grid-item">6</div>
      </div>
      <code>display: grid;<br>grid-template-columns: repeat(3, 1fr);<br>gap: 10px;</code>
    </section>

    <!-- 响应式网格 -->
    <section class="demo-section">
      <h2>响应式网格</h2>
      <div class="grid-container responsive-grid">
        <div class="grid-item">1</div>
        <div class="grid-item">2</div>
        <div class="grid-item">3</div>
        <div class="grid-item">4</div>
      </div>
      <code>grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));</code>
    </section>

    <!-- 网格区域命名 -->
    <section class="demo-section">
      <h2>网格区域命名</h2>
      <div class="grid-container areas-grid">
        <header class="grid-item">Header</header>
        <nav class="grid-item">Nav</nav>
        <main class="grid-item">Main</main>
        <aside class="grid-item">Sidebar</aside>
        <footer class="grid-item">Footer</footer>
      </div>
      <code>grid-template-areas:<br>"header header header"<br>"nav main sidebar"<br>"footer footer footer";</code>
    </section>

    <!-- 实际应用示例 -->
    <section class="demo-section">
      <h2>实际应用：卡片布局</h2>
      <div class="grid-container card-grid">
        <div class="card">
          <img src="https://via.placeholder.com/300x200" alt="示例图片">
          <h3>卡片标题 1</h3>
          <p>这是一个卡片的描述文本，展示网格布局在实际应用中的效果。</p>
        </div>
        <div class="card">
          <img src="https://via.placeholder.com/300x200" alt="示例图片">
          <h3>卡片标题 2</h3>
          <p>网格布局非常适合创建响应式的卡片布局，特别是产品展示页面。</p>
        </div>
        <div class="card">
          <img src="https://via.placeholder.com/300x200" alt="示例图片">
          <h3>卡片标题 3</h3>
          <p>通过网格布局，可以轻松实现各种复杂的页面结构。</p>
        </div>
      </div>
    </section>

    <!-- 属性速查表 -->
    <section class="demo-section">
      <h2>常用属性速查表</h2>
      <div class="properties-grid">
        <div class="property-item">
          <h4>容器属性</h4>
          <ul>
            <li>display: grid</li>
            <li>grid-template-columns</li>
            <li>grid-template-rows</li>
            <li>grid-template-areas</li>
            <li>gap</li>
            <li>justify-items</li>
            <li>align-items</li>
          </ul>
        </div>
        <div class="property-item">
          <h4>项目属性</h4>
          <ul>
            <li>grid-column</li>
            <li>grid-row</li>
            <li>grid-area</li>
            <li>justify-self</li>
            <li>align-self</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'GridLayoutDemo'
}
</script>

<style scoped>
.grid-layout-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.intro {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.demo-section {
  margin-bottom: 50px;
}

.demo-section h2 {
  color: #333;
  border-bottom: 2px solid #007acc;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.grid-container {
  border: 2px solid #ddd;
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
}

.grid-item {
  background: #007acc;
  color: white;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  border-radius: 4px;
}

/* 基础网格 */
.basic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.areas-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header header header"
    "nav main sidebar"
    "footer footer footer";
  gap: 10px;
  min-height: 300px;
}

.areas-grid header {
  grid-area: header;
  background: #ff6b6b;
}

.areas-grid nav {
  grid-area: nav;
  background: #4ecdc4;
}

.areas-grid main {
  grid-area: main;
  background: #45b7d1;
}

.areas-grid aside {
  grid-area: sidebar;
  background: #f9ca24;
}

.areas-grid footer {
  grid-area: footer;
  background: #6c5ce7;
}

.alignment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-items: center;
  align-items: center;
  min-height: 200px;
}

.alignment-grid .small {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card h3 {
  padding: 15px 20px 5px;
  margin: 0;
  color: #333;
}

.card p {
  padding: 0 20px 20px;
  margin: 0;
  color: #666;
  line-height: 1.6;
}

/* 新增样式 */
.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.concept-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #007acc;
}

.concept-card h3 {
  color: #007acc;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.concept-card p {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
}

.comparison-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.comparison-item h3 {
  color: #007acc;
  margin-top: 0;
}

.comparison-item strong {
  color: #ff4757;
}

.demo-container {
  margin: 15px 0;
}

.demo-grid {
  display: grid;
  gap: 10px;
  background: #fff;
  padding: 15px;
  border: 1px solid #eee;
}

.auto-fill-demo {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  width: 100%;
  max-width: 600px;
}

.auto-fit-demo {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  width: 100%;
  max-width: 600px;
}

.demo-item {
  background: #007acc;
  color: white;
  padding: 30px 15px;
  text-align: center;
  border-radius: 4px;
}

.note {
  font-size: 13px;
  color: #666;
  margin-top: 10px;
  font-style: italic;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.property-item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

.property-item h4 {
  color: #007acc;
  margin-top: 0;
}

.property-item ul {
  margin: 0;
  padding-left: 20px;
}

.property-item li {
  margin-bottom: 5px;
  color: #555;
}

code {
  display: block;
  background: #f4f4f4;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  color: #333;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  
  .concept-grid {
    grid-template-columns: 1fr;
  }
}
</style>