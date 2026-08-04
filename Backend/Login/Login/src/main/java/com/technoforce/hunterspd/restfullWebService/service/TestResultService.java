package com.technoforce.hunterspd.restfullWebService.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.technoforce.hunterspd.restfullWebService.Repo.TestResultRepo;
import com.technoforce.hunterspd.restfullWebService.model.TestResult;

@Service
public class TestResultService {

    @Autowired
    private TestResultRepo repo;

    public TestResult save(TestResult result) {
        if (result.getAttemptedAt() == null) {
            result.setAttemptedAt(LocalDateTime.now());
        }
        return repo.save(result);
    }

    /** All results for a user, newest first. */
    public List<TestResult> getByEmail(String email) {
        return repo.findByUserEmailOrderByAttemptedAtDesc(email);
    }

    /** Results filtered to a single test type. */
    public List<TestResult> getByEmailAndType(String email, String testType) {
        return repo.findByUserEmailAndTestTypeOrderByAttemptedAtDesc(email, testType);
    }
}
