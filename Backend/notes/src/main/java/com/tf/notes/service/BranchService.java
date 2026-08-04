package com.tf.notes.service;

import java.util.List;

import com.tf.notes.entity.Branch;

public interface BranchService {

    Branch createBranch(Branch branch);

    List<Branch> getAllBranches();

    List<Branch> getBranchesByCourse(Long courseId);

    Branch getBranchById(Long id);

    Branch updateBranch(Long id, Branch branch);

    void deleteBranch(Long id);
}