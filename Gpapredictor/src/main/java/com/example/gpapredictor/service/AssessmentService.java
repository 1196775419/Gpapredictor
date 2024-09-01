package com.example.gpapredictor.service;

import com.example.gpapredictor.model.Assessment;
import com.example.gpapredictor.repository.AssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    public Assessment addAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    public List<Assessment> getAssessmentsBySubject(Long subjectId) {
        return assessmentRepository.findBySubjectId(subjectId);
    }

    public void deleteAssessment(Long assessmentId) {
        assessmentRepository.deleteById(assessmentId);
    }



}
