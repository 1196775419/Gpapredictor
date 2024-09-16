document.addEventListener("DOMContentLoaded", function() {
    const courseForm = document.getElementById("courseForm");
    const assessmentsContainer = document.getElementById("assessmentsContainer");
    const addAssessmentButton = document.getElementById("addAssessment");

    const username = localStorage.getItem('username');
    if (!username) {
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = 'login.html';
        return;
    }
    // 动态添加更多评估项
    addAssessmentButton.addEventListener("click", function() {
        const assessmentItem = document.createElement("div");
        assessmentItem.classList.add("assessment-item");
        assessmentItem.innerHTML = `
            <label for="assessmentName">Assessment Name:</label>
            <input type="text" name="assessmentName" required>
            <label for="weight">Weight (%):</label>
            <input type="number" name="weight" required>
            <label for="fullMark">Full Mark:</label>
            <input type="number" name="fullMark" required>
        `;
        assessmentsContainer.appendChild(assessmentItem);
    });

    // 处理表单提交
    courseForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const courseName = document.getElementById("courseName").value;
        const semester = document.getElementById("semesterDropdown").value;
        const assessments = [];
        assessmentsContainer.querySelectorAll(".assessment-item").forEach(item => {
            assessments.push({
                assessmentName: item.querySelector("[name='assessmentName']").value,
                weight: item.querySelector("[name='weight']").value,
                fullMark: item.querySelector("[name='fullMark']").value,
            });
        });

        // 从 localStorage 中获取 username
        const username = localStorage.getItem("username");

        fetch("/api/subjects/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subjectName: courseName,
                semester: semester,
                assessments: assessments,
                username: username // 将 username 添加到请求体中
            })
        })
            .then(response => {
                if (response.ok) {
                    // 如果状态码是 200 或 201，则表示成功
                    window.location.href = "home.html";
                } else {
                    throw new Error("Network response was not ok.");
                }
            })
            .catch(error => {
                console.error("Error:"+error);
            });
    });
});

document.getElementById('logoutButton').addEventListener('click', function() {
    // 调用后端登出接口
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // 确保带上认证 cookie
    })
        .then(response => {
            if (response.ok) {
                // 清除本地存储或其他客户端状态
                localStorage.removeItem('username');
                // 重定向到登录页面
                window.location.href = 'login.html';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
});