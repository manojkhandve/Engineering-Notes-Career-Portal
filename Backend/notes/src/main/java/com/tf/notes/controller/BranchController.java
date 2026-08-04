package com.tf.notes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tf.notes.entity.*;
import com.tf.notes.repository.CourseRepository;
import com.tf.notes.service.BranchService;

	
@RestController
@RequestMapping("/api/branches")
@CrossOrigin
public class BranchController {

	@Autowired
	private BranchService branchService;
	@Autowired
	private CourseRepository courseRepository;

	// CREATE
	@PostMapping
	public Branch createBranch(@RequestBody Branch branch) {
	    if (branch.getCourse() == null || branch.getCourse().getId() == null) {
	        throw new RuntimeException("Course ID is required");
	    }
	    Course course = courseRepository.findById(branch.getCourse().getId())
	            .orElseThrow(() -> new RuntimeException("Course not found"));
	    branch.setCourse(course);
	    return branchService.createBranch(branch);
	}

	// GET ALL
	@GetMapping
	public List<Branch> getAllBranches() {
		return branchService.getAllBranches();
	}

	// GET BY COURSE
	@GetMapping("/by-course")
	public List<Branch> getByCourse(@RequestParam Long courseId) {
		return branchService.getBranchesByCourse(courseId);
	}

	// GET BY ID
	@GetMapping("/{id}")
	public Branch getBranchById(@PathVariable Long id) {
		return branchService.getBranchById(id);
	}

	// UPDATE
//	@PutMapping("/{id}")
//	public Branch updateBranch(@PathVariable Long id, @RequestBody Branch branch) {
//		return branchService.updateBranch(id, branch);
//	}

	// DELETE
	@DeleteMapping("/{id}")
	public void deleteBranch(@PathVariable Long id) {
		branchService.deleteBranch(id);
	}
}