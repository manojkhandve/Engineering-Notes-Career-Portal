package com.tf.notes.dto;

public class NoteResponse {

    private Long id;
    private String title;

    public NoteResponse(Long id, String title) {
        this.id = id;
        this.title = title;
    }

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

    // getters
}
