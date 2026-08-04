package com.technoforce.hunterspd.restfullWebService.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * One row per test attempt.
 * testType values: "AI_INTERVIEW" | "QUANTITATIVE"
 */
@Entity
@Table(name = "test_results")
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    /** "AI_INTERVIEW" | "QUANTITATIVE" */
    @Column(name = "test_type", nullable = false)
    private String testType;

    /** Role for interview ("Software Engineer"), topic for quant ("Percentage") */
    @Column(name = "topic")
    private String topic;

    /** "Easy" | "Medium" | "Hard" | "intermediate" etc. */
    @Column(name = "difficulty")
    private String difficulty;

    /** Questions correct (quant) or overall 0-100 score (interview) */
    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    /** Percentage 0-100 */
    @Column(name = "percentage", nullable = false)
    private Integer percentage;

    /** Tab switches recorded during the session (0 for quant) */
    @Column(name = "tab_warnings")
    private Integer tabWarnings;

    /**
     * Named "attemptedAt" in JSON to match what Profile.jsx reads.
     * Set server-side if the client omits it.
     */
    @JsonProperty("attemptedAt")
    @Column(name = "attempted_at", nullable = false)
    private LocalDateTime attemptedAt;

    public TestResult() {}

    public TestResult(String userEmail, String testType, String topic, String difficulty,
                      Integer score, Integer totalQuestions, Integer percentage,
                      Integer tabWarnings, LocalDateTime attemptedAt) {
        this.userEmail      = userEmail;
        this.testType       = testType;
        this.topic          = topic;
        this.difficulty     = difficulty;
        this.score          = score;
        this.totalQuestions = totalQuestions;
        this.percentage     = percentage;
        this.tabWarnings    = tabWarnings;
        this.attemptedAt    = attemptedAt;
    }

    public Long getId()                          { return id; }
    public String getUserEmail()                 { return userEmail; }
    public void setUserEmail(String e)           { this.userEmail = e; }
    public String getTestType()                  { return testType; }
    public void setTestType(String t)            { this.testType = t; }
    public String getTopic()                     { return topic; }
    public void setTopic(String t)               { this.topic = t; }
    public String getDifficulty()                { return difficulty; }
    public void setDifficulty(String d)          { this.difficulty = d; }
    public Integer getScore()                    { return score; }
    public void setScore(Integer s)              { this.score = s; }
    public Integer getTotalQuestions()           { return totalQuestions; }
    public void setTotalQuestions(Integer t)     { this.totalQuestions = t; }
    public Integer getPercentage()               { return percentage; }
    public void setPercentage(Integer p)         { this.percentage = p; }
    public Integer getTabWarnings()              { return tabWarnings; }
    public void setTabWarnings(Integer t)        { this.tabWarnings = t; }
    public LocalDateTime getAttemptedAt()        { return attemptedAt; }
    public void setAttemptedAt(LocalDateTime t)  { this.attemptedAt = t; }
}
