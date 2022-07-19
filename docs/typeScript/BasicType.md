---
title: 常见类型声明
date: 2020-05-29
sidebar: auto
tags:
 - ts
categories:
 - ts
---

## 基本类型
### 数字
```TypeScript
// 自动推断
const a = 10;
// 显示声明
const b: number = 20;
```

### 字符串
```TypeScript
// 自动推断
const a = 'hello world';
// 显示声明
const b: string = 'how are you';
```

### 布尔值
```TypeScript
// 自动推断
const a = false;
// 显示声明
const b: boolean = true;
// 类型转换声明
const c = !!(Math.random() < .5);
```

## 引用类型

### 数组
```TypeScript
// 自动推断
const a = [];
// 声明字符串数组
const b: string[] = ['ni']
const c: Array<string> = ['ni']
```
### 对象
```TypeScript
const a = {
    name: 'hello',
    age: 18
};
const b: {
    name: string,
    age: number,
    sayHi: Function,
    sayHello?: Function  // 可选属性
} = {
    name: 'hello',
    age: 19,
    sayHi: () => {}
};

```
### 函数
#### 普通函数
* 参数后面添加类型注解
* 参数列表后面添加返回值的类型注解
```TypeScript
function add(a: number, b:number): number{
    return a + b;
}
add(5,10);     // ok
add(5,'10');   // error
```
#### 匿名函数
* 匿名函数的参数又是会被自动推断
```TypeScript
const arr = ['a', 'b', 'c'];
arr.map((item) => {
    // item会被自动推导出来是string类型，不需要显示的参数注解
    return item.toUpperCase()
})
```

## TS中的特殊类型
### any类型
* `any`类型可以赋值给任何类型，任何类型也能赋值给`any`类型
* 当你没有指定类型，并且ts也不能推断出它的类型，会被默认赋值为`any`类型
* 当你让`TS`知道某段特定的代码是没有问题的，而又不想写类型声明的时候any， 类型是很有用的

```TypeScript
let obj: any = { x: 0 };
// 以下行为是被允许的，尽管可能会出错， 去掉any的类型注解则会报错
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```