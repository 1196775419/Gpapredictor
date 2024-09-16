document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem('username');

    // 如果用户没有登录，跳转到登录页面
    if (!username) {
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = 'login.html';
        return;
    }

    // 设置欢迎信息，假设你有一个显示用户名的元素
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${username}`;
    }

    // 登出按钮的事件监听器
    document.getElementById('logoutButton').addEventListener('click', function () {
        // 调用后端登出接口
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // 确保带上认证的cookie
        })
            .then(response => {
                if (response.ok) {
                    // 清除本地存储或其他客户端状态
                    localStorage.removeItem('username');
                    // 重定向到登录页面
                    window.location.href = 'login.html';
                } else {
                    console.error('Logout failed');
                    alert('Logout failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                alert('An error occurred during logout. Please try again.');
            });
    });
});
