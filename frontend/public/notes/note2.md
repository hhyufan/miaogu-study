# 函数与作用域

函数是 JavaScript 的核心概念之一，而作用域决定了变量的可访问性。

## 函数声明与表达式

### 函数声明

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

// 调用
console.log(greet("张三")); // "Hello, 张三!"
```

### 函数表达式

```javascript
const add = function(a, b) {
  return a + b;
};

const multiply = (a, b) => a * b;
```

### 默认参数

```javascript
function greet(name = "访客", greeting = "你好") {
  return `${greeting}，${name}！`;
}

console.log(greet()); // "你好，访客！"
console.log(greet("小明")); // "你好，小明！"
```

## 作用域类型

### 1. 全局作用域

```javascript
const globalVar = "我是全局变量";

function testGlobal() {
  console.log(globalVar); // 可以访问
}
```

### 2. 函数作用域

```javascript
function testScope() {
  const localVar = "我是局部变量";
  console.log(localVar); // 可以访问
}

console.log(localVar); // 错误！无法访问
```

### 3. 块级作用域（ES6+）

```javascript
if (true) {
  let blockVar = "我是块级变量";
  const blockConst = "我也是块级常量";
  console.log(blockVar); // 可以访问
}

console.log(blockVar); // 错误！无法访问
console.log(blockConst); // 错误！无法访问
```

## 闭包

```javascript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

## 箭头函数

```javascript
// 传统函数
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(num) {
  return num * 2;
});

// 箭头函数
const doubledArrow = numbers.map(num => num * 2);

// 多参数箭头函数
const add = (a, b) => a + b;

// 多行箭头函数
const greet = (name) => {
  const message = `Hello, ${name}!`;
  return message;
};
```

## 高阶函数

```javascript
function withLogging(fn) {
  return function(...args) {
    console.log(`调用函数: ${fn.name}`);
    console.log(`参数:`, args);
    const result = fn(...args);
    console.log(`结果:`, result);
    return result;
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);

loggedAdd(3, 4);
// 输出:
// 调用函数: add
// 参数: [3, 4]
// 结果: 7
```