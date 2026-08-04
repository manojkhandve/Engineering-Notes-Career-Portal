package com.tf.notes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tf.notes.entity.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByCourseId(Long courseId);
}
