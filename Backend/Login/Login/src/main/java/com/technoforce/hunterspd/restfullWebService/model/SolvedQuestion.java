package com.technoforce.hunterspd.restfullWebService.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

// One row = one question solved by one user.
// Deleted on un-solve so the table stays lean.
// solvedDate is LocalDate (not DateTime) so grouping by day for the
// heatmap is a simple GROUP BY without any timezone truncation.
@Entity
@Table(
    name = "solved_questions",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_email", "question_id" })
    }
)
public class SolvedQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Same as User.email (@Id there) — plain String, no FK constraint
    // so deleting a User doesn't cascade and cause issues mid-session.
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    // Matches the `id` field on each question in the frontend dsaData.js
    // (e.g. "two-sum", "reverse-linked-list"). Not a DB-generated value.
    @Column(name = "question_id", nullable = false)
    private String questionId;

    // Date the row was first inserted — used for the heatmap and streak.
    @Column(name = "solved_date", nullable = false)
    private LocalDate solvedDate;

    public SolvedQuestion() {}

    public SolvedQuestion(String userEmail, String questionId, LocalDate solvedDate) {
        this.userEmail  = userEmail;
        this.questionId = questionId;
        this.solvedDate = solvedDate;
    }

    public Long getId()                    { return id; }
    public void setId(Long id)             { this.id = id; }

    public String getUserEmail()           { return userEmail; }
    public void setUserEmail(String e)     { this.userEmail = e; }

    public String getQuestionId()          { return questionId; }
    public void setQuestionId(String q)    { this.questionId = q; }

    public LocalDate getSolvedDate()       { return solvedDate; }
    public void setSolvedDate(LocalDate d) { this.solvedDate = d; }
}
