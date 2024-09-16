document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");

    // 监听表单提交事件
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // 获取表单输入值
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // 将输入的数据封装成对象
        const userData = {
            username: username,
            email: email,
            password: password
        };

        // 发送 POST 请求到后端的注册API
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) // 将数据转换为 JSON 格式
        })
            .then(response => response.json()) // 解析JSON响应
            .then(data => {
                if (data.success) {
                    // 如果注册成功，显示成功消息，并重定向到登录页面
                    registerMessage.textContent = data.message; // 显示后端的 message
                    registerMessage.style.color = "green";
                    setTimeout(() => {
                        window.location.href = "login.html"; // 重定向到登录页面
                    }, 2000);
                } else {
                    // 如果失败，显示错误消息
                    registerMessage.textContent = data.message || "Registration failed!";
                    registerMessage.style.color = "red";
                }
            })
            .catch(error => {
                console.error('Error during registration:', error);
                registerMessage.textContent = "An error occurred during registration.";
                registerMessage.style.color = "red";
            });
    });
});
