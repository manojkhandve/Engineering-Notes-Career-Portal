package com.technoforce.hunterspd.restfullWebService.Repo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.technoforce.hunterspd.restfullWebService.model.SolvedQuestion;

// Placed in the existing Repo package (capital R) matching UserRepo.java.
@Repository
public interface SolvedQuestionRepo extends JpaRepository<SolvedQuestion, Long> {

    // All solved question IDs for one user — used on page load.
    List<SolvedQuestion> findByUserEmail(String userEmail);

    // Check if a specific (user, question) pair already exists before
    // toggling, instead of catching a unique-constraint violation.
    Optional<SolvedQuestion> findByUserEmailAndQuestionId(String userEmail, String questionId);

    // Delete a specific (user, question) pair when un-solving.
    void deleteByUserEmailAndQuestionId(String userEmail, String questionId);

    // Delete everything for a user — used by the reset button.
    void deleteByUserEmail(String userEmail);

    // Returns rows grouped by date for the heatmap: [solvedDate, count].
    // The frontend only needs the last 49 days but we return everything
    // and let the frontend slice — keeps the query simple and cacheable.
    @Query("SELECT s.solvedDate, COUNT(s) FROM SolvedQuestion s WHERE s.userEmail = :email GROUP BY s.solvedDate ORDER BY s.solvedDate")
    List<Object[]> findActivityByEmail(@Param("email") String email);

    // Used for streak: finds dates in descending order so we can walk
    // back from today without pulling all rows into memory.
    @Query("SELECT DISTINCT s.solvedDate FROM SolvedQuestion s WHERE s.userEmail = :email AND s.solvedDate >= :from ORDER BY s.solvedDate DESC")
    List<LocalDate> findDistinctSolvedDatesSince(
        @Param("email") String email,
        @Param("from")  LocalDate from
    );
}
