// 主要JavaScript功能文件

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化主题
    initializeTheme();

    // 初始化响应式菜单
    handleResponsiveMenu();

    // 添加加载动画
    addLoadingAnimation();

    // 显示主要内容
    showMainContent();

    // 初始化通知系统
    initializeNotifications();

    // 初始化登录状态显示
    initializeLoginStatus();
});

// 初始化登录状态显示
function initializeLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        // 可以在这里添加显示用户名的逻辑
        console.log('当前登录用户:', username);
    }
}

// 退出登录功能
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setTimeout(() => {
        window.location.href = 'pages/PlatForm.html';
    }, 1000);
}

// 将logout函数暴露到全局作用域
window.logout = logout;

// 主题切换功能
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 通知系统
function initializeNotifications() {
    // 创建通知容器
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    if (!container) {
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // 自动移除通知
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 响应式菜单处理
function handleResponsiveMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    // 点击外部关闭菜单
    document.addEventListener('click', function (event) {
        if (sidebar && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// 加载动画
function addLoadingAnimation() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        setTimeout(() => {
            element.classList.add('loaded');
        }, Math.random() * 1000 + 500);
    });
}

// 显示主要内容
function showMainContent() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.5s ease-in-out';
            mainContent.style.opacity = '1';
        }, 100);
    }
}

// 章节切换功能
function toggleChapter(chapterId) {
    const topics = document.getElementById(`topics-${chapterId}`);
    const arrow = document.getElementById(`arrow-${chapterId}`);

    if (topics && arrow) {
        if (topics.classList.contains('show')) {
            topics.classList.remove('show');
            arrow.classList.remove('expanded');
        } else {
            topics.classList.add('show');
            arrow.classList.add('expanded');
        }
    }
}

// 确保函数在全局作用域中可用
window.toggleChapter = toggleChapter;

// 笔记详情显示功能
function showNoteDetail(noteId) {
    // 移除所有笔记的活跃状态
    document.querySelectorAll('.topic-item').forEach(item => {
        item.classList.remove('active');
    });

    // 添加活跃状态到当前点击的笔记
    const clickedNote = event.target.closest('.topic-item');
    if (clickedNote) {
        clickedNote.classList.add('active');
    }

    const noteData = getNoteData(noteId);
    if (!noteData) {

        return;
    }

    // 获取相关笔记
    const relatedNotes = [
        {
            chapter: 'JavaScript基础',
            title: '异步编程和Promise',
            time: '2024-01-14',
            preview: '学习JavaScript中的异步编程概念，包括Promise、async/await等...',
            tags: ['JavaScript', '异步', 'Promise']
        },
        {
            chapter: 'React框架',
            title: '状态管理最佳实践',
            time: '2024-01-13',
            preview: '深入了解React中的状态管理，包括Context API、Redux等...',
            tags: ['React', '状态管理', '最佳实践']
        },
        {
            chapter: 'JavaScript基础',
            title: '原型链和继承',
            time: '2024-01-12',
            preview: '理解JavaScript的原型链机制和面向对象编程...',
            tags: ['JavaScript', '原型链', '继承']
        }
    ].filter(note => note.title !== noteData.title).slice(0, 3);

    // 获取中间内容区域和右侧边栏
    const mainContent = document.querySelector('.main-content');
    const rightSidebar = document.querySelector('.right-sidebar');

    // 隐藏右侧边栏
    rightSidebar.style.display = 'none';

    // 让中间内容区域占据全宽
    mainContent.style.gridColumn = 'span 2';

    // 替换中间内容区域为笔记内容，占据全宽
    mainContent.innerHTML = `
        <div class="note-detail-view" style="max-width: 100%; width: 100%;">
            <div class="note-header">
                <button class="back-btn" onclick="restoreOriginalContent()">
                    <i class="fas fa-arrow-left"></i> 返回学习动态
                </button>
                <h1>${noteData.title}</h1>
                <div class="note-meta">
                    <span class="note-time">最后修改: ${noteData.lastModified}</span>
                    <div class="note-tags">
                        ${noteData.tags.map(tag => `<span class="note-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="note-content">
                <div class="markdown-content" style="max-width: 100%; padding: 20px;">
                    ${noteData.content}
                </div>
            </div>
        </div>
    `;


}

// 恢复原始内容的函数
function restoreOriginalContent() {
    const mainContent = document.querySelector('.main-content');
    const rightSidebar = document.querySelector('.right-sidebar');

    // 恢复布局样式
    rightSidebar.style.display = 'block';
    mainContent.style.gridColumn = '';

    // 恢复中间内容区域为学习动态
    mainContent.innerHTML = `
        <!-- 动态内容 -->
        <div class="content-header">
            <h2>学习动态</h2>
            <div class="filter-buttons">
                <button class="filter-btn active">全部</button>
                <button class="filter-btn">最新</button>
                <button class="filter-btn">笔记</button>
            </div>
        </div>

        <div class="feed">
            <div class="feed-item">
                <div class="feed-header-info">
                    <img src="assets/hhyufan.jpg" alt="用户头像" class="user-avatar">
                    <div class="user-details">
                        <div class="first-line">
                            <span class="username">hhyufan</span>
                            <span class="action">置顶了笔记</span>
                        </div>
                        <span class="time">昨天</span>
                    </div>
                </div>
                <div class="feed-content">
                    <div class="content-title">
                        <h4>JavaScript 高级特性学习</h4>
                    </div>
                    <div class="content-description">
                        <p>深入学习了闭包、原型链和异步编程的核心概念...</p>
                        <div class="content-tags">
                            <span class="tag">JavaScript</span>
                            <span class="tag">前端开发</span>
                            <span class="tag">高级特性</span>
                        </div>
                        <div class="feed-stats">
                            <span><i class="fas fa-eye"></i> 23 次查看</span>
                            <span><i class="fas fa-heart"></i> 5 个赞</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="feed-item">
                <div class="feed-header-info">
                    <img src="assets/hhyufan.jpg" alt="用户头像" class="user-avatar">
                    <div class="user-details">
                        <div class="first-line">
                            <span class="username">学习小助手</span>
                            <span class="action">发布了</span>
                        </div>
                        <span class="time">3天前</span>
                    </div>
                </div>
                <div class="feed-content">
                    <div class="content-title">
                        <h4>v2025.9.15 学习计划更新</h4>
                    </div>
                    <div class="content-description">
                        <p>本周学习重点：React Hooks 深入理解与实践应用</p>
                        <div class="content-tags">
                            <span class="tag">React</span>
                            <span class="tag">学习计划</span>
                            <span class="tag">Hooks</span>
                        </div>
                        <div class="feed-stats">
                            <span><i class="fas fa-tasks"></i> 进度 75%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 恢复右侧边栏为最新题目
    rightSidebar.innerHTML = `
        <div class="sidebar-header">
            <h2>最新题目</h2>
        </div>
        <div class="notes-list">
            <div class="note-item">
                <div class="note-header">
                    <h4>分享只读 Sparks 与受控数据...</h4>
                    <span class="note-time">8小时前</span>
                </div>
                <p class="note-preview">关于数据控制和共享机制的深入探讨...</p>
                <div class="note-tags">
                    <span class="note-tag">数据</span>
                </div>
            </div>
            <div class="note-item">
                <div class="note-header">
                    <h4>委托绕过控制推送保护现在...</h4>
                    <span class="note-time">昨天</span>
                </div>
                <p class="note-preview">安全机制和权限控制的相关内容...</p>
                <div class="note-tags">
                    <span class="note-tag">安全</span>
                </div>
            </div>
            <div class="note-item">
                <div class="note-header">
                    <h4>Conda 生态系统支持依赖机器人现在...</h4>
                    <span class="note-time">昨天</span>
                </div>
                <p class="note-preview">包管理和依赖处理的最新进展...</p>
                <div class="note-tags">
                    <span class="note-tag">工具</span>
                </div>
            </div>
            <div class="note-item">
                <div class="note-header">
                    <h4>Anthropic Claude Opus 4.1 现在在公共...</h4>
                    <span class="note-time">昨天</span>
                </div>
                <p class="note-preview">AI模型的最新更新和功能介绍...</p>
                <div class="note-tags">
                    <span class="note-tag">AI</span>
                </div>
            </div>
        </div>
    `;


}

// 将函数绑定到全局作用域
window.restoreOriginalContent = restoreOriginalContent;
window.showNoteDetail = showNoteDetail;

// 关闭Markdown查看器
function closeMarkdownViewer() {
    const markdownViewer = document.getElementById('markdownViewer');
    if (markdownViewer) {
        markdownViewer.classList.remove('show');
        setTimeout(() => {
            markdownViewer.style.display = 'none';
        }, 300);
    }
}

// 确保函数在全局作用域中可用
window.closeMarkdownViewer = closeMarkdownViewer;

// 获取笔记数据
function getNoteData(noteId) {
    // ID到文件名的映射
    const idToFileName = {
        'note1': '变量与数据类型.md',
        'note2': '函数与作用域.md',
        'note3': '对象与数组.md',
        'note4': 'Hooks 深入理解.md',
        'note5': '状态管理最佳实践.md',
        'note6': '排序算法总结.md',
        'note7': '二叉树遍历.md',
        'note8': '动态规划入门.md'
    };

    // 根据ID获取文件名
    const fileName = idToFileName[noteId];
    if (!fileName) {
        console.error('未找到笔记ID:', noteId);
        return null;
    }

    const noteData = {
        '变量与数据类型.md': {
            id: 'note1',
            title: 'JavaScript 变量和数据类型',
            lastModified: '2024-01-15',
            tags: ['JavaScript', '基础', '变量'],
            content: `
                <h1>JavaScript 变量和数据类型</h1>
                
                <h2>变量声明</h2>
                <p>JavaScript 中有三种声明变量的方式：</p>
                <ul>
                    <li><code class="inline-code">var</code> - 函数作用域或全局作用域</li>
                    <li><code class="inline-code">let</code> - 块级作用域</li>
                    <li><code class="inline-code">const</code> - 块级作用域，常量</li>
                </ul>
                
                <div class="code-block">
                    <code class="language-javascript">
// var 声明
var name = "张三";

// let 声明
let age = 25;

// const 声明
const PI = 3.14159;
                    </code>
                </div>
                
                <h2>数据类型</h2>
                <p>JavaScript 有以下基本数据类型：</p>
                <ul>
                    <li><strong>Number</strong> - 数字类型</li>
                    <li><strong>String</strong> - 字符串类型</li>
                    <li><strong>Boolean</strong> - 布尔类型</li>
                    <li><strong>Undefined</strong> - 未定义</li>
                    <li><strong>Null</strong> - 空值</li>
                    <li><strong>Symbol</strong> - 符号类型</li>
                    <li><strong>BigInt</strong> - 大整数类型</li>
                </ul>
            `
        },
        '函数与作用域.md': {
            id: 'note2',
            title: 'JavaScript 函数和作用域',
            lastModified: '2024-01-16',
            tags: ['JavaScript', '函数', '作用域'],
            content: `
                <h1>JavaScript 函数和作用域</h1>
                
                <h2>函数声明</h2>
                <p>JavaScript 中有多种定义函数的方式：</p>
                
                <div class="code-block">
                    <code class="language-javascript">
// 函数声明
function greet(name) {
    return "Hello, " + name + "!";
}

// 函数表达式
const greet2 = function(name) {
    return "Hello, " + name + "!";
};

// 箭头函数
const greet3 = (name) => {
    return "Hello, " + name + "!";
};
                    </code>
                </div>
                
                <h2>作用域</h2>
                <p>JavaScript 中的作用域决定了变量的可访问性：</p>
                <ul>
                    <li><strong>全局作用域</strong> - 在整个程序中都可访问</li>
                    <li><strong>函数作用域</strong> - 只在函数内部可访问</li>
                    <li><strong>块级作用域</strong> - 只在代码块内部可访问</li>
                </ul>
            `
        },
        '对象与数组.md': {
            id: 'note3',
            title: 'JavaScript 对象和数组',
            lastModified: '2024-01-17',
            tags: ['JavaScript', '对象', '数组'],
            content: `
                <h1>JavaScript 对象和数组</h1>
                
                <h2>对象基础</h2>
                <p>JavaScript 对象是键值对的集合：</p>
                
                <div class="code-block">
                    <code class="language-javascript">
// 对象字面量
const person = {
    name: "张三",
    age: 30,
    city: "北京"
};

// 访问属性
console.log(person.name); // "张三"
console.log(person["age"]); // 30
                    </code>
                </div>
                
                <h2>数组基础</h2>
                <p>数组是有序的数据集合：</p>
                
                <div class="code-block">
                    <code class="language-javascript">
// 数组字面量
const fruits = ["苹果", "香蕉", "橙子"];

// 数组方法
fruits.push("葡萄"); // 添加元素
fruits.pop(); // 删除最后一个元素
fruits.length; // 获取长度
                    </code>
                </div>
            `
        },
        'Hooks 深入理解.md': {
            id: 'note4',
            title: 'React Hooks 深入理解',
            lastModified: '2024-01-18',
            tags: ['React', 'Hooks', '进阶'],
            content: `
                <h1>React Hooks 深入理解</h1>
                
                <h2>useState Hook</h2>
                <p>useState 是最基本的 Hook，用于在函数组件中添加状态：</p>
                
                <div class="code-block">
                    <code class="language-javascript">
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>
                点击我
            </button>
        </div>
    );
}
                    </code>
                </div>
                
                <h2>useEffect Hook</h2>
                <p>useEffect 用于处理副作用，如数据获取、订阅等：</p>
                
                <div class="code-block">
                    <code class="language-javascript">
import React, { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = \`你点击了 \${count} 次\`;
    });
    
    return (
        <div>
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>
                点击我
            </button>
        </div>
    );
}
                    </code>
                </div>
            `
        },
        '状态管理最佳实践.md': {
            id: 'note5',
            title: 'React 状态管理最佳实践',
            lastModified: '2024-01-19',
            tags: ['React', '状态管理', '最佳实践'],
            content: `
                <h1>React 状态管理最佳实践</h1>
                
                <h2>状态提升</h2>
                <p>当多个组件需要共享状态时，应该将状态提升到它们的共同父组件中：</p>
                
                <div class="code-block">
                    <code class="language-javascript">
function Parent() {
    const [sharedState, setSharedState] = useState('');
    
    return (
        <div>
            <ChildA state={sharedState} setState={setSharedState} />
            <ChildB state={sharedState} />
        </div>
    );
}
                    </code>
                </div>
                
                <h2>Context API</h2>
                <p>对于深层嵌套的组件，可以使用 Context API 避免 prop drilling：</p>
                
                <div class="code-block">
                    <code class="language-javascript">
const ThemeContext = React.createContext();

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <Toolbar />
        </ThemeContext.Provider>
    );
}

function Toolbar() {
    return (
        <div>
            <ThemedButton />
        </div>
    );
}

function ThemedButton() {
    const theme = useContext(ThemeContext);
    return <button className={theme}>按钮</button>;
}
                    </code>
                </div>
            `
        }
    };

    return noteData[fileName] || null;
}

console.log('Script.js loaded successfully');