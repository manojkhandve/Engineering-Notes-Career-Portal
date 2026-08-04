package com.tf.notes.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tf.notes.entity.Branch;
import com.tf.notes.repository.BranchRepository;

import java.util.List;

@Service
public class BranchServiceImpl implements BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Override
    public Branch createBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    @Override
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    public List<Branch> getBranchesByCourse(Long courseId) {
        return branchRepository.findByCourseId(courseId);
    }

    @Override
    public Branch getBranchById(Long id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
    }

    @Override
    public Branch updateBranch(Long id, Branch updated) {
        Branch existing = getBranchById(id);
        existing.setName(updated.getName());
        return branchRepository.save(existing);
    }

    @Override
    public void deleteBranch(Long id) {
        Branch existing = getBranchById(id);
        branchRepository.delete(existing);
    }
}
