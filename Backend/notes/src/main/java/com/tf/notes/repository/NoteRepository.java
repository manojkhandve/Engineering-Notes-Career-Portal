package com.tf.notes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tf.notes.dto.NoteResponse;
import com.tf.notes.entity.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // Get notes by subject
    List<Note> findBySubjectId(Long subjectId);

    // 🔥 Get notes by Branch + Year (MOST USED API)
    List<Note> findBySubject_Branch_IdAndSubject_Year_Id(Long branchId, Long yearId);

    // Get notes by branch only
    List<Note> findBySubject_Branch_Id(Long branchId);

    // Get notes by year only
    List<Note> findBySubject_Year_Id(Long yearId);

    // Search notes by title 
    List<Note> findByTitleContainingIgnoreCase(String keyword);

    // Popular notes (based on downloads)
    List<Note> findTop5ByOrderByDownloadsDesc();
    
    @Query("""
    	    SELECT new com.tf.notes.dto.NoteResponse(
    	        n.id,
    	        n.title
    	    )
    	    FROM Note n
    	    WHERE n.subject.branch.id = :branchId
    	      AND n.subject.year.id = :yearId
    	""")
    	List<NoteResponse> getNotesForViewer(Long branchId, Long yearId);
}