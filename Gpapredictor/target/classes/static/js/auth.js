document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    // 这里你可以通过调用后端API或检查本地存储的令牌来检查用户是否已经登录
    const isLoggedIn = checkLoginStatus();  // 假设这是检查用户登录状态的函数

    if (isLoggedIn) {
        loginButton.style.display = "none";  // 隐藏 "Login" 按钮
        logoutButton.style.display = "inline-block";  // 显示 "Logout" 按钮
    } else {
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
    }

    // 处理点击 "Logout" 按钮的逻辑
    logoutButton.addEventListener("click", function() {
        logout();  // 调用登出功能
    });
});

// 模拟检查登录状态的函数（你需要替换为实际的API调用或逻辑）
function checkLoginStatus() {
    // 这里可以检查本地存储是否有有效的登录令牌，例如
    return localStorage.getItem("authToken") !== null;
}

// 模拟登出功能（你需要替换为实际的API调用）
function logout() {
    // 清除登录令牌或相关的会话数据
    localStorage.removeItem("authToken");
    // 重定向用户到登录页面
    window.location.href = "login.html";
}
