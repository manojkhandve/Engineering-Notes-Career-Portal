package com.tf.notes.entity;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    @JsonIgnoreProperties("subjects")
    private Branch branch;

    @ManyToOne
    @JoinColumn(name = "year_id")
    @JsonIgnoreProperties("subjects")
    private Year year;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("subject")   // ← remove @JsonManagedReference
    private List<Note> notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

    public Year getYear() { return year; }
    public void setYear(Year year) { this.year = year; }

    public List<Note> getNotes() { return notes; }
    public void setNotes(List<Note> notes) { this.notes = notes; }

    public void addNote(Note note) {
        notes.add(note);
        note.setSubject(this);
    }
}