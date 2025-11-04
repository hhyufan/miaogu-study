# ES6+ 新特性

ES6（ECMAScript 2015）及后续版本引入了许多强大的新特性，让 JavaScript 编程更加高效和优雅。

## let 和 const 声明

### let - 块级作用域变量
```javascript
function testLet() {
  if (true) {
    let x = 10;
    console.log(x); // 10
  }
  console.log(x); // ReferenceError: x is not defined
}

// 对比 var
function testVar() {
  if (true) {
    var y = 20;
  }
  console.log(y); // 20 (var 是函数作用域)
}
```

### const - 常量声明
```javascript
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

// 但对象和数组的内部可以修改
const person = { name: "张三" };
person.name = "李四"; // 这是允许的
person.age = 25; // 这也是允许的

const numbers = [1, 2, 3];
numbers.push(4); // 这是允许的
```

## 模板字符串

```javascript
const name = "张三";
const age = 25;

// 传统字符串拼接
const oldWay = "姓名: " + name + ", 年龄: " + age;

// 模板字符串
const newWay = `姓名: ${name}, 年龄: ${age}`;

// 多行字符串
const multiline = `
  这是第一行
  这是第二行
  这是第三行
`;

// 表达式计算
const result = `5 + 3 = ${5 + 3}`; // "5 + 3 = 8"
```

## 解构赋值

### 数组解构
```javascript
const numbers = [1, 2, 3, 4, 5];

// 基本解构
const [first, second] = numbers;
console.log(first, second); // 1 2

// 跳过元素
const [,, third] = numbers;
console.log(third); // 3

// 剩余元素
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// 默认值
const [a = 10, b = 20] = [1];
console.log(a, b); // 1 20
```

### 对象解构
```javascript
const person = { name: "张三", age: 25, city: "北京" };

// 基本解构
const { name, age } = person;
console.log(name, age); // "张三" 25

// 重命名
const { name: personName } = person;
console.log(personName); // "张三"

// 默认值
const { country = "中国" } = person;
console.log(country); // "中国"

// 嵌套解构
const user = {
  id: 1,
  profile: {
    name: "李四",
    email: "lisi@example.com"
  }
};

const { profile: { name: userName, email } } = user;
console.log(userName, email); // "李四" "lisi@example.com"
```

## 箭头函数

```javascript
// 传统函数
const add = function(a, b) {
  return a + b;
};

// 箭头函数
const addArrow = (a, b) => a + b;

// 多参数需要括号
const multiply = (x, y) => x * y;

// 单参数可以省略括号
const square = x => x * x;

// 多行函数体需要大括号
const greet = name => {
  const message = `Hello, ${name}!`;
  return message;
};

// 返回对象需要括号
const createPerson = (name, age) => ({ name, age });
```

## 类（Class）

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // 实例方法
  greet() {
    return `你好，我是${this.name}，今年${this.age}岁。`;
  }
  
  // 静态方法
  static species() {
    return "Homo sapiens";
  }
  
  // 获取器
  get info() {
    return `${this.name} (${this.age}岁)`;
  }
  
  // 设置器
  set birthYear(year) {
    this.age = new Date().getFullYear() - year;
  }
}

// 继承
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age); // 调用父类构造函数
    this.grade = grade;
  }
  
  study() {
    return `${this.name} 正在学习`;
  }
  
  // 重写父类方法
  greet() {
    return `${super.greet()} 我是${this.grade}年级的学生。`;
  }
}
```

## 模块导入导出

### 导出（export）
```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export default class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// 也可以这样导出
const subtract = (a, b) => a - b;
export { subtract };
```

### 导入（import）
```javascript
// main.js
import Calculator, { PI, add, subtract } from './math.js';

const calc = new Calculator();
console.log(PI); // 3.14159
console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
console.log(calc.multiply(3, 4)); // 12

// 导入所有内容
import * as math from './math.js';
console.log(math.PI); // 3.14159
console.log(math.add(2, 3)); // 5
```

## 其他重要特性

### 展开运算符
```javascript
// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// 函数参数展开
const numbers = [1, 2, 3, 4, 5];
const max = Math.max(...numbers); // 5
```

### 剩余参数
```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15
```

### 对象属性简写
```javascript
const name = "张三";
const age = 25;

// ES5
const person1 = {
  name: name,
  age: age,
  greet: function() {
    return "Hello!";
  }
};

// ES6+
const person2 = {
  name, // 属性简写
  age,  // 属性简写
  greet() { // 方法简写
    return "Hello!";
  }
};
```

### Symbol 类型
```javascript
const sym1 = Symbol("description");
const sym2 = Symbol("description");

console.log(sym1 === sym2); // false

// 用作对象属性
const obj = {
  [sym1]: "私有属性",
  public: "公共属性"
};

console.log(obj[Symbol("description")]); // undefined
console.log(obj[sym1]); // "私有属性"
```