---
title: 类型收窄
date: 2022/6/29
tags:
 - ts
categories:
 - ts
---

### 控制流收窄
```TypeScript
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

### 可辨别联合收窄
```TypeScript
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;

function getArea(shape: Shape){
  if(shape.kind === 'circle'){
    return Math.PI * shape.radius ** 2
  }
  return shape.sideLength ** 2
}

```
