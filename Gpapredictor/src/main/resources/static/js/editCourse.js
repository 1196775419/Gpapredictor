document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectId = urlParams.get("subjectId");
    const editCourseForm = document.getElementById("editCourseForm");
    const assessmentsContainer = document.getElementById("assessmentsContainer");
    const addAssessmentButton = document.getElementById("addAssessmentButton");
    const username = localStorage.getItem('username');
    if (!username) {
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = 'login.html';
        return;
    }
    // 获取现有的课程信息并填充表单
    fetch(`/api/subjects/${subjectId}`)
        .then(response => response.json())
        .then(subject => {
            document.getElementById("courseName").value = subject.subjectName;
            document.getElementById("semesterDropdown").value = subject.semester;

            subject.assessments.forEach(assessment => {
                addAssessmentToForm(assessment.id, assessment.assessmentName, assessment.weight, assessment.fullMark);
            });
        })
        .catch(error => {
            console.error("Error fetching course details:", error);
        });

    // 添加新的 Assessment 表单项
    addAssessmentButton.addEventListener("click", function() {
        addAssessmentToForm(null, "", "", "");
    });

    // 提交编辑后的课程数据
    editCourseForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const courseName = document.getElementById("courseName").value;
        const semester = document.getElementById("semesterDropdown").value;
        const assessments = [];

        assessmentsContainer.querySelectorAll(".assessment-item").forEach(item => {
            assessments.push({
                id: item.querySelector("[name='id']").value,  // 确保 ID 传递
                assessmentName: item.querySelector("[name='assessmentName']").value,
                weight: item.querySelector("[name='weight']").value,
                fullMark: item.querySelector("[name='fullMark']").value,
            });
        });

        fetch(`/api/subjects/${subjectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: subjectId, // 确保 subjectId 传递到后端
                subjectName: courseName,
                semester: semester,
                assessments: assessments
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to update course');
                }
            })
            .then(data => {
                window.location.href = "manage-Courses.html"; // 保存成功后跳转回管理页面
            })
            .catch(error => {
                console.error("Error updating course:", error);
            });
    });

    // 动态添加 Assessment 表单项
    function addAssessmentToForm(id, name, weight, fullMark) {
        const assessmentItem = document.createElement("div");
        assessmentItem.classList.add("assessment-item");

        // 添加 assessment 的 ID, 确保它能够正确传递到后端
        assessmentItem.innerHTML = `
            <input type="hidden" name="id" value="${id ? id : ''}">
            <label for="assessmentName">Assessment Name:</label>
            <input type="text" name="assessmentName" value="${name}" required>
            <label for="weight">Weight (%):</label>
            <input type="number" name="weight" value="${weight}" required>
            <label for="fullMark">Full Mark:</label>
            <input type="number" name="fullMark" value="${fullMark}" required>
            <button type="button" class="removeAssessmentButton">Remove</button>
        `;

        assessmentsContainer.appendChild(assessmentItem);

        // 删除 assessment 的按钮
        const removeButton = assessmentItem.querySelector(".removeAssessmentButton");
        removeButton.addEventListener("click", function() {
            assessmentsContainer.removeChild(assessmentItem);
        });
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