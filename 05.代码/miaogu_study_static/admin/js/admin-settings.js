// 系统设置页面JavaScript功能

// 全局变量
let announcements = [];
let backups = [];
let currentAnnouncementId = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
    loadSettings();
    loadAnnouncements();
    loadBackups();
    initializeTheme();
    setupFormHandlers();
});

// 检查管理员认证
function checkLoginStatus() {
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

// 加载设置
function loadSettings() {
    // 从localStorage加载设置，如果没有则使用默认值
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || {
        siteName: '喵咕学习平台',
        siteDescription: '一个专注于知识分享和学习的平台',
        siteKeywords: '学习,笔记,知识分享,在线教育',
        contactEmail: 'admin@miaogu.com',
        maxFileSize: 10,
        enableRegistration: true,
        enableComments: true,
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5
    };

    // 填充表单
    document.getElementById('siteName').value = settings.siteName;
    document.getElementById('siteDescription').value = settings.siteDescription;
    document.getElementById('siteKeywords').value = settings.siteKeywords;
    document.getElementById('contactEmail').value = settings.contactEmail;
    document.getElementById('maxFileSize').value = settings.maxFileSize;
    document.getElementById('enableRegistration').checked = settings.enableRegistration;
    document.getElementById('enableComments').checked = settings.enableComments;
    document.getElementById('minPasswordLength').value = settings.minPasswordLength;
    document.getElementById('requireUppercase').checked = settings.requireUppercase;
    document.getElementById('requireNumbers').checked = settings.requireNumbers;
    document.getElementById('requireSpecialChars').checked = settings.requireSpecialChars;
    document.getElementById('sessionTimeout').value = settings.sessionTimeout;
    document.getElementById('maxLoginAttempts').value = settings.maxLoginAttempts;
}

// 加载公告数据
function loadAnnouncements() {
    // 模拟公告数据
    announcements = JSON.parse(localStorage.getItem('announcements')) || [
        {
            id: 1,
            title: '系统维护通知',
            type: 'warning',
            content: '系统将于今晚22:00-24:00进行维护，期间可能无法正常访问。',
            active: true,
            created: '2024-01-15 10:00:00'
        },
        {
            id: 2,
            title: '新功能上线',
            type: 'success',
            content: '笔记分享功能已正式上线，欢迎大家使用！',
            active: true,
            created: '2024-01-14 15:30:00'
        },
        {
            id: 3,
            title: '用户协议更新',
            type: 'info',
            content: '我们更新了用户协议，请查看最新版本。',
            active: false,
            created: '2024-01-13 09:15:00'
        }
    ];

    displayAnnouncements();
}

// 显示公告列表
function displayAnnouncements() {
    const tbody = document.getElementById('announcementsTableBody');
    tbody.innerHTML = '';

    announcements.forEach(announcement => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${announcement.id}</td>
            <td>${announcement.title}</td>
            <td>
                <span class="type-badge type-${announcement.type}">
                    ${getTypeName(announcement.type)}
                </span>
            </td>
            <td>
                <span class="status-badge status-${announcement.active ? 'active' : 'inactive'}">
                    ${announcement.active ? '已发布' : '未发布'}
                </span>
            </td>
            <td>${formatDate(announcement.created)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm" onclick="editAnnouncement(${announcement.id})" title="编辑">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V14.5h2.793L11.207 9z"/>
                        </svg>
                    </button>
                    <button class="btn btn-sm ${announcement.active ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleAnnouncementStatus(${announcement.id})" 
                            title="${announcement.active ? '取消发布' : '发布'}">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            ${announcement.active ?
                '<path d="M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>' :
                '<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>'
            }
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAnnouncement(${announcement.id})" title="删除">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 获取类型名称
function getTypeName(type) {
    const types = {
        'info': '信息',
        'warning': '警告',
        'success': '成功',
        'error': '错误'
    };
    return types[type] || type;
}

// 加载备份数据
function loadBackups() {
    // 模拟备份数据
    backups = JSON.parse(localStorage.getItem('backups')) || [
        {
            id: 1,
            filename: 'backup_2024-01-15_10-30-00.sql',
            size: '2.5 MB',
            created: '2024-01-15 10:30:00'
        },
        {
            id: 2,
            filename: 'backup_2024-01-14_10-30-00.sql',
            size: '2.3 MB',
            created: '2024-01-14 10:30:00'
        },
        {
            id: 3,
            filename: 'backup_2024-01-13_10-30-00.sql',
            size: '2.1 MB',
            created: '2024-01-13 10:30:00'
        }
    ];

    displayBackups();
}

// 显示备份列表
function displayBackups() {
    const tbody = document.getElementById('backupTableBody');
    tbody.innerHTML = '';

    backups.forEach(backup => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${backup.filename}</td>
            <td>${backup.size}</td>
            <td>${formatDate(backup.created)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-success" onclick="downloadBackup(${backup.id})" title="下载">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBackup(${backup.id})" title="删除">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 设置表单处理器
function setupFormHandlers() {
    // 基本设置表单
    document.getElementById('generalSettingsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveGeneralSettings();
    });

    // 安全设置表单
    document.getElementById('securitySettingsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveSecuritySettings();
    });

    // 修改密码表单
    document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
        e.preventDefault();
        changePassword();
    });
}

// 保存基本设置
function saveGeneralSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        siteDescription: document.getElementById('siteDescription').value,
        siteKeywords: document.getElementById('siteKeywords').value,
        contactEmail: document.getElementById('contactEmail').value,
        maxFileSize: parseInt(document.getElementById('maxFileSize').value),
        enableRegistration: document.getElementById('enableRegistration').checked,
        enableComments: document.getElementById('enableComments').checked
    };

    // 合并现有设置
    const existingSettings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    const updatedSettings = { ...existingSettings, ...settings };

    localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
    showMessage('基本设置已保存', 'success');
}

// 保存安全设置
function saveSecuritySettings() {
    const settings = {
        minPasswordLength: parseInt(document.getElementById('minPasswordLength').value),
        requireUppercase: document.getElementById('requireUppercase').checked,
        requireNumbers: document.getElementById('requireNumbers').checked,
        requireSpecialChars: document.getElementById('requireSpecialChars').checked,
        sessionTimeout: parseInt(document.getElementById('sessionTimeout').value),
        maxLoginAttempts: parseInt(document.getElementById('maxLoginAttempts').value)
    };

    // 合并现有设置
    const existingSettings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    const updatedSettings = { ...existingSettings, ...settings };

    localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
    showMessage('安全设置已保存', 'success');
}

// 修改密码
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showMessage('新密码和确认密码不匹配', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showMessage('新密码长度不能少于8位', 'error');
        return;
    }

    // 这里应该调用后端API验证当前密码并更新
    // 模拟成功
    showMessage('密码修改成功', 'success');

    // 清空表单
    document.getElementById('changePasswordForm').reset();
}

// 显示标签页
function showTab(tabName) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // 移除所有标签按钮的active类
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 显示选中的标签页
    document.getElementById(tabName + 'Tab').classList.add('active');

    // 激活对应的标签按钮
    event.target.classList.add('active');
}

// 显示添加公告模态框
function showAddAnnouncementModal() {
    currentAnnouncementId = null;
    document.getElementById('announcementModalTitle').textContent = '添加公告';
    document.getElementById('announcementForm').reset();
    document.getElementById('announcementModal').style.display = 'block';
}

// 编辑公告
function editAnnouncement(id) {
    const announcement = announcements.find(a => a.id === id);
    if (!announcement) return;

    currentAnnouncementId = id;
    document.getElementById('announcementModalTitle').textContent = '编辑公告';
    document.getElementById('announcementTitle').value = announcement.title;
    document.getElementById('announcementType').value = announcement.type;
    document.getElementById('announcementContent').value = announcement.content;
    document.getElementById('announcementActive').checked = announcement.active;
    document.getElementById('announcementModal').style.display = 'block';
}

// 保存公告
function saveAnnouncement() {
    const title = document.getElementById('announcementTitle').value;
    const type = document.getElementById('announcementType').value;
    const content = document.getElementById('announcementContent').value;
    const active = document.getElementById('announcementActive').checked;

    if (!title || !content) {
        showMessage('请填写完整信息', 'error');
        return;
    }

    if (currentAnnouncementId) {
        // 编辑现有公告
        const announcement = announcements.find(a => a.id === currentAnnouncementId);
        if (announcement) {
            announcement.title = title;
            announcement.type = type;
            announcement.content = content;
            announcement.active = active;
        }
        showMessage('公告已更新', 'success');
    } else {
        // 添加新公告
        const newAnnouncement = {
            id: Math.max(...announcements.map(a => a.id), 0) + 1,
            title,
            type,
            content,
            active,
            created: new Date().toLocaleString('zh-CN')
        };
        announcements.unshift(newAnnouncement);
        showMessage('公告已添加', 'success');
    }

    localStorage.setItem('announcements', JSON.stringify(announcements));
    displayAnnouncements();
    closeAnnouncementModal();
}

// 切换公告状态
function toggleAnnouncementStatus(id) {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
        announcement.active = !announcement.active;
        localStorage.setItem('announcements', JSON.stringify(announcements));
        displayAnnouncements();
        showMessage(`公告已${announcement.active ? '发布' : '取消发布'}`, 'success');
    }
}

// 删除公告
function deleteAnnouncement(id) {
    if (confirm('确定要删除这个公告吗？')) {
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        displayAnnouncements();
        showMessage('公告已删除', 'success');
    }
}

// 关闭公告模态框
function closeAnnouncementModal() {
    document.getElementById('announcementModal').style.display = 'none';
    currentAnnouncementId = null;
}

// 创建备份
function createBackup() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup_${timestamp}.sql`;

    const newBackup = {
        id: Math.max(...backups.map(b => b.id), 0) + 1,
        filename,
        size: (Math.random() * 3 + 1).toFixed(1) + ' MB',
        created: now.toLocaleString('zh-CN')
    };

    backups.unshift(newBackup);
    localStorage.setItem('backups', JSON.stringify(backups));
    displayBackups();
    showMessage('备份创建成功', 'success');
}

// 显示恢复模态框
function showRestoreModal() {
    document.getElementById('restoreModal').style.display = 'block';
}

// 关闭恢复模态框
function closeRestoreModal() {
    document.getElementById('restoreModal').style.display = 'none';
    document.getElementById('backupFile').value = '';
}

// 恢复备份
function restoreBackup() {
    const fileInput = document.getElementById('backupFile');
    if (!fileInput.files.length) {
        showMessage('请选择备份文件', 'error');
        return;
    }

    if (confirm('确定要恢复备份吗？这将覆盖当前所有数据！')) {
        // 模拟恢复过程
        showMessage('备份恢复成功', 'success');
        closeRestoreModal();
    }
}

// 下载备份
function downloadBackup(id) {
    const backup = backups.find(b => b.id === id);
    if (backup) {
        // 模拟下载
        showMessage(`正在下载 ${backup.filename}`, 'info');
    }
}

// 删除备份
function deleteBackup(id) {
    if (confirm('确定要删除这个备份文件吗？')) {
        backups = backups.filter(b => b.id !== id);
        localStorage.setItem('backups', JSON.stringify(backups));
        displayBackups();
        showMessage('备份文件已删除', 'success');
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // 添加到页面
    document.body.appendChild(messageDiv);

    // 3秒后自动移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('collapsed');
}

// 初始化主题
function initializeTheme() {
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('adminTheme', newTheme);
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }
}

// 点击模态框外部关闭
window.onclick = function (event) {
    const announcementModal = document.getElementById('announcementModal');
    const restoreModal = document.getElementById('restoreModal');

    if (event.target === announcementModal) {
        closeAnnouncementModal();
    }

    if (event.target === restoreModal) {
        closeRestoreModal();
    }
}