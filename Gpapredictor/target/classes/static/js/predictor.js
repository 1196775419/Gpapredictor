document.addEventListener("DOMContentLoaded", function () {
    const courseSelect = document.getElementById("courseSelect");
    const goButton = document.getElementById("goButton");
    const assessmentsContainer = document.getElementById("assessmentsContainer");
    const totalScoreElement = document.getElementById("totalScore");
    const gpaResultElement = document.getElementById("gpaResult");
    const username = localStorage.getItem("username");
    let assessments = [];
    let remainingWeight = 0;

    // 加载课程到课程下拉框中
    fetch(`/api/subjects/user/${username}`)
        .then(response => response.json())
        .then(courses => {
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.id;
                option.textContent = `${course.subjectName} (${course.semester})`;
                courseSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
        });

    // 点击 Go 按钮，获取评估信息
    goButton.addEventListener("click", function () {
        const courseId = courseSelect.value;

        if (!courseId) {
            alert("Please select a course.");
            return;
        }

        // 发送 Ajax 请求获取该课程的评估信息
        fetch(`/api/subjects/${courseId}`)
            .then(response => response.json())
            .then(data => {
                assessments = data.assessments;
                assessmentsContainer.innerHTML = "";  // 清空之前的评估信息

                assessments.forEach(assessment => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${assessment.assessmentName}</td>
                        <td>${assessment.weight}%</td>
                        <td><input type="number" class="score-input" data-weight="${assessment.weight}" placeholder="Enter your score (out of ${assessment.fullMark})"></td>
                    `;
                    assessmentsContainer.appendChild(row);
                });

                // 添加 GPA 计算按钮
                const calculateButton = document.createElement("button");
                calculateButton.textContent = "Calculate GPA";
                calculateButton.addEventListener("click", calculateGPA);
                assessmentsContainer.appendChild(calculateButton);
            })
            .catch(error => {
                console.error("Error fetching assessments:", error);
            });
    });

    // 计算 GPA 和预测最高等级
    // 计算 GPA 和预测最高等级
    function calculateGPA() {
        let totalWeightedScores = 0;
        let totalWeights = 0;
        let remainingWeight = 0; // 剩余权重

        const scoreInputs = document.querySelectorAll(".score-input");

        scoreInputs.forEach(input => {
            const score = parseFloat(input.value);
            const weight = parseFloat(input.dataset.weight);

            if (!isNaN(score)) {
                totalWeightedScores += score * weight;
                totalWeights += weight;
            } else {
                remainingWeight += weight; // 记录剩余的权重
            }
        });

        let totalScore;
        if (totalWeights > 0) {
            totalScore = (totalWeightedScores / (totalWeights + remainingWeight)).toFixed(2);
        } else {
            totalScore = "N/A";
        }

        totalScoreElement.textContent = `${totalScore}%`;

        const gpa = convertScoreToGpa(totalScore);
        gpaResultElement.textContent = gpa;

        updateGradeTable(totalScore, totalWeightedScores, totalWeights, remainingWeight);
    }

// 更新分数等级表
    // 更新分数等级表
    function updateGradeTable(totalScore, totalWeightedScores, totalWeights, remainingWeight) {
        const gradeRows = document.querySelectorAll(".grade-row");

        gradeRows.forEach(row => {
            const cutoff = parseFloat(row.querySelector("td:nth-child(2)").textContent); // 获取Cutoff值
            const requiredScoreCell = row.querySelector(".required-score");

            let requiredScore;

            // 如果有剩余的权重（比如期末考试还没填）
            if (remainingWeight > 0) {
                // 计算需要的分数: Required Score = Required % - Total Score
                const neededScore = cutoff - totalScore;

                if (neededScore <= 0) {
                    row.style.backgroundColor = "green"; // 标记为已达成
                    requiredScoreCell.textContent = "Achieved";
                } else if (neededScore > 100) {
                    row.style.backgroundColor = "red"; // 无法达成
                    requiredScoreCell.textContent = `Infinity`;
                } else {
                    row.style.backgroundColor = "white"; // 标记为有希望
                    requiredScoreCell.textContent = `${neededScore.toFixed(2)}/100`; // 显示需要的分数
                }
            } else {
                // 如果所有成绩都已填写，直接检查是否达到目标
                if (totalScore >= cutoff) {
                    row.style.backgroundColor = "green"; // 标记为已达成
                    requiredScoreCell.textContent = "Achieved";
                } else {
                    row.style.backgroundColor = "red"; // 标记为未达成
                    requiredScoreCell.textContent = "Not Achieved";
                }
            }
        });
    }





    // 根据分数转换为 GPA
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
});

// 登出功能
document.getElementById('logoutButton').addEventListener('click', function () {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('username');
                window.location.href = 'login.html';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
});
