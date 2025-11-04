# 对象与数组

对象和数组是 JavaScript 中最常用的数据结构，掌握它们的使用方法至关重要。

## 对象（Object）

### 创建对象
```javascript
// 对象字面量
const person = {
  name: "张三",
  age: 25,
  city: "北京"
};

// 构造函数
const car = new Object();
car.brand = "丰田";
car.model = "凯美瑞";

// Object.create
const prototype = { greet: function() { return "Hello!"; } };
const obj = Object.create(prototype);
```

### 访问属性
```javascript
const person = { name: "张三", age: 25 };

// 点符号
console.log(person.name); // "张三"

// 方括号符号
console.log(person["age"]); // 25

// 动态属性名
const prop = "name";
console.log(person[prop]); // "张三"
```

### 对象方法
```javascript
const calculator = {
  add: function(a, b) { return a + b; },
  subtract: (a, b) => a - b,
  multiply(a, b) { return a * b; } // ES6 简写
};

console.log(calculator.add(5, 3)); // 8
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
```

## 数组（Array）

### 创建数组
```javascript
// 数组字面量
const fruits = ["苹果", "香蕉", "橙子"];

// 构造函数
const numbers = new Array(1, 2, 3, 4, 5);

// Array.of
const moreNumbers = Array.of(6, 7, 8);

// Array.from
const fromString = Array.from("hello"); // ["h", "e", "l", "l", "o"]
```

### 常用数组方法
```javascript
const numbers = [1, 2, 3, 4, 5];

// map - 转换数组元素
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - 过滤数组元素
const even = numbers.filter(n => n % 2 === 0);
console.log(even); // [2, 4]

// reduce - 累积计算
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// find - 查找元素
const found = numbers.find(n => n > 3);
console.log(found); // 4

// includes - 检查包含
console.log(numbers.includes(3)); // true

// push/pop - 添加/删除元素
numbers.push(6);
console.log(numbers); // [1, 2, 3, 4, 5, 6]
numbers.pop();
console.log(numbers); // [1, 2, 3, 4, 5]
```

### 数组解构
```javascript
const colors = ["红色", "绿色", "蓝色"];

// 基本解构
const [first, second] = colors;
console.log(first, second); // "红色" "绿色"

// 跳过元素
const [,, third] = colors;
console.log(third); // "蓝色"

// 剩余元素
const [primary, ...others] = colors;
console.log(primary); // "红色"
console.log(others); // ["绿色", "蓝色"]
```

## 数组与对象的组合使用

```javascript
const students = [
  { name: "张三", age: 20, grades: [85, 92, 78] },
  { name: "李四", age: 21, grades: [90, 88, 85] },
  { name: "王五", age: 19, grades: [78, 85, 92] }
];

// 计算每个学生的平均分
const averages = students.map(student => ({
  name: student.name,
  average: student.grades.reduce((a, b) => a + b, 0) / student.grades.length
}));

console.log(averages);
// [
//   { name: "张三", average: 85 },
//   { name: "李四", average: 87.67 },
//   { name: "王五", average: 85 }
// ]
```