package com.technoforce.hunterspd.restfullWebService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.technoforce.hunterspd.restfullWebService.model.TestResult;
import com.technoforce.hunterspd.restfullWebService.service.TestResultService;

@RestController
@RequestMapping("/api/results")
@CrossOrigin("*")
public class TestResultController {

    @Autowired
    private TestResultService service;

    /**
     * POST /api/results
     * Primary save endpoint — attemptedAt is set server-side if missing.
     */
    @PostMapping
    public ResponseEntity<TestResult> save(@RequestBody TestResult result) {
        return new ResponseEntity<>(service.save(result), HttpStatus.CREATED);
    }

    /**
     * POST /api/results/save
     * Alias so QuantAI.jsx and InterviewResult.jsx can both call /save
     * without needing a frontend change.
     */
    @PostMapping("/save")
    public ResponseEntity<TestResult> saveAlias(@RequestBody TestResult result) {
        return save(result);
    }

    /**
     * GET /api/results/{email}
     * All results for a user, newest first.
     * Called by Profile.jsx to render the report card.
     */
    @GetMapping("/{email}")
    public ResponseEntity<List<TestResult>> getAll(@PathVariable String email) {
        return ResponseEntity.ok(service.getByEmail(email));
    }

    /**
     * GET /api/results/{email}/filter?type=AI_INTERVIEW
     * Optional filter by testType.
     */
    @GetMapping("/{email}/filter")
    public ResponseEntity<List<TestResult>> getByType(
            @PathVariable String email,
            @RequestParam String type) {
        return ResponseEntity.ok(service.getByEmailAndType(email, type));
    }
}
