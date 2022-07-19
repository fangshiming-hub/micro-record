---
title: 工具函数
sidebar: auto
tags:
 - js
categories:
 - js
---
## 扁平数组转树结构
```JavaScript
const arr = [
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
        pid: 1002
    },
    {
        id: 1004,
        pid: 1002
    },
    {
        id: 1005,
        pid: 1004
    },
    {
        id: 1006,
        pid: 1005
    },
    {
        id: 1007,
        pid: 1005
    },
    {
        id: 1008,
        pid: 1007
    },
]
function transformToTree(data) {
    const dataCopy = JSON.parse(JSON.stringify(data))
    return dataCopy.filter((parent) => {
        const children = dataCopy.filter(children => children.pid === parent.id);
        parent.children = children;
        return parent.pid === -1
    })
}
```