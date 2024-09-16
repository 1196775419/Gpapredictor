document.addEventListener("DOMContentLoaded", function() {
    const courseList = document.getElementById("courseList");

    // 从 localStorage 获取用户名
    const username = localStorage.getItem("username");

    if (username) {
        fetch(`/api/subjects/user/${username}`)
            .then(response => response.json())
            .then(subjects => {
                if (subjects.length === 0) {
                    const noCourses = document.createElement("li");
                    noCourses.textContent = "You have no courses. Add one using the button above.";
                    courseList.appendChild(noCourses);
                } else {
                    subjects.forEach(subject => {
                        const courseItem = document.createElement("li");
                        courseItem.innerHTML = `
                            <h3>${subject.subjectName} (${subject.semester})</h3>
                            <ul>
                                ${subject.assessments.map(assessment => `
                                    <li>
                                        ${assessment.assessmentName} - Weight: ${assessment.weight}% - Full Mark: ${assessment.fullMark}
                                    </li>
                                `).join('')}
                            </ul>
                            <button class="edit-btn" data-id="${subject.id}">Edit</button>
                            <button class="delete-btn" data-id="${subject.id}">Delete</button>
                        `;
                        courseList.appendChild(courseItem);
                    });

                    // 添加事件监听器：删除课程
                    document.querySelectorAll(".delete-btn").forEach(button => {
                        button.addEventListener("click", function() {
                            const subjectId = this.getAttribute("data-id");
                            if (confirm("Are you sure you want to delete this course?")) {
                                fetch(`/api/subjects/${subjectId}`, {
                                    method: "DELETE"
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            window.location.reload(); // 重新加载页面
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Error deleting course:", error);
                                    });
                            }
                        });
                    });

                    // 添加事件监听器：编辑课程
                    document.querySelectorAll(".edit-btn").forEach(button => {
                        button.addEventListener("click", function() {
                            const subjectId = this.getAttribute("data-id");
                            // 跳转到编辑页面，并将课程ID传递给编辑页面
                            window.location.href = `editCourse.html?subjectId=${subjectId}`;
                        });
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            });
    } else {
        console.error("Username not found in localStorage.");
    }
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