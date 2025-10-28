// 主题切换功能 - 检查元素是否存在
let login = document.getElementById('login');
let register = document.getElementById('register');
let form_box = document.getElementsByClassName('form-box')[0];
let register_box = document.getElementsByClassName('register-box')[0];
let login_box = document.getElementsByClassName('login-box')[0];

// 只有当元素存在时才添加事件监听器
if (register) {
    // 去注册
    register.addEventListener('click', () => {
        if (form_box) form_box.style.transform = 'translateX(80%)';
        if (form_box) form_box.style.background = '#d3b7d8';
        if (login_box) login_box.classList.add('hidden'); //添加隐藏类名，隐藏表单
        if (register_box) register_box.classList.remove('hidden');
        document.body.style.background = 'linear-gradient(200deg,#e3c5eb,#a9c1ed)'; //设置渐变效果
    });
}

if (login) {
    // 去登录
    login.addEventListener('click', () => {
        if (form_box) form_box.style.transform = 'translateX(0%)';
        if (form_box) form_box.style.background = '#ebc777';
        if (register_box) register_box.classList.add('hidden');
        if (login_box) login_box.classList.remove('hidden');
        document.body.style.background = 'linear-gradient(200deg, #fbed77, #d8b376)';
    });
}