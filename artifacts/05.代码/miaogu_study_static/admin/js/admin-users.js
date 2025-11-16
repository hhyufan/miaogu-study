// 用户管理页面功能
let currentPage = 1;
let totalPages = 1;
let usersData = [];
let filteredUsers = [];

document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkAdminAuth();
    
    // 加载用户数据
    loadUsersData();
    
    // 初始化主题
    initTheme();
});

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

// 加载用户数据
function loadUsersData() {
    // 模拟从API获取用户数据
    usersData = [
        {
            id: 1,
            username: 'hhyufan',
            email: 'hhyufan@example.com',
            role: 'admin',
            status: 'active',
            registerTime: '2024-01-10 10:30:00',
            lastLogin: '2024-01-15 14:25:00'
        },
        {
            id: 2,
            username: 'zhangsan',
            email: 'zhangsan@example.com',
            role: 'user',
            status: 'active',
            registerTime: '2024-01-12 09:15:00',
            lastLogin: '2024-01-15 13:45:00'
        },
        {
            id: 3,
            username: 'lisi',
            email: 'lisi@example.com',
            role: 'vip',
            status: 'active',
            registerTime: '2024-01-13 16:20:00',
            lastLogin: '2024-01-14 20:10:00'
        },
        {
            id: 4,
            username: 'wangwu',
            email: 'wangwu@example.com',
            role: 'user',
            status: 'inactive',
            registerTime: '2024-01-08 11:45:00',
            lastLogin: '2024-01-10 15:30:00'
        },
        {
            id: 5,
            username: 'zhaoliu',
            email: 'zhaoliu@example.com',
            role: 'user',
            status: 'banned',
            registerTime: '2024-01-05 14:00:00',
            lastLogin: '2024-01-08 09:20:00'
        },
        {
            id: 6,
            username: 'sunqi',
            email: 'sunqi@example.com',
            role: 'vip',
            status: 'active',
            registerTime: '2024-01-14 08:30:00',
            lastLogin: '2024-01-15 12:15:00'
        }
    ];
    
    filteredUsers = [...usersData];
    displayUsers();
}

// 显示用户列表
function displayUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    const itemsPerPage = 10;
    totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);
    
    currentUsers.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
    
    updatePagination();
}

// 创建用户行
function createUserRow(user) {
    const tr = document.createElement('tr');
    
    const statusClass = getStatusClass(user.status);
    const statusText = getStatusText(user.status);
    const roleText = getRoleText(user.role);
    
    tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td><span class="role-badge role-${user.role}">${roleText}</span></td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${user.registerTime}</td>
        <td>${user.lastLogin}</td>
        <td>
            <div class="btn-group">
                <button class="btn btn-sm" onclick="editUser(${user.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">删除</button>
                ${user.status === 'banned' ? 
                    `<button class="btn btn-sm btn-success" onclick="unbanUser(${user.id})">解封</button>` :
                    `<button class="btn btn-sm btn-warning" onclick="banUser(${user.id})">封禁</button>`
                }
            </div>
        </td>
    `;
    
    return tr;
}

// 获取状态样式类
function getStatusClass(status) {
    const statusClasses = {
        'active': 'status-active',
        'inactive': 'status-inactive',
        'banned': 'status-banned'
    };
    return statusClasses[status] || 'status-inactive';
}

// 获取状态文本
function getStatusText(status) {
    const statusTexts = {
        'active': '活跃',
        'inactive': '非活跃',
        'banned': '已封禁'
    };
    return statusTexts[status] || '未知';
}

// 获取角色文本
function getRoleText(role) {
    const roleTexts = {
        'user': '普通用户',
        'vip': 'VIP用户',
        'admin': '管理员'
    };
    return roleTexts[role] || '未知';
}

// 搜索用户
function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;
    
    filteredUsers = usersData.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || user.status === statusFilter;
        const matchesRole = !roleFilter || user.role === roleFilter;
        
        return matchesSearch && matchesStatus && matchesRole;
    });
    
    currentPage = 1;
    displayUsers();
}

// 筛选用户
function filterUsers() {
    searchUsers(); // 重用搜索逻辑
}

// 更新分页
function updatePagination() {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

// 上一页
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayUsers();
    }
}

// 下一页
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayUsers();
    }
}

// 显示添加用户模态框
function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

// 关闭添加用户模态框
function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('addUserForm').reset();
}

// 添加用户
function addUser() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    
    if (!username || !email || !password) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 检查用户名是否已存在
    if (usersData.some(user => user.username === username)) {
        alert('用户名已存在');
        return;
    }
    
    // 检查邮箱是否已存在
    if (usersData.some(user => user.email === email)) {
        alert('邮箱已存在');
        return;
    }
    
    const newUser = {
        id: Math.max(...usersData.map(u => u.id)) + 1,
        username: username,
        email: email,
        role: role,
        status: 'active',
        registerTime: new Date().toLocaleString('zh-CN'),
        lastLogin: '从未登录'
    };
    
    usersData.push(newUser);
    filteredUsers = [...usersData];
    displayUsers();
    closeAddUserModal();
    
    alert('用户添加成功');
}

// 编辑用户
function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editRole').value = user.role;
    document.getElementById('editStatus').value = user.status;
    
    document.getElementById('editUserModal').style.display = 'block';
}

// 关闭编辑用户模态框
function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
    document.getElementById('editUserForm').reset();
}

// 更新用户
function updateUser() {
    const userId = parseInt(document.getElementById('editUserId').value);
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;
    const status = document.getElementById('editStatus').value;
    
    if (!username || !email) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 检查用户名是否已被其他用户使用
    if (usersData.some(user => user.username === username && user.id !== userId)) {
        alert('用户名已存在');
        return;
    }
    
    // 检查邮箱是否已被其他用户使用
    if (usersData.some(user => user.email === email && user.id !== userId)) {
        alert('邮箱已存在');
        return;
    }
    
    const userIndex = usersData.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        usersData[userIndex] = {
            ...usersData[userIndex],
            username: username,
            email: email,
            role: role,
            status: status
        };
        
        filteredUsers = [...usersData];
        displayUsers();
        closeEditUserModal();
        
        alert('用户更新成功');
    }
}

// 删除用户
function deleteUser(userId) {
    if (confirm('确定要删除这个用户吗？此操作不可恢复。')) {
        const userIndex = usersData.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            usersData.splice(userIndex, 1);
            filteredUsers = [...usersData];
            displayUsers();
            alert('用户删除成功');
        }
    }
}

// 封禁用户
function banUser(userId) {
    if (confirm('确定要封禁这个用户吗？')) {
        const user = usersData.find(u => u.id === userId);
        if (user) {
            user.status = 'banned';
            filteredUsers = [...usersData];
            displayUsers();
            alert('用户已被封禁');
        }
    }
}

// 解封用户
function unbanUser(userId) {
    if (confirm('确定要解封这个用户吗？')) {
        const user = usersData.find(u => u.id === userId);
        if (user) {
            user.status = 'active';
            filteredUsers = [...usersData];
            displayUsers();
            alert('用户已解封');
        }
    }
}

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('collapsed');
}

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 主题切换
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('adminLogin');
        sessionStorage.removeItem('adminLogin');
        window.location.href = 'login.html';
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const addModal = document.getElementById('addUserModal');
    const editModal = document.getElementById('editUserModal');
    
    if (event.target === addModal) {
        closeAddUserModal();
    }
    if (event.target === editModal) {
        closeEditUserModal();
    }
}