import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "退堂鼓一级选手",
  description: "A personal site",
  base: '/blog/',
  outDir: '../dist/blog/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Other', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: 'Markdown示例', link: '/markdown-examples' },
          { text: 'API示例', link: '/api-examples' }
        ]
      },
      {
        text: 'AI集成',
        items: [
          { text: 'Claude接入Kimi K2', link: '/ai/claude-kimi-k2' }
        ]
      },
      {
        text: '网络',
        items: [
          { text: 'HTTP协议', link: '/network/http' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
