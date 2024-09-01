package com.example.gpapredictor.controller;

import com.example.gpapredictor.model.Assessment;
import com.example.gpapredictor.model.Subject;
import com.example.gpapredictor.model.User;
import com.example.gpapredictor.service.SubjectService;
import com.example.gpapredictor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private UserService userService;  // 确保正确注入UserService

    @PostMapping("/add")
    public ResponseEntity<Subject> addSubject(@RequestBody Subject subject) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findUserByUsername(username);

        subject.setUser(user);

        // 这里是关键部分，将每个Assessment的subject字段设置为当前的subject
        for (Assessment assessment : subject.getAssessments()) {
            assessment.setSubject(subject);
        }

        Subject savedSubject = subjectService.addSubject(subject);
        return ResponseEntity.ok(savedSubject);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subject>> getSubjectsByUser(@PathVariable Long userId) {
        List<Subject> subjects = subjectService.getSubjectsByUser(userId);
        return ResponseEntity.ok(subjects);
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long subjectId) {
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok("Subject deleted successfully");
    }
}
