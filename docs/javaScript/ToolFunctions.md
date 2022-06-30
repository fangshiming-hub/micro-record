---
title: 常用函数
date: 2022/6/29
sidebar: auto
tags:
 - js
categories:
 - js
---

### 扁平数据转数结构
```javascript
function transformToTree(val) {
    const valCopy = JSON.parse(JSON.stringify(val))
    const tree = valCopy.filter(parent => {
        const children = valCopy.filter(child => child.pid === parent.id)
        parent.children = children
        return parent.pid === -1
    })
    return tree
}
const data = [
    {
        id: 1001,
        pid: -1
    },
     {
        id: 1002,
        pid: 1001
    },
     {
        id: 1003,
        pid: 1001
    },
     {
        id: 1004,
        pid: 1003
    },
     {
        id: 1005,
        pid: 1003
    },
     {
        id: 1006,
        pid: 1005
    },
     {
        id: 1007,
        pid: 1006
    },
]
transformToTree(data)
```