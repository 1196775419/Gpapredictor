package com.example.gpapredictor.controller;

import com.example.gpapredictor.model.Assessment;
import com.example.gpapredictor.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @PostMapping("/add")
    public ResponseEntity<Assessment> addAssessment(@RequestBody Assessment assessment) {
        return ResponseEntity.ok(assessmentService.addAssessment(assessment));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Assessment>> getAssessmentsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsBySubject(subjectId));
    }

    @DeleteMapping("/{assessmentId}")
    public ResponseEntity<String> deleteAssessment(@PathVariable Long assessmentId) {
        assessmentService.deleteAssessment(assessmentId);
        return ResponseEntity.ok("Assessment deleted successfully");
    }



}
