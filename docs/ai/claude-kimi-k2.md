# Claude终端接入Kimi K2 (Windows版)

## 前置条件

- **操作系统**: Windows 10/11
- **Node.js**: v18.0.0 或更高版本
- **Git Bash**: 已安装 Git for Windows (包含 Git Bash)
- **Kimi账号**: 已注册 [Kimi开放平台](https://platform.moonshot.cn) 并获取 API Key

### 检查环境
```bash
# 在 Git Bash 中检查 Node.js 版本
node --version

# 检查 Git Bash 是否可用
git --version
```

## 配置步骤

### 1. 全局安装Claude CLI
在 **Git Bash** 中执行：
```bash
npm install -g @anthropic-ai/claude-cli
```

### 2. 初始化一下claude, 修改配置文件
配置文件路径为：`c:用户/{user}/.claude/settings.json`

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.moonshot.cn/anthropic/",
    "ANTHROPIC_API_KEY": "your-kimi-api-key"
  }
}
```


### 3. 使用命令

#### 在 Git Bash 中：
```bash
# 启动Claude终端
claude
```
