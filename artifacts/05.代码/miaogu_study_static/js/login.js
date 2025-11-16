
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit',
        async (event) => {
        event.preventDefault();
        const loginError = document.getElementById('loginError');
        const form = event.target;
        const formData = new FormData(form);
        const username = formData.get('username').toString();
        const password = formData.get('password').toString();
        
        // 本地验证逻辑
        if (username === 'hhyufan' && password === '123') {
            loginError.textContent = "登录成功！";
            loginError.style.color = "green";
            
            // 设置登录状态到localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // 延迟跳转，让用户看到成功消息
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            loginError.textContent = "用户名或密码错误！";
            loginError.style.color = "red";
        }
    });
});