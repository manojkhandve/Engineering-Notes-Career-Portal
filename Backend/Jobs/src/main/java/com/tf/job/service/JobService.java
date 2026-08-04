package com.tf.job.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tf.job.entity.Job;
import com.tf.job.repository.JobRepository;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository repo;

    public List<Job> getAllJobs() {
        return repo.findAll();
    }

    public Job getJobById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Job createJob(Job job) {
        return repo.save(job);
    }

    public Job updateJob(Long id, Job job) {

        Job existing = repo.findById(id).orElse(null);

        if (existing != null) {

            existing.setTitle(job.getTitle());
            existing.setCompany(job.getCompany());
            existing.setRole(job.getRole());
            existing.setType(job.getType());
            existing.setLocation(job.getLocation());
            existing.setExperience(job.getExperience());
            existing.setPackageValue(job.getPackageValue());

            // ✅ Added Description
            existing.setDescription(job.getDescription());

            existing.setTags(job.getTags());
            existing.setPosted(job.getPosted());
            existing.setPostedDays(job.getPostedDays());
            existing.setDaysLeft(job.getDaysLeft());
            existing.setLogo(job.getLogo());
            existing.setExternalLink(job.getExternalLink());
            existing.setNew(job.isNew());

            return repo.save(existing);
        }

        return null;
    }

    public void deleteJob(Long id) {
        repo.deleteById(id);
    }
}