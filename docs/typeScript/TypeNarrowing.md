---
title: 类型收窄
date: 2022/6/29
---

### 控制流收窄
```JavaScript
function add() {
  let x : string | number | boolean
  x = Math.random() < 0.5
  if(Math.random() < 0.5) {
    x = 'hello'
    console.log(x)
    // x: string
  } else {
    x = 100
    console.log(x)
    // x: number
  }
  return x
  // x: string | number,  不会有boolean
}
```
