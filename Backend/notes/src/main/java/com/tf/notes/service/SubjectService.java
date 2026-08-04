package com.tf.notes.service;

import java.util.List;

import com.tf.notes.entity.Subject;

public interface SubjectService {

    Subject createSubject(Subject subject);

    List<Subject> getSubjectsByBranchAndYear(Long branchId, Long yearId);

    Subject getSubjectById(Long id);

    Subject updateSubject(Long id, Subject subject);

    void deleteSubject(Long id);
}
