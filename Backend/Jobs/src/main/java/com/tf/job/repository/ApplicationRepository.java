package com.tf.job.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tf.job.entity.Application;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserEmail(String userEmail);
    Optional<Application> findByUserEmailAndJobId(String userEmail, Long jobId);
    boolean existsByUserEmailAndJobId(String userEmail, Long jobId);
}