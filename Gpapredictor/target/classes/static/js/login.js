document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // 防止表单的默认提交行为
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    passwordHash: password
                })
            })
                .then(response => {
                    if (response.ok) {
                        // 登录成功，重定向到主页或其它页面
                        window.location.href = "home.html";
                    } else {
                        // 登录失败，显示错误信息
                        const loginMessage = document.getElementById("loginMessage");
                        loginMessage.textContent = "Login failed. Please check your username and password.";
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    const loginMessage = document.getElementById("loginMessage");
                    loginMessage.textContent = "An error occurred. Please try again.";
                });
        });
    }
});
