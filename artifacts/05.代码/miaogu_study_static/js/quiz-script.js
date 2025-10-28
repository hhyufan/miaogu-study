// 题目页面功能脚本

// 章节展开/收起功能
function toggleChapter(chapterId) {
    const arrow = document.getElementById(`arrow-${chapterId}`);
    const topics = document.getElementById(`topics-${chapterId}`);
    
    if (topics.classList.contains('show')) {
        topics.classList.remove('show');
        arrow.classList.remove('expanded');
    } else {
        topics.classList.add('show');
        arrow.classList.add('expanded');
    }
}

// 显示题目详情
function showTopicDetail(topicId) {
    const contentTitle = document.getElementById('content-title');
    const mainContent = document.getElementById('main-content');
    
    // 更新标题
    contentTitle.textContent = '题目详情';
    
    // 更新内容
    mainContent.innerHTML = `
        <div class="topic-detail">
            <h3>题目: ${topicId}</h3>
            <p>这里是题目的详细内容...</p>
            <p>题目描述、选项、答案解析等内容将在这里显示。</p>
        </div>
    `;
    
    // 高亮当前选中的题目
    document.querySelectorAll('.topic-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.topic-item').classList.add('active');
}

// 显示题目动态列表
function showTopicDynamics() {
    const contentTitle = document.getElementById('content-title');
    const mainContent = document.getElementById('main-content');
    
    contentTitle.textContent = '题目动态';
    
    mainContent.innerHTML = `
        <div class="topic-dynamics">
            <div class="dynamic-item">
                <div class="item-header">
                    <h3>基础概念练习题</h3>
                    <span class="time">2小时前</span>
                </div>
                <p class="item-desc">包含10道选择题，涵盖第一章基础知识点</p>
                <div class="item-tags">
                    <span class="tag">基础</span>
                    <span class="tag">选择题</span>
                </div>
            </div>
            
            <div class="dynamic-item">
                <div class="item-header">
                    <h3>进阶应用题目</h3>
                    <span class="time">1天前</span>
                </div>
                <p class="item-desc">综合性题目，需要运用多个知识点</p>
                <div class="item-tags">
                    <span class="tag">进阶</span>
                    <span class="tag">综合</span>
                </div>
            </div>
            
            <div class="dynamic-item">
                <div class="item-header">
                    <h3>编程实践题</h3>
                    <span class="time">3天前</span>
                </div>
                <p class="item-desc">通过编程实现具体功能，提升实践能力</p>
                <div class="item-tags">
                    <span class="tag">编程</span>
                    <span class="tag">实践</span>
                </div>
            </div>
        </div>
    `;
}

// 内容筛选功能
function filterContent(type) {
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 根据类型筛选内容
    const mainContent = document.getElementById('main-content');
    let filteredContent = '';
    
    switch(type) {
        case 'all':
            showTopicDynamics();
            break;
        case 'recent':
            filteredContent = `
                <div class="topic-dynamics">
                    <div class="dynamic-item">
                        <div class="item-header">
                            <h3>基础概念练习题</h3>
                            <span class="time">2小时前</span>
                        </div>
                        <p class="item-desc">包含10道选择题，涵盖第一章基础知识点</p>
                        <div class="item-tags">
                            <span class="tag">基础</span>
                            <span class="tag">选择题</span>
                        </div>
                    </div>
                </div>
            `;
            mainContent.innerHTML = filteredContent;
            break;
        case 'practice':
            filteredContent = `
                <div class="topic-dynamics">
                    <div class="dynamic-item">
                        <div class="item-header">
                            <h3>编程实践题</h3>
                            <span class="time">3天前</span>
                        </div>
                        <p class="item-desc">通过编程实现具体功能，提升实践能力</p>
                        <div class="item-tags">
                            <span class="tag">编程</span>
                            <span class="tag">实践</span>
                        </div>
                    </div>
                </div>
            `;
            mainContent.innerHTML = filteredContent;
            break;
    }
}

// 初始化：隐藏所有题目列表
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加页面初始化逻辑
    console.log('题目页面已加载');
});

// 主题切换功能（继承自主项目）
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }
});

// 语言切换功能（继承自主项目）
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            // 简单的语言切换示例
            const currentLang = document.documentElement.lang;
            if (currentLang === 'en') {
                document.documentElement.lang = 'zh';
                // 可以在这里添加更多语言切换逻辑
            } else {
                document.documentElement.lang = 'en';
            }
        });
    }
});