// src/main/resources/static/js/addCourse.js
document.addEventListener("DOMContentLoaded", function() {
    const courseForm = document.getElementById("courseForm");
    const assessmentsContainer = document.getElementById("assessmentsContainer");
    const addAssessmentButton = document.getElementById("addAssessment");

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

        fetch("/api/subjects/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subjectName: courseName,
                semester: semester,
                assessments: assessments
            })
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = "home.html"; // 保存成功后跳转回首页
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });
});
