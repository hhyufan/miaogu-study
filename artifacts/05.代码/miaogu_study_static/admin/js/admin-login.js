// 管理员登录功能
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = loginForm.querySelector('.login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const loadingSpinner = loginBtn.querySelector('.loading-spinner');

    // 模拟管理员账户数据
    const adminAccounts = [
        {
            username: '123',
            email: '123@miaogu.com',
            password: '123',
            role: 'super_admin',
            name: '超级管理员'
        },
        {
            username: 'admin',
            email: 'admin@miaogu.com',
            password: 'admin123',
            role: 'super_admin',
            name: '超级管理员'
        },
        {
            username: 'moderator',
            email: 'mod@miaogu.com', 
            password: 'mod123',
            role: 'moderator',
            name: '内容审核员'
        }
    ];

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // 验证输入
        if (!username || !password) {
            showError('请填写完整的登录信息');
            return;
        }

        // 显示加载状态
        setLoading(true);
        hideError();

        // 模拟登录验证
        setTimeout(() => {
            const admin = adminAccounts.find(acc => 
                (acc.username === username || acc.email === username) && 
                acc.password === password
            );

            if (admin) {
                // 登录成功
                const loginData = {
                    id: Date.now(),
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                    name: admin.name,
                    loginTime: new Date().toISOString(),
                    remember: remember
                };

                // 保存登录状态
                if (remember) {
                    localStorage.setItem('adminLogin', JSON.stringify(loginData));
                } else {
                    sessionStorage.setItem('adminLogin', JSON.stringify(loginData));
                }

                // 跳转到仪表盘
                window.location.href = 'dashboard.html';
            } else {
                // 登录失败
                showError('用户名或密码错误，请重试');
                setLoading(false);
            }
        }, 1500); // 模拟网络延迟
    });

    function setLoading(loading) {
        if (loading) {
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            loadingSpinner.style.display = 'flex';
        } else {
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    // 检查是否已经登录
    function checkExistingLogin() {
        const savedLogin = localStorage.getItem('adminLogin') || sessionStorage.getItem('adminLogin');
        if (savedLogin) {
            try {
                const loginData = JSON.parse(savedLogin);
                // 检查登录是否过期（24小时）
                const loginTime = new Date(loginData.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    // 登录仍有效，跳转到仪表盘
                    window.location.href = 'dashboard.html';
                } else {
                    // 登录过期，清除数据
                    localStorage.removeItem('adminLogin');
                    sessionStorage.removeItem('adminLogin');
                }
            } catch (e) {
                // 数据格式错误，清除
                localStorage.removeItem('adminLogin');
                sessionStorage.removeItem('adminLogin');
            }
        }
    }

    // 页面加载时检查登录状态
    checkExistingLogin();

    // 输入框回车提交
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });

    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // 清除错误消息当用户开始输入
    document.getElementById('username').addEventListener('input', hideError);
    document.getElementById('password').addEventListener('input', hideError);
});

// 主题切换功能
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 页面加载时应用保存的主题
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});