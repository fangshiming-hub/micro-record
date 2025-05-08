# HTTP 相关知识点

## 1.文件下载响应头设置

### 主要响应头

要使文件直接下载而不是在浏览器中预览，需要设置以下响应头：

1. `Content-Disposition`
   - 这是最重要的响应头
   - 基本格式：`Content-Disposition: attachment; filename="文件名"`
   - 示例：
     ```
     Content-Disposition: attachment; filename="example.pdf"
     ```

2. `Content-Type`
   - 指定文件的 MIME 类型
   - 示例：
     ```
     Content-Type: application/pdf
     ```

### 完整示例

```javascript
// Node.js Express 示例
res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
res.setHeader('Content-Type', 'application/pdf');
```

### 常见 MIME 类型

- PDF文件：`application/pdf`
- Word文档：`application/msword`
- Excel文件：`application/vnd.ms-excel`
- 图片文件：`image/jpeg`, `image/png`
- 文本文件：`text/plain`

### 注意事项

1. 文件名最好进行 URL 编码，以支持中文等特殊字符
2. 某些浏览器可能会忽略 Content-Disposition 头，建议同时设置正确的 Content-Type
3. 对于大文件，建议设置 `Content-Length` 头，以便浏览器显示下载进度

## 2.内容安全策略 Content Security Policy (CSP)

Content Security Policy 是一个额外的安全层，用于检测和减轻某些类型的攻击，包括跨站脚本攻击 (XSS) 和数据注入攻击。

### 基本语法

```
Content-Security-Policy: <policy-directive>; <policy-directive>
```

### 常用指令

1. **default-src**
   - 定义默认策略
   - 示例：`default-src 'self'`

2. **script-src**
   - 控制 JavaScript 的来源
   - 示例：`script-src 'self' 'unsafe-inline' 'unsafe-eval'`

3. **style-src**
   - 控制 CSS 的来源
   - 示例：`style-src 'self' 'unsafe-inline'`

4. **img-src**
   - 控制图片的来源
   - 示例：`img-src 'self' data: https:`

5. **connect-src**
   - 控制 AJAX、WebSocket 等连接的来源
   - 示例：`connect-src 'self' https://api.example.com`

### 常用值

- `'self'`: 只允许来自同源的资源
- `'unsafe-inline'`: 允许内联脚本和样式
- `'unsafe-eval'`: 允许使用 eval() 等动态代码执行
- `'none'`: 禁止所有资源
- `data:`: 允许 data URI
- 域名: 允许特定域名的资源

### 完整示例

```javascript
// Node.js Express 示例
res.setHeader(
  'Content-Security-Policy',
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "connect-src 'self' https://api.example.com"
);
```

### 最佳实践

1. **最小权限原则**
   - 只允许必要的资源来源
   - 避免使用 `unsafe-inline` 和 `unsafe-eval`

2. **分阶段实施**
   - 先使用 `Content-Security-Policy-Report-Only` 头进行测试
   - 监控违规报告
   - 逐步收紧策略

3. **定期审查**
   - 定期检查 CSP 配置
   - 移除不再需要的来源
   - 更新过时的配置

4. **错误处理**
   - 设置 CSP 报告收集端点
   - 监控 CSP 违规报告
   - 及时处理安全警告

### 注意事项

1. CSP 配置错误可能导致网站功能失效
2. 某些第三方服务可能需要特定的 CSP 配置
3. 建议在开发环境充分测试 CSP 配置
4. 可以使用浏览器开发者工具监控 CSP 违规
