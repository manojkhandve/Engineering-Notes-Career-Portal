package com.tf.notes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tf.notes.entity.Subject;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    // Get subjects by branch + year
    List<Subject> findByBranchIdAndYearId(Long branchId, Long yearId);

}
