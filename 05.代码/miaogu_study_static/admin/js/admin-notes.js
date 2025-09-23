// 笔记管理页面JavaScript功能

// 全局变量
let currentPage = 1;
let totalPages = 1;
let notesData = [];
let filteredNotes = [];
let selectedNotes = [];
let currentNoteId = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
    loadNotesData();
    initializeTheme();
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

// 加载笔记数据
function loadNotesData() {
    // 模拟笔记数据
    notesData = [
        {
            id: 1,
            title: 'JavaScript高级编程技巧',
            author: '张三',
            authorId: 1,
            category: 'programming',
            status: 'pending',
            views: 156,
            content: '这是一篇关于JavaScript高级编程技巧的详细笔记...',
            created: '2024-01-15 10:30:00',
            updated: '2024-01-15 14:20:00'
        },
        {
            id: 2,
            title: 'UI设计原则与实践',
            author: '李四',
            authorId: 2,
            category: 'design',
            status: 'approved',
            views: 234,
            content: '本文详细介绍了UI设计的基本原则和实践方法...',
            created: '2024-01-14 09:15:00',
            updated: '2024-01-14 16:45:00'
        },
        {
            id: 3,
            title: '数据结构与算法分析',
            author: '王五',
            authorId: 3,
            category: 'programming',
            status: 'rejected',
            views: 89,
            content: '深入分析常用数据结构和算法的实现原理...',
            created: '2024-01-13 14:20:00',
            updated: '2024-01-13 18:30:00'
        },
        {
            id: 4,
            title: '商业模式创新思考',
            author: '赵六',
            authorId: 4,
            category: 'business',
            status: 'pending',
            views: 67,
            content: '探讨现代商业模式的创新方向和实践案例...',
            created: '2024-01-12 11:45:00',
            updated: '2024-01-12 15:20:00'
        },
        {
            id: 5,
            title: '机器学习入门指南',
            author: '孙七',
            authorId: 5,
            category: 'science',
            status: 'approved',
            views: 312,
            content: '从零开始学习机器学习的完整指南...',
            created: '2024-01-11 08:30:00',
            updated: '2024-01-11 20:15:00'
        }
    ];

    filteredNotes = [...notesData];
    updateStatistics();
    displayNotes();
}

// 更新统计数据
function updateStatistics() {
    const totalNotes = notesData.length;
    const pendingReview = notesData.filter(note => note.status === 'pending').length;
    const approvedNotes = notesData.filter(note => note.status === 'approved').length;
    const rejectedNotes = notesData.filter(note => note.status === 'rejected').length;

    document.getElementById('totalNotes').textContent = totalNotes;
    document.getElementById('pendingReview').textContent = pendingReview;
    document.getElementById('approvedNotes').textContent = approvedNotes;
    document.getElementById('rejectedNotes').textContent = rejectedNotes;
}

// 显示笔记列表
function displayNotes() {
    const tbody = document.getElementById('notesTableBody');
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNotes = filteredNotes.slice(startIndex, endIndex);

    tbody.innerHTML = '';

    pageNotes.forEach(note => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" value="${note.id}" onchange="toggleNoteSelection(${note.id})">
            </td>
            <td>${note.id}</td>
            <td>
                <a href="#" onclick="showNoteDetail(${note.id})" class="note-title-link">
                    ${note.title}
                </a>
            </td>
            <td>${note.author}</td>
            <td>${getCategoryName(note.category)}</td>
            <td>
                <span class="status-badge status-${note.status}">
                    ${getStatusName(note.status)}
                </span>
            </td>
            <td>${note.views}</td>
            <td>${formatDate(note.created)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm" onclick="showNoteDetail(${note.id})" title="查看详情">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                    </button>
                    ${note.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="quickApprove(${note.id})" title="快速通过">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="quickReject(${note.id})" title="快速拒绝">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                            </svg>
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})" title="删除">
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

    updatePagination();
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        'programming': '编程',
        'design': '设计',
        'business': '商业',
        'science': '科学',
        'other': '其他'
    };
    return categories[category] || category;
}

// 获取状态名称
function getStatusName(status) {
    const statuses = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝',
        'draft': '草稿'
    };
    return statuses[status] || status;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
}

// 搜索笔记
function searchNotes() {
    const searchTerm = document.getElementById('noteSearch').value.toLowerCase();
    filteredNotes = notesData.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.author.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );

    applyFilters();
}

// 筛选笔记
function filterNotes() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('noteSearch').value.toLowerCase();

    filteredNotes = notesData.filter(note => {
        const matchesSearch = !searchTerm ||
            note.title.toLowerCase().includes(searchTerm) ||
            note.author.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || note.status === statusFilter;
        const matchesCategory = !categoryFilter || note.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    currentPage = 1;
    displayNotes();
}

// 应用筛选
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    if (statusFilter) {
        filteredNotes = filteredNotes.filter(note => note.status === statusFilter);
    }

    if (categoryFilter) {
        filteredNotes = filteredNotes.filter(note => note.category === categoryFilter);
    }

    currentPage = 1;
    displayNotes();
}

// 排序笔记
function sortNotes() {
    const sortBy = document.getElementById('sortBy').value;

    filteredNotes.sort((a, b) => {
        switch (sortBy) {
            case 'created_desc':
                return new Date(b.created) - new Date(a.created);
            case 'created_asc':
                return new Date(a.created) - new Date(b.created);
            case 'updated_desc':
                return new Date(b.updated) - new Date(a.updated);
            case 'updated_asc':
                return new Date(a.updated) - new Date(b.updated);
            case 'views_desc':
                return b.views - a.views;
            case 'views_asc':
                return a.views - b.views;
            default:
                return 0;
        }
    });

    displayNotes();
}

// 显示笔记详情
function showNoteDetail(noteId) {
    const note = notesData.find(n => n.id === noteId);
    if (!note) return;

    currentNoteId = noteId;

    document.getElementById('noteDetailTitle').textContent = note.title;
    document.getElementById('noteAuthor').textContent = note.author;
    document.getElementById('noteCategory').textContent = getCategoryName(note.category);
    document.getElementById('noteStatus').innerHTML = `<span class="status-badge status-${note.status}">${getStatusName(note.status)}</span>`;
    document.getElementById('noteCreated').textContent = formatDate(note.created);
    document.getElementById('noteViews').textContent = note.views;
    document.getElementById('noteContentDisplay').innerHTML = `<p>${note.content}</p>`;

    document.getElementById('noteDetailModal').style.display = 'block';
}

// 关闭笔记详情模态框
function closeNoteDetailModal() {
    document.getElementById('noteDetailModal').style.display = 'none';
    currentNoteId = null;
}

// 通过笔记
function approveNote() {
    if (!currentNoteId) return;

    const note = notesData.find(n => n.id === currentNoteId);
    if (note) {
        note.status = 'approved';
        updateStatistics();
        displayNotes();
        closeNoteDetailModal();
        showMessage('笔记已通过审核', 'success');
    }
}

// 拒绝笔记
function rejectNote() {
    if (!currentNoteId) return;

    const note = notesData.find(n => n.id === currentNoteId);
    if (note) {
        note.status = 'rejected';
        updateStatistics();
        displayNotes();
        closeNoteDetailModal();
        showMessage('笔记已拒绝', 'warning');
    }
}

// 快速通过
function quickApprove(noteId) {
    const note = notesData.find(n => n.id === noteId);
    if (note) {
        note.status = 'approved';
        updateStatistics();
        displayNotes();
        showMessage('笔记已通过审核', 'success');
    }
}

// 快速拒绝
function quickReject(noteId) {
    const note = notesData.find(n => n.id === noteId);
    if (note) {
        note.status = 'rejected';
        updateStatistics();
        displayNotes();
        showMessage('笔记已拒绝', 'warning');
    }
}

// 删除笔记
function deleteNote(noteId) {
    if (confirm('确定要删除这个笔记吗？此操作不可恢复。')) {
        const index = notesData.findIndex(n => n.id === noteId);
        if (index !== -1) {
            notesData.splice(index, 1);
            filteredNotes = filteredNotes.filter(n => n.id !== noteId);
            updateStatistics();
            displayNotes();
            showMessage('笔记已删除', 'success');
        }
    }
}

// 切换笔记选择
function toggleNoteSelection(noteId) {
    const checkbox = document.querySelector(`input[value="${noteId}"]`);
    if (checkbox.checked) {
        if (!selectedNotes.includes(noteId)) {
            selectedNotes.push(noteId);
        }
    } else {
        selectedNotes = selectedNotes.filter(id => id !== noteId);
    }

    updateSelectAllCheckbox();
}

// 全选/取消全选
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('#notesTableBody input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        const noteId = parseInt(checkbox.value);

        if (selectAllCheckbox.checked) {
            if (!selectedNotes.includes(noteId)) {
                selectedNotes.push(noteId);
            }
        } else {
            selectedNotes = selectedNotes.filter(id => id !== noteId);
        }
    });
}

// 更新全选复选框状态
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('#notesTableBody input[type="checkbox"]');
    const checkedCount = document.querySelectorAll('#notesTableBody input[type="checkbox"]:checked').length;

    selectAllCheckbox.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
}

// 显示批量操作
function showBatchActions() {
    if (selectedNotes.length === 0) {
        showMessage('请先选择要操作的笔记', 'warning');
        return;
    }

    document.getElementById('selectedCount').textContent = selectedNotes.length;
    document.getElementById('batchActionModal').style.display = 'block';
}

// 关闭批量操作模态框
function closeBatchActionModal() {
    document.getElementById('batchActionModal').style.display = 'none';
}

// 批量通过
function batchApprove() {
    if (selectedNotes.length === 0) return;

    selectedNotes.forEach(noteId => {
        const note = notesData.find(n => n.id === noteId);
        if (note) {
            note.status = 'approved';
        }
    });

    updateStatistics();
    displayNotes();
    clearSelection();
    closeBatchActionModal();
    showMessage(`已通过 ${selectedNotes.length} 个笔记`, 'success');
}

// 批量拒绝
function batchReject() {
    if (selectedNotes.length === 0) return;

    selectedNotes.forEach(noteId => {
        const note = notesData.find(n => n.id === noteId);
        if (note) {
            note.status = 'rejected';
        }
    });

    updateStatistics();
    displayNotes();
    clearSelection();
    closeBatchActionModal();
    showMessage(`已拒绝 ${selectedNotes.length} 个笔记`, 'warning');
}

// 批量删除
function batchDelete() {
    if (selectedNotes.length === 0) return;

    if (confirm(`确定要删除选中的 ${selectedNotes.length} 个笔记吗？此操作不可恢复。`)) {
        selectedNotes.forEach(noteId => {
            const index = notesData.findIndex(n => n.id === noteId);
            if (index !== -1) {
                notesData.splice(index, 1);
            }
        });

        filteredNotes = filteredNotes.filter(note => !selectedNotes.includes(note.id));
        updateStatistics();
        displayNotes();
        clearSelection();
        closeBatchActionModal();
        showMessage(`已删除 ${selectedNotes.length} 个笔记`, 'success');
    }
}

// 清除选择
function clearSelection() {
    selectedNotes = [];
    document.getElementById('selectAll').checked = false;
    document.querySelectorAll('#notesTableBody input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// 更新分页
function updatePagination() {
    const itemsPerPage = 10;
    totalPages = Math.ceil(filteredNotes.length / itemsPerPage);

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

// 上一页
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayNotes();
    }
}

// 下一页
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayNotes();
    }
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
    const noteDetailModal = document.getElementById('noteDetailModal');
    const batchActionModal = document.getElementById('batchActionModal');

    if (event.target === noteDetailModal) {
        closeNoteDetailModal();
    }

    if (event.target === batchActionModal) {
        closeBatchActionModal();
    }
}