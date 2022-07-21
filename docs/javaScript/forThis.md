---
title: This到底指向哪
sidebar: auto
tags:
 - js
categories:
 - js
---
## 全局作用域中的this
全局作用域中的this（不在函数体中的），无论是否在严格模式下，都指向全局变量`window`
```javascript
console.log(this === window) // true
```
```javascript
'use strict'
console.log(this === window) // true
```
## 上下文对象调用的this
通过上下文对象调用函数时，函数中的this通常指向该上下文对象
## 构造函数中的this
在使用`new`方法调用构造函数时，内部的this**通常**指向新创建的对象
## 箭头函数中的this
在箭头函数中，this的指向通常是由外层作用域来决定的

## 通过`apply`、`call`、`bind`改变的this
  三者都是通过函数调用,都能改变函数中this的指向,箭头函数不生效
  * call和apply都是即时调用函数,改变this指向,两者的主要区别是参数的不同
    ```JavaScript
      function.call(thisArg, arg1, arg2, ...)
      function.apply(thisArg, argArray)
    ```
  * bind是返回一个绑定了指定上下文的函数
    ```javascript
      const newFunction = function.bind(this, arg1, arg2, ...)
    ```
## this的优先级

## dom事件处理函数中的this

## 内联事件处理函数中的this
