package com.tf.notes.service;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tf.notes.entity.Course;
import com.tf.notes.repository.CourseRepository;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // ✅ CREATE
    @Override
    public Course createCourse(Course course) {

        // validation
        if (course.getName() == null || course.getName().trim().isEmpty()) {
            throw new RuntimeException("Course name cannot be empty");
        }

        return courseRepository.save(course);
    }

    // ✅ GET ALL
    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // ✅ GET BY ID
    @Override
    public Course getCourseById(Long id) {

        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    // ✅ UPDATE
    @Override
    public Course updateCourse(Long id, Course updatedCourse) {

        Course existing = getCourseById(id);

        if (updatedCourse.getName() != null) {
            existing.setName(updatedCourse.getName());
        }

        return courseRepository.save(existing);
    }

    // ✅ DELETE
    @Override
    public void deleteCourse(Long id) {

        Course existing = getCourseById(id);
        courseRepository.delete(existing);
    }
}