package com.tf.notes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tf.notes.entity.Branch;
import com.tf.notes.entity.Subject;
import com.tf.notes.entity.Year;
import com.tf.notes.repository.BranchRepository;
import com.tf.notes.repository.YearRepository;
import com.tf.notes.service.SubjectService;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private YearRepository yearRepository;

    // CREATE
    @PostMapping
    public Subject createSubject(@RequestBody Subject subject) {
        // ← FIX: fetch branch and year from DB before saving
        if (subject.getBranch() != null && subject.getBranch().getId() != null) {
            Branch branch = branchRepository.findById(subject.getBranch().getId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
            subject.setBranch(branch);
        }
        if (subject.getYear() != null && subject.getYear().getId() != null) {
            Year year = yearRepository.findById(subject.getYear().getId())
                .orElseThrow(() -> new RuntimeException("Year not found"));
            subject.setYear(year);
        }
        return subjectService.createSubject(subject);
    }

    // GET BY BRANCH + YEAR
    @GetMapping
    public List<Subject> getSubjects(
            @RequestParam Long branchId,
            @RequestParam Long yearId) {
        return subjectService.getSubjectsByBranchAndYear(branchId, yearId);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Subject getSubjectById(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Subject updateSubject(@PathVariable Long id,
                                @RequestBody Subject subject) {
        return subjectService.updateSubject(id, subject);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}