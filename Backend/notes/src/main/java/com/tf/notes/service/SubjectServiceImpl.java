package com.tf.notes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tf.notes.entity.Subject;
import com.tf.notes.repository.SubjectRepository;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Override
    public List<Subject> getSubjectsByBranchAndYear(Long branchId, Long yearId) {
        return subjectRepository.findByBranchIdAndYearId(branchId, yearId);
    }

    @Override
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    @Override
    public Subject updateSubject(Long id, Subject updated) {
        Subject existing = getSubjectById(id);
        existing.setName(updated.getName());
        return subjectRepository.save(existing);
    }

    @Override
    public void deleteSubject(Long id) {
        Subject existing = getSubjectById(id);
        subjectRepository.delete(existing);
    }
}