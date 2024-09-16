document.addEventListener("DOMContentLoaded", function() {
    const courseSelect = document.getElementById("courseSelect");
    const assessmentsContainer = document.getElementById("assessmentsContainer");
    const calculateGpaButton = document.getElementById("calculateGpaButton");
    const gpaResult = document.getElementById("gpaResult");
    const username = localStorage.getItem('username');
    if (!username) {
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = 'login.html';
        return;
    }
    // 从后端获取课程列表
    fetch(`/api/subjects/user/${username}`)
        .then(response => response.json())
        .then(courses => {
            // 遍历课程列表并将每个课程添加到下拉菜单中
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.id;
                option.text = `${course.subjectName} (Semester ${course.semester})`;
                courseSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
        });

    // 当选择了一个课程时，显示相应的评估
    courseSelect.addEventListener("change", function() {
        const courseId = courseSelect.value;
        assessmentsContainer.innerHTML = ""; // 清空之前的评估

        if (courseId) {
            fetch(`/api/subjects/${courseId}`)
                .then(response => response.json())
                .then(subject => {
                    // 遍历 assessments 并将它们动态添加到页面中
                    subject.assessments.forEach(assessment => {
                        const assessmentItem = document.createElement("div");
                        assessmentItem.classList.add("assessment-item");
                        assessmentItem.innerHTML = `
                            <label>Assessment: ${assessment.assessmentName} (${assessment.weight}%)</label>
                            <input type="number" name="score" class="score-input" data-weight="${assessment.weight}" min="0" max="${assessment.fullMark}" placeholder="Enter your score (out of ${assessment.fullMark})">
                        `;
                        assessmentsContainer.appendChild(assessmentItem);
                    });

                    calculateGpaButton.style.display = "inline-block"; // 显示计算按钮
                })
                .catch(error => {
                    console.error("Error fetching assessments:", error);
                });
        } else {
            calculateGpaButton.style.display = "none"; // 如果未选择课程，则隐藏按钮
        }
    });

    // 计算 GPA
    calculateGpaButton.addEventListener("click", function() {
        let totalWeightedScores = 0;
        let totalWeights = 0;

        const scoreInputs = document.querySelectorAll(".score-input");

        scoreInputs.forEach((input) => {
            const score = parseFloat(input.value);
            const weight = parseFloat(input.dataset.weight); // 获取评估的权重

            if (!isNaN(score)) {
                const weightedScore = convertScoreToGpa(score) * weight;
                totalWeightedScores += weightedScore;
                totalWeights += weight;
            }
        });

        if (totalWeights > 0) {
            const gpa = totalWeightedScores / totalWeights;
            const grade = convertGpaToGrade(gpa); // 获取对应的 Grade
            gpaResult.textContent = `GPA: ${gpa.toFixed(2)}, Grade: ${grade}`; // 显示 GPA 和 Grade
        } else {
            gpaResult.textContent = "Invalid input!";
        }
    });

    // 根据成绩转换为GPA
    function convertScoreToGpa(score) {
        if (score >= 80) {
            return 7;
        } else if (score >= 75) {
            return 6;
        } else if (score >= 70) {
            return 5;
        } else if (score >= 65) {
            return 4;
        } else if (score >= 50) {
            return 3;
        } else {
            return 0;
        }
    }

    // 根据GPA值转换为对应的Grade
    function convertGpaToGrade(gpa) {
        if (gpa >= 6.5) {
            return "H1";
        } else if (gpa >= 6) {
            return "H2A";
        } else if (gpa >= 5.5) {
            return "H2B";
        } else if (gpa >= 4.5) {
            return "H3";
        } else if (gpa >= 3) {
            return "P";
        } else {
            return "N";
        }
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