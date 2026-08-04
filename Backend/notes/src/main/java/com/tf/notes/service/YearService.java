package com.tf.notes.service;


import java.util.List;

import com.tf.notes.entity.Year;

public interface YearService {

    Year createYear(Year year);

    List<Year> getAllYears();

    Year getYearById(Long id);

    Year updateYear(Long id, Year year);

    void deleteYear(Long id);
}
