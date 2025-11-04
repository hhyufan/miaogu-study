# 异步编程基础

异步编程是 JavaScript 的核心特性之一，它允许程序在等待某些操作完成时继续执行其他任务。

## 回调函数（Callback）

### 基本回调
```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: "张三", age: 25 };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log("收到数据:", data);
});
```

### 回调地狱
```javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        console.log(d);
      });
    });
  });
});
```

## Promise

### 创建 Promise
```javascript
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("操作成功！");
    } else {
      reject("操作失败！");
    }
  }, 1000);
});
```

### 使用 Promise
```javascript
myPromise
  .then(result => {
    console.log(result); // "操作成功！"
    return "处理后的结果";
  })
  .then(processedResult => {
    console.log(processedResult); // "处理后的结果"
  })
  .catch(error => {
    console.error("错误:", error);
  })
  .finally(() => {
    console.log("无论成功失败都会执行");
  });
```

### Promise.all
```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve) => {
  setTimeout(resolve, 100, "foo");
});

Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values); // [3, 42, "foo"]
  });
```

### Promise.race
```javascript
const promise1 = new Promise((resolve) => setTimeout(resolve, 500, "一"));
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, "二"));

Promise.race([promise1, promise2])
  .then(value => {
    console.log(value); // "二" (先完成的)
  });
```

## Async/Await

### 基本用法
```javascript
async function fetchUserData() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    console.log("用户数据:", data);
    return data;
  } catch (error) {
    console.error("获取用户数据失败:", error);
    throw error;
  }
}

// 使用
fetchUserData().then(data => {
  console.log("处理用户数据:", data);
});
```

### 多个异步操作
```javascript
async function processMultipleTasks() {
  try {
    // 串行执行
    const result1 = await task1();
    const result2 = await task2(result1);
    
    // 并行执行
    const [result3, result4] = await Promise.all([
      task3(),
      task4()
    ]);
    
    console.log("所有任务完成");
  } catch (error) {
    console.error("任务执行失败:", error);
  }
}
```

## 事件循环（Event Loop）

```javascript
console.log("1. 同步代码");

setTimeout(() => {
  console.log("2. 宏任务 (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. 微任务 (Promise)");
});

console.log("4. 同步代码");

// 输出顺序:
// 1. 同步代码
// 4. 同步代码
// 3. 微任务 (Promise)
// 2. 宏任务 (setTimeout)
```

## 实际应用示例

### 模拟 API 调用
```javascript
function simulateAPICall(endpoint, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        '/api/users': [{ id: 1, name: "张三" }, { id: 2, name: "李四" }],
        '/api/posts': [{ id: 1, title: "第一篇文章" }, { id: 2, title: "第二篇文章" }]
      };
      resolve(data[endpoint] || []);
    }, delay);
  });
}

// 使用 async/await
async function loadDashboard() {
  try {
    console.log("开始加载仪表板数据...");
    
    const [users, posts] = await Promise.all([
      simulateAPICall('/api/users'),
      simulateAPICall('/api/posts')
    ]);
    
    console.log("用户数据:", users);
    console.log("文章数据:", posts);
    console.log("仪表板数据加载完成！");
  } catch (error) {
    console.error("加载失败:", error);
  }
}

loadDashboard();
```