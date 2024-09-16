package com.example.gpapredictor.controller;

import com.example.gpapredictor.dto.AssessmentDTO;
import com.example.gpapredictor.dto.SubjectDTO;
import com.example.gpapredictor.model.Assessment;
import com.example.gpapredictor.model.Subject;
import com.example.gpapredictor.model.User;
import com.example.gpapredictor.service.SubjectService;
import com.example.gpapredictor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private UserService userService;  // 确保正确注入UserService

    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @PostMapping("/add")
    public ResponseEntity<Subject> addSubject(@RequestBody Map<String, Object> payload) {
        String subjectName = (String) payload.get("subjectName");
        String semester = (String) payload.get("semester");
        String username = (String) payload.get("username");
        System.out.println(username);
        System.out.println(subjectName);
        System.out.println(semester);
        // Find the user by username
        User user = userService.findUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Handle case where the user is not found
        }

        // Create Subject object
        Subject subject = new Subject();
        subject.setSubjectName(subjectName);
        subject.setSemester(semester);
        subject.setUser(user);

        // Process assessments
        List<Map<String, Object>> assessmentsData = (List<Map<String, Object>>) payload.get("assessments");
        for (Map<String, Object> assessmentData : assessmentsData) {
            Assessment assessment = new Assessment();
            assessment.setAssessmentName((String) assessmentData.get("assessmentName"));
            assessment.setWeight((double) Integer.parseInt((String) assessmentData.get("weight")));
            assessment.setFullMark((double) Integer.parseInt((String) assessmentData.get("fullMark")));
            assessment.setSubject(subject);
            subject.getAssessments().add(assessment);
        }

        // Save the subject using the subjectService
        Subject savedSubject = subjectService.addSubject(subject);

        // Return the saved subject in the response

        System.out.println(ResponseEntity.ok(savedSubject));
        return ResponseEntity.ok(savedSubject);
    }




    @GetMapping("/user/{username}")
    public ResponseEntity<List<SubjectDTO>> getSubjectsByUser(@PathVariable String username) {
        // 查找用户
        User user = userService.findUserByUsername(username);

        // 如果用户不存在，返回404 Not Found
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // 获取用户ID
        Long userId = user.getId();

        // 使用用户ID获取课程列表
        List<Subject> subjects = subjectService.getSubjectsByUser(userId);

        // 将Subject实体对象转换为SubjectDTO对象
        List<SubjectDTO> subjectDTOs = subjects.stream().map(subject -> {
            SubjectDTO dto = new SubjectDTO();
            dto.setId(subject.getId());
            dto.setSubjectName(subject.getSubjectName());
            dto.setSemester(subject.getSemester());

            List<AssessmentDTO> assessmentDTOs = subject.getAssessments().stream().map(assessment -> {
                AssessmentDTO assessmentDTO = new AssessmentDTO();
                assessmentDTO.setId(assessment.getId());
                assessmentDTO.setAssessmentName(assessment.getAssessmentName());
                assessmentDTO.setWeight(assessment.getWeight());
                assessmentDTO.setFullMark(assessment.getFullMark());
                return assessmentDTO;
            }).collect(Collectors.toList());

            dto.setAssessments(assessmentDTOs);
            return dto;
        }).collect(Collectors.toList());

        // 返回转换后的DTO列表
        return ResponseEntity.ok(subjectDTOs);
    }


    @DeleteMapping("/{subjectId}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long subjectId) {
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok("Subject deleted successfully");
    }

    @PutMapping("/{subjectId}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long subjectId, @RequestBody Subject updatedSubject) {
        System.out.println("Received Subject ID: " + updatedSubject.getId());
        System.out.println("Subject Name: " + updatedSubject.getSubjectName());
        System.out.println("Assessments: " + updatedSubject.getAssessments());

        Subject subject = subjectService.getSubjectById(subjectId);

        if (subject == null) {
            return ResponseEntity.notFound().build();
        }

        subject.setSubjectName(updatedSubject.getSubjectName());
        subject.setSemester(updatedSubject.getSemester());

        List<Assessment> currentAssessments = subject.getAssessments();
        List<Assessment> updatedAssessments = updatedSubject.getAssessments();

        for (Assessment updatedAssessment : updatedAssessments) {
            boolean found = false;
            System.out.println("Updated Assessment ID: " + updatedAssessment.getId());
            System.out.println("Updated Assessment Name: " + updatedAssessment.getAssessmentName());

            if (updatedAssessment.getId() == null) {
                // 如果 Assessment ID 为空，说明是新添加的记录，直接添加到现有课程
                System.out.println("Adding new assessment: " + updatedAssessment.getAssessmentName());
                updatedAssessment.setSubject(subject);  // 确保设置了 subject
                currentAssessments.add(updatedAssessment);
            } else {
                // 遍历现有的 Assessment，看是否存在相同的 ID
                for (Assessment currentAssessment : currentAssessments) {
                    if (currentAssessment.getId().equals(updatedAssessment.getId())) {
                        currentAssessment.setAssessmentName(updatedAssessment.getAssessmentName());
                        currentAssessment.setWeight(updatedAssessment.getWeight());
                        currentAssessment.setFullMark(updatedAssessment.getFullMark());
                        found = true;
                        break;
                    }
                }
            }
        }

        Subject savedSubject = subjectService.updateSubject(subject);
        return ResponseEntity.ok(savedSubject);
    }





    @GetMapping("/{subjectId}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long subjectId) {
        Subject subject = subjectService.getSubjectById(subjectId);
        // 检查是否为空
        if (subject != null) {
            subject.getAssessments().forEach(a -> a.setSubject(null));  // 防止循环引用
            return ResponseEntity.ok(subject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



}
