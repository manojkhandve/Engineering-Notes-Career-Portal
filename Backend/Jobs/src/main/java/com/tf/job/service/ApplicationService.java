package com.tf.job.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tf.job.entity.Application;
import com.tf.job.entity.Job;
import com.tf.job.repository.ApplicationRepository;
import com.tf.job.repository.JobRepository;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepo;

    @Autowired
    private JobRepository jobRepo;

    // Apply for a job — returns null if already applied or job not found
    public Application applyForJob(String userEmail, Long jobId) {
        if (applicationRepo.existsByUserEmailAndJobId(userEmail, jobId)) {
            return null; // already applied
        }
        Job job = jobRepo.findById(jobId).orElse(null);
        if (job == null) return null;

        Application application = new Application(userEmail, job);
        return applicationRepo.save(application);
    }

    // Get all applied jobs for a user
    public List<Application> getApplicationsByUser(String userEmail) {
        return applicationRepo.findByUserEmail(userEmail);
    }

    // Check if user already applied to a specific job
    public boolean hasApplied(String userEmail, Long jobId) {
        return applicationRepo.existsByUserEmailAndJobId(userEmail, jobId);
    }
}