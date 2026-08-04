package com.tf.job.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String role;
    private String type;
    private String location;
    private String experience;
    private String packageValue;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    private List<String> tags;

    private String posted;
    private int postedDays;
    private int daysLeft;
    private String logo;

    private String externalLink;

    @JsonProperty("new")
    private boolean isNew;

    @JsonIgnore
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();

    // 🔹 Default Constructor
    public Job() {
    }

    // 🔹 Parameterized Constructor
    public Job(Long id, String title, String company, String role, String type,
               String location, String experience, String packageValue,
               String description,
               List<String> tags, String posted, int postedDays,
               int daysLeft, String logo, String externalLink, boolean isNew) {

        this.id = id;
        this.title = title;
        this.company = company;
        this.role = role;
        this.type = type;
        this.location = location;
        this.experience = experience;
        this.packageValue = packageValue;
        this.description = description;
        this.tags = tags;
        this.posted = posted;
        this.postedDays = postedDays;
        this.daysLeft = daysLeft;
        this.logo = logo;
        this.externalLink = externalLink;
        this.isNew = isNew;
    }

    // 🔹 Getters & Setters

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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getPackageValue() {
        return packageValue;
    }

    public void setPackageValue(String packageValue) {
        this.packageValue = packageValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getPosted() {
        return posted;
    }

    public void setPosted(String posted) {
        this.posted = posted;
    }

    public int getPostedDays() {
        return postedDays;
    }

    public void setPostedDays(int postedDays) {
        this.postedDays = postedDays;
    }

    public int getDaysLeft() {
        return daysLeft;
    }

    public void setDaysLeft(int daysLeft) {
        this.daysLeft = daysLeft;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(String externalLink) {
        this.externalLink = externalLink;
    }

    public boolean isNew() {
        return isNew;
    }

    public void setNew(boolean isNew) {
        this.isNew = isNew;
    }
}