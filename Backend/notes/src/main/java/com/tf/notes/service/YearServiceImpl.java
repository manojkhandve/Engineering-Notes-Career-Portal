package com.tf.notes.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tf.notes.entity.Year;
import com.tf.notes.repository.YearRepository;

import java.util.List;

@Service
public class YearServiceImpl implements YearService {

    @Autowired
    private YearRepository yearRepository;

    // ✅ CREATE
    @Override
    public Year createYear(Year year) {
        return yearRepository.save(year);
    }

    // ✅ GET ALL (MOST USED)
    @Override
    public List<Year> getAllYears() {
        return yearRepository.findAll();
    }

    // ✅ GET BY ID
    @Override
    public Year getYearById(Long id) {
        return yearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Year not found"));
    }

    // ✅ UPDATE
    @Override
    public Year updateYear(Long id, Year updated) {
        Year existing = getYearById(id);
        existing.setYearName(updated.getYearName());
        return yearRepository.save(existing);
    }

    // ❌ DELETE
    @Override
    public void deleteYear(Long id) {
        Year existing = getYearById(id);
        yearRepository.delete(existing);
    }
}