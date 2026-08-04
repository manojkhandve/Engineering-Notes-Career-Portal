package com.tf.notes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tf.notes.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

}
