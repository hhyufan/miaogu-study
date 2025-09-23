// 个人资料页面JavaScript功能

// 默认的个人介绍内容（使用简单HTML）
const defaultBioContent = `<h2>👋 你好，我是 hhyufan</h2>

<p>一名热爱编程的开发者，专注于桌面应用开发和用户体验设计。</p>

<h3>🔧 技术栈</h3>
<ul>
    <li><strong>桌面开发</strong>：Rainmeter 皮肤开发，系统组件定制</li>
    <li><strong>前端技术</strong>：HTML、CSS、JavaScript</li>
    <li><strong>编程语言</strong>：Python、Java、C/C++</li>
    <li><strong>工具与框架</strong>：Git、GitHub、Visual Studio Code</li>
</ul>

<h3>🚀 项目亮点</h3>
<p>我开发了一系列 <strong>Rainmeter 桌面组件</strong>，包括：</p>
<ul>
    <li>📱 <strong>简约电量显示器</strong> - 实时显示电池状态，支持多级电量图标</li>
    <li>🔊 <strong>声音控制器</strong> - 可视化音量调节，磨砂玻璃视觉效果</li>
    <li>⚙️ <strong>系统监控组件</strong> - 自适应尺寸，支持个性化配置</li>
</ul>

<h3>💡 关于我</h3>
<p>我相信 <em>简约而不简单</em> 的设计理念，致力于创造既美观又实用的软件产品。在开发过程中，我注重用户体验和代码质量，喜欢探索新技术并将其应用到实际项目中。</p>

<blockquote>
    <p>"代码是诗歌，设计是艺术，而程序员是连接两者的桥梁。"</p>
</blockquote>

<p>📫 <strong>联系方式</strong>：通过 GitHub 与我交流技术话题！</p>`;

// 默认的Markdown个人介绍内容
const defaultBioMarkdown = `# 👋 你好，我是 hhyufan

一名热爱编程的开发者，专注于桌面应用开发和用户体验设计。

## 🔧 技术栈

- **桌面开发**：Rainmeter 皮肤开发，系统组件定制
- **前端技术**：HTML、CSS、JavaScript
- **编程语言**：Python、Java、C/C++
- **工具与框架**：Git、GitHub、Visual Studio Code

## 🚀 项目亮点

我开发了一系列 **Rainmeter 桌面组件**，包括：

- 📱 **简约电量显示器** - 实时显示电池状态，支持多级电量图标
- 🔊 **声音控制器** - 可视化音量调节，磨砂玻璃视觉效果
- ⚙️ **系统监控组件** - 自适应尺寸，支持个性化配置

## 💡 关于我

我相信 *简约而不简单* 的设计理念，致力于创造既美观又实用的软件产品。在开发过程中，我注重用户体验和代码质量，喜欢探索新技术并将其应用到实际项目中。

> "代码是诗歌，设计是艺术，而程序员是连接两者的桥梁。"

📫 **联系方式**：通过 GitHub 与我交流技术话题！`

// Markdown个人介绍相关功能
let isEditingBio = false;
let originalBioContent = '';

// 初始化个人介绍
function initBioContent() {
    // 从localStorage获取保存的内容，如果没有则使用默认内容
    const savedBio = localStorage.getItem('userBioMarkdown');
    const bioMarkdown = savedBio || defaultBioMarkdown;

    // 渲染Markdown内容
    renderMarkdownContent(bioMarkdown);
}

// 初始化个人介绍功能
function initBio() {
    const bioDisplay = document.getElementById('bio-display');
    const editBioBtn = document.getElementById('edit-bio-btn');
    const bioEditSection = document.getElementById('bio-edit-section');
    const markdownEditor = document.getElementById('markdown-editor');
    const saveBioBtn = document.getElementById('save-bio-btn');
    const cancelBioBtn = document.getElementById('cancel-bio-btn');
    const fileUploadSection = document.getElementById('file-upload-section');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');

    // 从本地存储加载个人介绍，如果没有则使用默认内容
    let currentBioContent = localStorage.getItem('bioContent') || defaultBioContent;

    // 初始化显示
    bioDisplay.innerHTML = currentBioContent;

    // 编辑按钮点击事件（暂时无功能）
    editBioBtn.addEventListener('click', function () {
        // 暂时无功能，只是一个铅笔图标
        console.log('编辑功能暂未实现');
    });

    // 保存按钮点击事件
    saveBioBtn.addEventListener('click', function () {
        const content = markdownEditor.value;
        currentBioContent = content;
        bioDisplay.innerHTML = content;
        localStorage.setItem('bioContent', content);

        // 隐藏编辑区域
        bioEditSection.style.display = 'none';
        bioDisplay.style.display = 'block';
        editBioBtn.style.display = 'inline-flex';


    });

    // 取消按钮点击事件
    cancelBioBtn.addEventListener('click', function () {
        // 恢复原内容
        markdownEditor.value = currentBioContent;

        // 隐藏编辑区域
        bioEditSection.style.display = 'none';
        bioDisplay.style.display = 'block';
        editBioBtn.style.display = 'inline-flex';
    });

    // 文件上传处理
    uploadBtn.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.md')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                markdownEditor.value = content;

            };
            reader.readAsText(file);
        } else {

        }
    });
}

// 渲染Markdown内容
function renderMarkdownContent(markdown) {
    const markdownContent = document.getElementById('markdownContent');
    if (markdownContent && typeof marked !== 'undefined') {
        // 配置marked选项
        marked.setOptions({
            breaks: true,
            gfm: true,
            sanitize: false
        });

        // 渲染Markdown为HTML
        markdownContent.innerHTML = marked.parse(markdown);
    }
}

// 切换编辑模式
function toggleBioEdit() {
    const fileUploadSection = document.getElementById('fileUploadSection');
    const editBtn = document.querySelector('.edit-bio-btn');

    if (!isEditingBio) {
        // 进入编辑模式
        isEditingBio = true;
        fileUploadSection.style.display = 'block';
        editBtn.innerHTML = '<i class="fas fa-eye"></i> 预览模式';

        // 获取当前的Markdown内容
        const currentBio = localStorage.getItem('userBioMarkdown') || defaultBioMarkdown;
        originalBioContent = currentBio;
        document.getElementById('markdownEditor').value = currentBio;

        // 实时预览
        setupLivePreview();
    } else {
        // 退出编辑模式
        cancelBioEdit();
    }
}

// 设置实时预览
function setupLivePreview() {
    const editor = document.getElementById('markdownEditor');
    if (editor) {
        editor.addEventListener('input', function () {
            const markdown = this.value;
            renderMarkdownContent(markdown);
        });
    }
}

// 保存个人介绍内容
function saveBioContent() {
    const editor = document.getElementById('markdownEditor');
    const newContent = editor.value.trim();

    if (newContent) {
        // 保存到localStorage
        localStorage.setItem('userBioMarkdown', newContent);

        // 渲染新内容
        renderMarkdownContent(newContent);

        // 退出编辑模式
        exitEditMode();

        // 显示保存成功提示

    } else {

    }
}

// 取消编辑
function cancelBioEdit() {
    // 恢复原始内容
    renderMarkdownContent(originalBioContent);
    exitEditMode();
}

// 退出编辑模式
function exitEditMode() {
    isEditingBio = false;
    const fileUploadSection = document.getElementById('fileUploadSection');
    const editBtn = document.querySelector('.edit-bio-btn');

    fileUploadSection.style.display = 'none';
    editBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑介绍';
}

// 处理文件上传
function initFileUpload() {
    const fileInput = document.getElementById('mdFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const content = e.target.result;
                    const editor = document.getElementById('markdownEditor');
                    if (editor) {
                        editor.value = content;
                        // 触发实时预览
                        renderMarkdownContent(content);

                    }
                };
                reader.readAsText(file);
            }
        });
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#238636' : type === 'error' ? '#da3633' : '#0969da'};
        color: #fff;
        padding: 12px 16px;
        border-radius: 6px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease-out;
    `;

    // 添加动画样式
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 生成学习贡献图
function generateContributionGraph() {
    const grid = document.getElementById('contributionGrid');
    if (!grid) return;

    // 清空现有内容
    grid.innerHTML = '';

    // 生成过去一年的数据（365天，53周）
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    // 计算需要的天数
    const totalDays = 365;
    const weeks = 53;

    // 生成随机学习数据
    const contributionData = generateRandomContributions(totalDays);

    // 创建贡献方块
    for (let week = 0; week < weeks; week++) {
        for (let day = 0; day < 7; day++) {
            const dayIndex = week * 7 + day;
            if (dayIndex >= totalDays) break;

            const dayElement = document.createElement('div');
            dayElement.className = 'contribution-day tooltip';

            const currentDate = new Date(oneYearAgo);
            currentDate.setDate(currentDate.getDate() + dayIndex);

            const contribution = contributionData[dayIndex];
            const level = getContributionLevel(contribution);

            dayElement.setAttribute('data-level', level);
            dayElement.setAttribute('data-tooltip',
                `${contribution} 次学习 在 ${formatDate(currentDate)}`);

            // 添加点击事件
            dayElement.addEventListener('click', () => {
                showDayDetails(currentDate, contribution);
            });

            grid.appendChild(dayElement);
        }
    }
}

// 生成随机贡献数据
function generateRandomContributions(days) {
    const contributions = [];
    for (let i = 0; i < days; i++) {
        // 模拟真实的学习模式：工作日更多，周末较少，偶尔休息
        const dayOfWeek = i % 7;
        let baseChance = 0.7; // 基础学习概率

        // 周末概率稍低
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseChance = 0.5;
        }

        // 随机生成学习次数
        if (Math.random() < baseChance) {
            contributions.push(Math.floor(Math.random() * 8) + 1); // 1-8次学习
        } else {
            contributions.push(0); // 没有学习
        }
    }
    return contributions;
}

// 根据贡献次数获取等级
function getContributionLevel(contributions) {
    if (contributions === 0) return 0;
    if (contributions <= 2) return 1;
    if (contributions <= 4) return 2;
    if (contributions <= 6) return 3;
    return 4;
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 显示某天的详细信息
function showDayDetails(date, contributions) {
    const message = contributions > 0
        ? `在 ${formatDate(date)} 这天，你学习了 ${contributions} 次！`
        : `在 ${formatDate(date)} 这天，你休息了一下。`;


}

// 更新统计数据
function updateStats() {
    // 模拟统计数据更新
    const stats = {
        studyDays: Math.floor(Math.random() * 100) + 200,
        noteCount: Math.floor(Math.random() * 50) + 100,
        projectCount: Math.floor(Math.random() * 20) + 10
    };

    // 更新显示的统计数字
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = stats.studyDays;
        statNumbers[1].textContent = stats.noteCount;
        statNumbers[2].textContent = stats.projectCount;
    }
}

// 添加技能标签交互
function initSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skill = tag.textContent;
            showSkillInfo(skill);
        });
    });
}

// 显示技能信息
function showSkillInfo(skill) {
    const skillInfo = {
        'JavaScript': '熟练掌握ES6+语法，了解异步编程和模块化开发',
        'Python': '熟悉Python基础语法，有数据分析和Web开发经验',
        'React': '掌握React Hooks，了解状态管理和组件设计模式',
        'Node.js': '了解后端开发，熟悉Express框架和RESTful API设计',
        '数据结构': '掌握常用数据结构：数组、链表、栈、队列、树、图',
        '算法': '熟悉排序、搜索、动态规划等常见算法',
        '机器学习': '了解基础概念，有使用scikit-learn的经验',
        'Web开发': '全栈开发经验，熟悉前后端分离架构'
    };

    const info = skillInfo[skill] || `正在学习 ${skill} 相关知识`;

}

// 笔记项目交互
function initNoteItems() {
    const noteItems = document.querySelectorAll('.note-item');
    noteItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 模拟跳转到笔记详情
            const noteTitle = item.querySelector('.note-title').textContent;
            showNotePreview(noteTitle, index);
        });
    });
}

// 显示笔记预览
function showNotePreview(title, index) {
    const previews = [
        {
            title: 'JavaScript异步编程详解',
            content: '本文深入探讨了JavaScript中的异步编程概念，包括Promise、async/await的使用方法和最佳实践...'
        },
        {
            title: 'React Hooks最佳实践',
            content: '介绍了React Hooks的核心概念，useState和useEffect的使用技巧，以及自定义Hook的开发...'
        },
        {
            title: '数据结构与算法复习',
            content: '总结了常用的数据结构和算法，包括时间复杂度分析、空间复杂度优化等重要概念...'
        }
    ];

    const preview = previews[index] || { title, content: '暂无预览内容' };

}

// 添加头像状态动画
function initAvatarAnimation() {
    const avatarStatus = document.querySelector('.avatar-status');
    if (avatarStatus) {
        // 添加呼吸动画效果
        avatarStatus.style.animation = 'pulse 2s infinite';

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化个人介绍内容
    initBioContent();

    // 初始化文件上传功能
    initFileUpload();

    // 生成贡献图
    generateContributionGraph();

    // 更新统计数据
    updateStats();

    // 初始化技能标签交互
    initSkillTags();

    // 初始化笔记项目交互
    initNoteItems();

    // 初始化头像动画
    initAvatarAnimation();

    // 添加页面加载动画
    const animatedElements = document.querySelectorAll('.profile-card, .activity-section, .skills-section, .recent-notes-section');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// 定期更新贡献图（模拟实时数据）
setInterval(() => {
    // 每30秒更新一次统计数据
    updateStats();
}, 30000);

// 生成随机贡献数据
function generateRandomContributions(days) {
    const contributions = [];
    for (let i = 0; i < days; i++) {
        // 模拟真实的学习模式：工作日更多，周末较少，偶尔休息
        const dayOfWeek = i % 7;
        let baseChance = 0.7; // 基础学习概率

        // 周末概率稍低
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseChance = 0.5;
        }

        // 随机生成学习次数
        if (Math.random() < baseChance) {
            contributions.push(Math.floor(Math.random() * 8) + 1); // 1-8次学习
        } else {
            contributions.push(0); // 没有学习
        }
    }
    return contributions;
}

// 根据贡献次数获取等级
function getContributionLevel(contributions) {
    if (contributions === 0) return 0;
    if (contributions <= 2) return 1;
    if (contributions <= 4) return 2;
    if (contributions <= 6) return 3;
    return 4;
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 显示某天的详细信息
function showDayDetails(date, contributions) {
    const message = contributions > 0
        ? `在 ${formatDate(date)} 这天，你学习了 ${contributions} 次！`
        : `在 ${formatDate(date)} 这天，你休息了一下。`;


}

// 更新统计数据
function updateStats() {
    // 模拟统计数据更新
    const stats = {
        studyDays: Math.floor(Math.random() * 100) + 200,
        noteCount: Math.floor(Math.random() * 50) + 100,
        projectCount: Math.floor(Math.random() * 20) + 10
    };

    // 更新显示的统计数字
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = stats.studyDays;
        statNumbers[1].textContent = stats.noteCount;
        statNumbers[2].textContent = stats.projectCount;
    }
}

// 添加技能标签交互
function initSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skill = tag.textContent;
            showSkillInfo(skill);
        });
    });
}

// 显示技能信息
function showSkillInfo(skill) {
    const skillInfo = {
        'JavaScript': '熟练掌握ES6+语法，了解异步编程和模块化开发',
        'Python': '熟悉Python基础语法，有数据分析和Web开发经验',
        'React': '掌握React Hooks，了解状态管理和组件设计模式',
        'Node.js': '了解后端开发，熟悉Express框架和RESTful API设计',
        '数据结构': '掌握常用数据结构：数组、链表、栈、队列、树、图',
        '算法': '熟悉排序、搜索、动态规划等常见算法',
        '机器学习': '了解基础概念，有使用scikit-learn的经验',
        'Web开发': '全栈开发经验，熟悉前后端分离架构'
    };

    const info = skillInfo[skill] || `正在学习 ${skill} 相关知识`;

}

// 笔记项目交互
function initNoteItems() {
    const noteItems = document.querySelectorAll('.note-item');
    noteItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 模拟跳转到笔记详情
            const noteTitle = item.querySelector('.note-title').textContent;
            showNotePreview(noteTitle, index);
        });
    });
}

// 显示笔记预览
function showNotePreview(title, index) {
    const previews = [
        {
            title: 'JavaScript异步编程详解',
            content: '本文深入探讨了JavaScript中的异步编程概念，包括Promise、async/await的使用方法和最佳实践...'
        },
        {
            title: 'React Hooks最佳实践',
            content: '介绍了React Hooks的核心概念，useState和useEffect的使用技巧，以及自定义Hook的开发...'
        },
        {
            title: '数据结构与算法复习',
            content: '总结了常用的数据结构和算法，包括时间复杂度分析、空间复杂度优化等重要概念...'
        }
    ];

    const preview = previews[index] || { title, content: '暂无预览内容' };

}

// 添加头像状态动画
function initAvatarAnimation() {
    const avatarStatus = document.querySelector('.avatar-status');
    if (avatarStatus) {
        // 添加呼吸动画效果
        avatarStatus.style.animation = 'pulse 2s infinite';

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化个人介绍内容
    initBioContent();

    // 初始化文件上传功能
    initFileUpload();

    // 生成贡献图
    generateContributionGraph();

    // 更新统计数据
    updateStats();

    // 初始化技能标签交互
    initSkillTags();

    // 初始化笔记项目交互
    initNoteItems();

    // 初始化头像动画
    initAvatarAnimation();

    // 添加页面加载动画
    const animatedElements = document.querySelectorAll('.profile-card, .activity-section, .skills-section, .recent-notes-section');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});
