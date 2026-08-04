package com.technoforce.hunterspd.restfullWebService.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.technoforce.hunterspd.restfullWebService.model.TestResult;

@Repository
public interface TestResultRepo extends JpaRepository<TestResult, Long> {

    /** All results for a user, newest first — used by the profile report card. */
    List<TestResult> findByUserEmailOrderByAttemptedAtDesc(String userEmail);

    /** Filtered by test type — useful for separate interview / quant views. */
    List<TestResult> findByUserEmailAndTestTypeOrderByAttemptedAtDesc(String userEmail, String testType);
}
