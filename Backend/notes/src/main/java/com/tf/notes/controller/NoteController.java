package com.tf.notes.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tf.notes.entity.Note;
import com.tf.notes.entity.Subject;
import com.tf.notes.repository.SubjectRepository;
import com.tf.notes.service.NoteService;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin
public class NoteController {

	@Autowired
	private NoteService noteService;

	@Autowired
	private SubjectRepository subjectRepository;

	// CREATE
	@PostMapping(

			consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Note createNote(@RequestParam String title, @RequestParam Long subjectId,

			@RequestParam(required = false) MultipartFile fileData,
			@RequestParam(required = false) MultipartFile dkNotesUrl,
			@RequestParam(required = false) MultipartFile insemUrl,
			@RequestParam(required = false) MultipartFile endsemUrl,
			@RequestParam(required = false) MultipartFile modelAnswerUrl,
			@RequestParam(required = false) MultipartFile microprojectUrl) throws IOException {
		System.out.println("CREATE NOTE API HIT");
		System.out.println("Received Subject ID = " + subjectId);
		Subject subject = subjectRepository.findById(subjectId)
				.orElseThrow(() -> new RuntimeException("Subject not found"));

		Note note = new Note();

		note.setTitle(title);
		note.setSubject(subject);

		if (fileData != null)
			note.setFile_data(fileData.getBytes());

		if (dkNotesUrl != null)
			note.setDkNotesUrl(dkNotesUrl.getBytes());

		if (insemUrl != null)
			note.setInsemUrl(insemUrl.getBytes());

		if (endsemUrl != null)
			note.setEndsemUrl(endsemUrl.getBytes());

		if (modelAnswerUrl != null)
			note.setModelAnswerUrl(modelAnswerUrl.getBytes());

		if (microprojectUrl != null)
			note.setMicroprojectUrl(microprojectUrl.getBytes());

		return noteService.createNote(note);
	}

	// GET NOTES (MAIN API)
	@GetMapping
	public List<Note> getNotes(@RequestParam Long branchId, @RequestParam Long yearId) {
		return noteService.getNotesByBranchAndYear(branchId, yearId);
	}

	// GET BY SUBJECT
	@GetMapping("/subject/{subjectId}")
	public List<Note> getBySubject(@PathVariable Long subjectId) {
		return noteService.getNotesBySubject(subjectId);
	}

//    // SEARCH
//    @GetMapping("/search")
//    public List<Note> search(@RequestParam String keyword) {
//        return noteService.searchNotes(keyword);
//    }
//
//    // POPULAR
//    @GetMapping("/popular")
//    public List<Note> popularNotes() {
//        return noteService.getPopularNotes();
//    }
//
//    // DOWNLOAD COUNT
//    @PutMapping("/download/{id}")
//    public void incrementDownload(@PathVariable Long id) {
//        noteService.incrementDownload(id);
//    }
//
//    // DELETE
//    @DeleteMapping("/{id}")
//    public void deleteNote(@PathVariable Long id) {
//        noteService.deleteNote(id);
//    }
	@GetMapping("/download/file/{id}")
	public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {

		Note note = noteService.getNoteById(id);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=notes.pdf")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(note.getFile_data());
	}

	@GetMapping("/download/dk/{id}")
	public ResponseEntity<byte[]> downloadDK(@PathVariable Long id) {

		Note note = noteService.getNoteById(id);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dknotes.pdf")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(note.getDkNotesUrl());
	}

	@GetMapping("/download/insem/{id}")
	public ResponseEntity<byte[]> downloadInsem(@PathVariable Long id) {

		Note note = noteService.getNoteById(id);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=insem.pdf")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(note.getInsemUrl());
	}

	@GetMapping("/download/endsem/{id}")
	public ResponseEntity<byte[]> downloadEndsem(@PathVariable Long id) {

		Note note = noteService.getNoteById(id);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=endsem.pdf")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(note.getEndsemUrl());
	}

	@GetMapping("/download/modelanswer/{id}")
	public ResponseEntity<byte[]> downloadModelAnswer(@PathVariable Long id) {

		Note note = noteService.getNoteById(id);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=modelanswer.pdf")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(note.getModelAnswerUrl());
	}

	@GetMapping("/download/microproject/{id}")
	public ResponseEntity<byte[]> downloadMicroproject(@PathVariable Long id) {

		Note note = noteService.getNoteById(id);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=microproject.pdf")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(note.getMicroprojectUrl());
	}

}