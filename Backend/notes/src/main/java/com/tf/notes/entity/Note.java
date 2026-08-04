package com.tf.notes.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;

@Entity
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(name = "file_data" )
    @Lob
    private byte[] file_data;        // ← clean Java name, maps to file_url column
    
    @Column(name = "dkNotesUrl")
    @Lob
    private byte[] dkNotesUrl;
    @Column(name = "insemUrl")
    @Lob
    private byte[] insemUrl;
    @Lob
    @Column(name = "endsemUrl")
    private byte[] endsemUrl;
    @Column(name = "modelAnswerUrl")
    @Lob
    private byte[] modelAnswerUrl;
    @Column(name = "microprojectUrl")
    @Lob
    private byte[] microprojectUrl;

    private int downloads = 0;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "subject_id")
    @JsonIgnoreProperties("notes")
    private Subject subject;



    public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public String getTitle() {
		return title;
	}



	public void setTitle(String title) {
		this.title = title;
	}



	public byte[] getFile_data() {
		return file_data;
	}



	public void setFile_data(byte[] file_data) {
		this.file_data = file_data;
	}



	public byte[] getDkNotesUrl() {
		return dkNotesUrl;
	}



	public void setDkNotesUrl(byte[] dkNotesUrl) {
		this.dkNotesUrl = dkNotesUrl;
	}



	public byte[] getInsemUrl() {
		return insemUrl;
	}



	public void setInsemUrl(byte[] insemUrl) {
		this.insemUrl = insemUrl;
	}



	public byte[] getEndsemUrl() {
		return endsemUrl;
	}



	public void setEndsemUrl(byte[] endsemUrl) {
		this.endsemUrl = endsemUrl;
	}



	public byte[] getModelAnswerUrl() {
		return modelAnswerUrl;
	}



	public void setModelAnswerUrl(byte[] modelAnswerUrl) {
		this.modelAnswerUrl = modelAnswerUrl;
	}



	public byte[] getMicroprojectUrl() {
		return microprojectUrl;
	}



	public void setMicroprojectUrl(byte[] microprojectUrl) {
		this.microprojectUrl = microprojectUrl;
	}



	public int getDownloads() {
		return downloads;
	}



	public void setDownloads(int downloads) {
		this.downloads = downloads;
	}



	public LocalDateTime getCreatedAt() {
		return createdAt;
	}



	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}



	public Subject getSubject() {
		return subject;
	}



	public void setSubject(Subject subject) {
		this.subject = subject;
	}



	public void incrementDownloads() { this.downloads++; }
}