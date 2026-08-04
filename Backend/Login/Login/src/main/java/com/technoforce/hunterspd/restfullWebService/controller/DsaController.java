package com.technoforce.hunterspd.restfullWebService.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.technoforce.hunterspd.restfullWebService.service.SolvedQuestionService;

// All DSA progress endpoints live under /api/dsa to keep them separate
// from the User CRUD endpoints in UserController.
// CORS is * matching UserController — tighten in production.
@RestController
@RequestMapping("/api/dsa")
@CrossOrigin("*")
public class DsaController {

    @Autowired
    private SolvedQuestionService service;

    // GET /api/dsa/progress?email=x
    // Returns the list of solved questionIds for the user.
    // Called once on DSASheet mount to restore state.
    @GetMapping("/progress")
    public ResponseEntity<List<String>> getProgress(@RequestParam String email) {
        return ResponseEntity.ok(service.getSolvedIds(email));
    }

    // POST /api/dsa/toggle?email=x&questionId=y
    // Marks solved → un-solved or vice versa.
    // Returns { "solved": true/false } so the frontend knows the new state.
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Boolean>> toggle(
            @RequestParam String email,
            @RequestParam String questionId) {

        boolean nowSolved = service.toggle(email, questionId);
        return ResponseEntity.ok(Map.of("solved", nowSolved));
    }

    // POST /api/dsa/sync?email=x
    // Body: ["two-sum", "reverse-linked-list", ...]
    // One-time migration: pushes whatever was in localStorage to the DB
    // without overwriting existing rows. Safe to call multiple times.
    @PostMapping("/sync")
    public ResponseEntity<String> sync(
            @RequestParam String email,
            @RequestBody List<String> questionIds) {

        service.bulkSync(email, questionIds);
        return ResponseEntity.ok("Synced " + questionIds.size() + " questions");
    }

    // DELETE /api/dsa/reset?email=x
    // Wipes all progress for the user — matches the reset button.
    @DeleteMapping("/reset")
    public ResponseEntity<String> reset(@RequestParam String email) {
        service.resetAll(email);
        return ResponseEntity.ok("Progress reset");
    }

    // GET /api/dsa/activity?email=x
    // Returns { "2025-06-01": 3, "2025-06-02": 1, ... }
    // Used for the heatmap and streak calculation.
    @GetMapping("/activity")
    public ResponseEntity<Map<String, Long>> getActivity(@RequestParam String email) {
        return ResponseEntity.ok(service.getActivity(email));
    }
}
