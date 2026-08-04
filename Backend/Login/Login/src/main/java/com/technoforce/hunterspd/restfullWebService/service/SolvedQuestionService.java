package com.technoforce.hunterspd.restfullWebService.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.technoforce.hunterspd.restfullWebService.Repo.SolvedQuestionRepo;
import com.technoforce.hunterspd.restfullWebService.model.SolvedQuestion;

@Service
public class SolvedQuestionService {

    @Autowired
    private SolvedQuestionRepo repo;

    // Returns a plain list of questionId strings (not full entities) —
    // that's all the frontend needs to rebuild its solved map on load.
    public List<String> getSolvedIds(String email) {
        return repo.findByUserEmail(email)
                   .stream()
                   .map(SolvedQuestion::getQuestionId)
                   .collect(Collectors.toList());
    }

    // Toggle: if the row exists → delete it (un-solve), else insert it
    // (solve). Returns true if the question is now solved, false if not.
    @Transactional
    public boolean toggle(String email, String questionId) {
        Optional<SolvedQuestion> existing =
            repo.findByUserEmailAndQuestionId(email, questionId);

        if (existing.isPresent()) {
            repo.deleteByUserEmailAndQuestionId(email, questionId);
            return false; // now un-solved
        } else {
            repo.save(new SolvedQuestion(email, questionId, LocalDate.now()));
            return true;  // now solved
        }
    }

    // Bulk-sync: called once when a user with existing localStorage
    // progress first opens the page after this backend goes live.
    // Inserts rows for any questionId not already in the DB; skips dupes.
    @Transactional
    public void bulkSync(String email, List<String> questionIds) {
        for (String qid : questionIds) {
            if (!repo.findByUserEmailAndQuestionId(email, qid).isPresent()) {
                repo.save(new SolvedQuestion(email, qid, LocalDate.now()));
            }
        }
    }

    // Wipes all progress for a user — called by the reset button.
    @Transactional
    public void resetAll(String email) {
        repo.deleteByUserEmail(email);
    }

    // Returns a map of ISO date string → count, e.g. {"2025-06-01": 3}.
    // The frontend uses this directly for the heatmap and streak calc.
    public Map<String, Long> getActivity(String email) {
        List<Object[]> rows = repo.findActivityByEmail(email);
        Map<String, Long> result = new HashMap<>();
        for (Object[] row : rows) {
            LocalDate date  = (LocalDate) row[0];
            Long      count = (Long)      row[1];
            result.put(date.toString(), count);
        }
        return result;
    }
}
