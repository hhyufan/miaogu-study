// 管理员仪表盘功能
document.addEventListener('DOMContentLoaded', function () {
    // 检查登录状态
    checkAdminAuth();

    // 加载仪表盘数据
    loadDashboardData();

    // 设置定时刷新
    setInterval(updateStats, 30000); // 每30秒更新一次统计数据
});

// 侧边栏切换功能
function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// 主题切换功能
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');

    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('adminTheme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('adminTheme', 'dark');
    }
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('adminLogin');
        sessionStorage.removeItem('adminLogin');
        window.location.href = 'login.html';
    }
}

// 检查管理员认证
function checkAdminAuth() {
    const adminLogin = localStorage.getItem('adminLogin') || sessionStorage.getItem('adminLogin');

    if (!adminLogin) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const loginData = JSON.parse(adminLogin);

        // 检查登录是否过期（24小时）
        const loginTime = new Date(loginData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        if (hoursDiff >= 24) {
            localStorage.removeItem('adminLogin');
            sessionStorage.removeItem('adminLogin');
            window.location.href = 'login.html';
            return;
        }

        // 显示管理员信息
        document.getElementById('adminUserName').textContent = loginData.name || loginData.username;

    } catch (e) {
        localStorage.removeItem('adminLogin');
        sessionStorage.removeItem('adminLogin');
        window.location.href = 'login.html';
    }
}

// 加载仪表盘数据
function loadDashboardData() {
    // 模拟从API获取数据
    const mockData = {
        stats: {
            totalUsers: 1234,
            totalNotes: 5678,
            totalQuestions: 2345,
            activeUsers: 456
        },
        recentActivity: [
            {
                type: 'user_action',
                title: '用户 hhyufan 创建了新笔记',
                time: '2分钟前',
                icon: 'info'
            },
            {
                type: 'content_review',
                title: '内容审核：通过了一篇笔记',
                time: '15分钟前',
                icon: 'check'
            },
            {
                type: 'user_register',
                title: '新用户注册：张三',
                time: '1小时前',
                icon: 'user'
            },
            {
                type: 'system',
                title: '系统自动备份完成',
                time: '2小时前',
                icon: 'system'
            },
            {
                type: 'content_review',
                title: '内容审核：拒绝了一篇笔记',
                time: '3小时前',
                icon: 'warning'
            }
        ],
        pendingItems: [
            {
                type: '内容审核',
                content: '笔记：《JavaScript高级编程技巧》',
                time: '2024-01-15 14:30',
                status: 'pending',
                id: 1
            },
            {
                type: '用户举报',
                content: '用户：违规内容举报',
                time: '2024-01-15 13:45',
                status: 'pending',
                id: 2
            },
            {
                type: '系统公告',
                content: '维护通知发布',
                time: '2024-01-15 12:00',
                status: 'published',
                id: 3
            }
        ]
    };

    // 更新统计数据
    updateStatsDisplay(mockData.stats);

    // 更新最近活动
    updateRecentActivity(mockData.recentActivity);

    // 更新待处理事项
    updatePendingItems(mockData.pendingItems);
}

// 更新统计数据显示
function updateStatsDisplay(stats) {
    document.getElementById('totalUsers').textContent = formatNumber(stats.totalUsers);
    document.getElementById('totalNotes').textContent = formatNumber(stats.totalNotes);
    document.getElementById('totalQuestions').textContent = formatNumber(stats.totalQuestions);
    document.getElementById('activeUsers').textContent = formatNumber(stats.activeUsers);
}

// 更新最近活动列表
function updateRecentActivity(activities) {
    const container = document.getElementById('recentActivity');
    container.innerHTML = '';

    activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        container.appendChild(activityElement);
    });
}

// 创建活动元素
function createActivityElement(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';

    const iconSvg = getActivityIcon(activity.icon);

    div.innerHTML = `
        <div class="activity-icon">
            ${iconSvg}
        </div>
        <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `;

    return div;
}

// 获取活动图标
function getActivityIcon(iconType) {
    const icons = {
        info: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>',
        check: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>',
        user: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28z"/></svg>',
        system: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/></svg>',
        warning: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>'
    };

    return icons[iconType] || icons.info;
}

// 更新待处理事项
function updatePendingItems(items) {
    const tbody = document.querySelector('#pendingItems');
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = createPendingItemRow(item);
        tbody.appendChild(row);
    });
}

// 创建待处理事项行
function createPendingItemRow(item) {
    const tr = document.createElement('tr');

    const statusClass = item.status === 'pending' ? 'status-inactive' : 'status-active';
    const statusText = item.status === 'pending' ? '待处理' : '已处理';

    tr.innerHTML = `
        <td>${item.type}</td>
        <td>${item.content}</td>
        <td>${item.time}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="handlePendingItem(${item.id})">处理</button>
                <button class="btn" onclick="viewPendingItem(${item.id})">查看</button>
            </div>
        </td>
    `;

    return tr;
}

// 处理待处理事项
function handlePendingItem(id) {
    alert(`处理事项 ID: ${id}`);
    // 这里可以添加具体的处理逻辑
}

// 查看待处理事项
function viewPendingItem(id) {
    alert(`查看事项 ID: ${id}`);
    // 这里可以添加具体的查看逻辑
}

// 更新统计数据（定时刷新）
function updateStats() {
    // 模拟数据变化
    const stats = {
        totalUsers: Math.floor(Math.random() * 100) + 1200,
        totalNotes: Math.floor(Math.random() * 200) + 5600,
        totalQuestions: Math.floor(Math.random() * 100) + 2300,
        activeUsers: Math.floor(Math.random() * 50) + 400
    };

    updateStatsDisplay(stats);
}

// 格式化数字显示
function formatNumber(num) {
    return num.toLocaleString();
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('adminLogin');
        sessionStorage.removeItem('adminLogin');
        window.location.href = 'login.html';
    }
}

// 主题切换
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}