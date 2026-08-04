package com.tf.job.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tf.job.entity.Application;
import com.tf.job.service.ApplicationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // POST /api/applications/apply
    // Body: { "userEmail": "user@example.com", "jobId": 1 }
    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> body) {
        String userEmail = (String) body.get("userEmail");
        Long jobId = Long.valueOf(body.get("jobId").toString());

        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userEmail is required"));
        }

        Application application = applicationService.applyForJob(userEmail, jobId);

        if (application == null) {
            return ResponseEntity.status(409).body(Map.of("error", "Already applied or job not found"));
        }

        return ResponseEntity.ok(application);
    }

    // GET /api/applications?email=user@example.com
    @GetMapping
    public ResponseEntity<List<Application>> getApplications(@RequestParam String email) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(email));
    }

    // GET /api/applications/check?email=user@example.com&jobId=1
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkApplied(
            @RequestParam String email,
            @RequestParam Long jobId) {
        boolean applied = applicationService.hasApplied(email, jobId);
        return ResponseEntity.ok(Map.of("applied", applied));
    }
}