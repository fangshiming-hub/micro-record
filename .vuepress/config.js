module.exports = {
  "title": "微记",
  "description": "",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    mode: "dark",
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "JS篇",
        "link": "/docs/javaScript/",
        "icon": "reco-message"
      },
      {
        "text": "TS篇",
        "link": "/docs/typeScript/",
        "icon": "reco-message"
      },
      // {
      //   "text": "前端",
      //   "icon": "reco-date",
      //   "items": [
      //     {
      //       "text": "javaScript",
      //       "link": "/docs/javaScript/"
      //     },
      //     {
      //       "text": "html",
      //       "link": "/docs/html/"
      //     },
      //     {
      //       "text": "css",
      //       "link": "/docs/css/"
      //     },
      //     {
      //       "text": "typeScript",
      //       "link": "/docs/typeScript/"
      //     },
      //   ]
      // },
      {
        "text": "工具",
        "icon": "reco-message",
        "items": [
          {
            "text": "webpack",
            "link": "/docs/webpack/"
          }
        ]
      },
      {
        "text": "友链",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/recoluan",
            "icon": "reco-github"
          }
        ]
      }
    ],
    // "sidebar": "auto",
    "sidebar": {
      "/docs/webpack/": [
        "",
        "theme",
        "plugin",
        "api"
      ],
      "/docs/typeScript/": [
        "",
        "BasicType",
        "Variable",
        "TypeNarrowing",
        // "03接口",
        // "04类",
        // "05函数",
        // "06泛型",
        // "07枚举",
        // "08高级类型"
      ],
      "/docs/javaScript/": [
        "",
        "toolFunction",
        "forThis",
        // "Variable",
        // "TypeNarrowing",
        // "03接口",
        // "04类",
        // "05函数",
        // "06泛型",
        // "07枚举",
        // "08高级类型"
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 5,
        "text": "分类"
      },
      "tag": {
        "location": 6,
        "text": "标签"
      }
    },
    "friendLink": [
      {
        "title": "午后南杂",
        "desc": "Enjoy when you can, and endure when you must.",
        "email": "1156743527@qq.com",
        "link": "https://www.recoluan.com"
      },
      {
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "最后更新于",
    "author": "fangshiming",
    "authorAvatar": "/avatar.png",
    "record": "微世人",
    "startYear": "2022"
  },
  "markdown": {
    "lineNumbers": true
  },
  "plugins": [
    ["one-click-copy", {
      "copyMessage": "复制成功",
      "toolTipMessage": "点击复制"
    }],
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          const moment = require('moment')
          moment.locale('zh-cn')
          return moment(timestamp).format('YYYY-MM-DD HH:mm')
        }
      }
    ]
  ]
}
