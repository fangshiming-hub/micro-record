module.exports = {
  "title": "微记",
  "description": "",
  "dest": "public",
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
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "前端",
        "link": "/timeline/",
        "icon": "reco-date",
        "items": [
          {
            "text": "javaScript",
            "link": "/docs/javaScript/"
          },
          {
            "text": "html",
            "link": "/docs/html/"
          },
          {
            "text": "ccss",
            "link": "/docs/css/"
          }
        ]
      },
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
    "lastUpdated": "Last Updated",
    "author": "fangshiming",
    "authorAvatar": "/avatar.png",
    "record": "xxxx",
    "startYear": "2022"
  },
  "markdown": {
    "lineNumbers": true
  }
}