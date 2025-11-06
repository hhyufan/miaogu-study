# 变量与数据类型

JavaScript 中的变量和数据类型是基础中的基础。理解它们对于编写高质量的代码至关重要。

## 基本数据类型

JavaScript 有 7 种基本数据类型：

### 1. Number（数字）

```javascript
let age = 25;
let price = 99.99;
let temperature = -10;
let infinity = Infinity;
let notNumber = NaN;
```

### 2. String（字符串）

```javascript
let name = "张三";
let message = 'Hello World';
let template = `你好，${name}！`;
```

### 3. Boolean（布尔值）

```javascript
let isStudent = true;
let hasPermission = false;
let isAdult = age >= 18;
```

### 4. Undefined（未定义）

```javascript
let undefinedVar;
console.log(undefinedVar); // undefined
```

### 5. Null（空值）

```javascript
let emptyValue = null;
console.log(emptyValue); // null
```

### 6. Symbol（符号）

```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false
```

### 7. BigInt（大整数）

```javascript
const bigNumber = 123456789012345678901234567890n;
console.log(typeof bigNumber); // "bigint"
```

## 类型检测

```javascript
console.log(typeof 42);           // "number"
console.log(typeof "hello");      // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (历史遗留问题)
console.log(typeof {});           // "object"
console.log(typeof []);           // "object"
console.log(typeof function(){}); // "function"
```

## 类型转换

```javascript
// 隐式转换
console.log("5" + 2);   // "52" (字符串连接)
console.log("5" - 2);   // 3 (数字减法)
console.log(!!"hello");  // true (布尔转换)

// 显式转换
console.log(Number("123"));     // 123
console.log(String(456));       // "456"
console.log(Boolean(0));          // false
console.log(parseInt("10.5"));    // 10
console.log(parseFloat("10.5")); // 10.5
```