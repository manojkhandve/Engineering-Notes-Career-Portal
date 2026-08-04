package com.tf.notes.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class Year {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String yearName;

    @OneToMany(mappedBy = "year", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Subject> subjects;

    // Getter and Setter for id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter and Setter for yearName
    public String getYearName() {
        return yearName;
    }

    public void setYearName(String yearName) {
        this.yearName = yearName;
    }

    // ✅ Correct Getter
    public List<Subject> getSubjects() {
        return subjects;
    }

    // ✅ Correct Setter
    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
    }

    // ✅ Helper Method (Fixed)
    public void addSubject(Subject sub) {
        subjects.add(sub);
        sub.setYear(this);
    }
}