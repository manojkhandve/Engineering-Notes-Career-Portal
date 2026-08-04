package com.tf.notes.service;
import java.util.List;

import com.tf.notes.entity.Note;

public interface NoteService {

    Note createNote(Note note);

    List<Note> getNotesBySubject(Long subjectId);

    List<Note> getNotesByBranchAndYear(Long branchId, Long yearId);

    List<Note> searchNotes(String keyword);

    List<Note> getPopularNotes();

    Note getNoteById(Long id);

    void deleteNote(Long id);

    void incrementDownload(Long noteId);
}