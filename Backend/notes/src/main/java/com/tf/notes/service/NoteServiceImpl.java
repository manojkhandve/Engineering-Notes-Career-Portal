package com.tf.notes.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tf.notes.entity.Note;
import com.tf.notes.repository.NoteRepository;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteRepository noteRepository;

    // ✅ Create Note
    @Override
    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    // ✅ Get notes by subject
    @Override
    public List<Note> getNotesBySubject(Long subjectId) {
        return noteRepository.findBySubjectId(subjectId);
    }

    // 🔥 MAIN METHOD (used in frontend)
    @Transactional(readOnly = true)
    public List<Note> getNotesByBranchAndYear(Long branchId, Long yearId) {
        return noteRepository.findBySubject_Branch_IdAndSubject_Year_Id(branchId, yearId);
    }

    // 🔍 Search
    @Override
    public List<Note> searchNotes(String keyword) {
        return noteRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // ⭐ Popular Notes
    @Override
    public List<Note> getPopularNotes() {
        return noteRepository.findTop5ByOrderByDownloadsDesc();
    }

    // ✅ Get by ID
    @Override
    public Note getNoteById(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
    }

    // ❌ Delete
    @Override
    public void deleteNote(Long id) {
        Note note = getNoteById(id);
        noteRepository.delete(note);
    }

    // 📈 Increment download
    @Override
    public void incrementDownload(Long noteId) {
        Note note = getNoteById(noteId);
        note.setDownloads(note.getDownloads() + 1);
        noteRepository.save(note);
    }
}