// src/main/resources/static/js/home.js
document.addEventListener("DOMContentLoaded", function() {
    const addCourseButton = document.getElementById("addCourseButton");
    const courseModal = document.getElementById("courseModal");
    const closeModal = document.querySelector(".close");
    const courseForm = document.getElementById("courseForm");
    const assessmentsContainer = document.getElementById("assessmentsContainer");
    const addAssessmentButton = document.getElementById("addAssessment");

    // 打开弹出表单
    addCourseButton.addEventListener("click", function() {
        courseModal.style.display = "block";
    });

    // 关闭弹出表单
    closeModal.addEventListener("click", function() {
        courseModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === courseModal) {
            courseModal.style.display = "none";
        }
    });

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
        const assessments = [];
        assessmentsContainer.querySelectorAll(".assessment-item").forEach(item => {
            assessments.push({
                assessmentName: item.querySelector("[name='assessmentName']").value,
                weight: item.querySelector("[name='weight']").value,
                fullMark: item.querySelector("[name='fullMark']").value,
            });
        });

        fetch("/api/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                courseName: courseName,
                assessments: assessments
            })
        })
            .then(response => response.json())
            .then(data => {
                // 关闭弹出表单并刷新课程列表
                courseModal.style.display = "none";
                loadCourses();
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    // 加载课程列表的功能
    function loadCourses() {
        // 这里你可以通过fetch从后端加载课程列表并显示在页面上
    }
});
