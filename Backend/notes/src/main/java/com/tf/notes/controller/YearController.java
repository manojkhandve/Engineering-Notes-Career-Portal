package com.tf.notes.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tf.notes.entity.Year;
import com.tf.notes.service.YearService;

import java.util.List;

@RestController
@RequestMapping("/api/years")
@CrossOrigin
public class YearController {

    @Autowired
    private YearService yearService;

    // CREATE
    @PostMapping
    public Year createYear(@RequestBody Year year) {
        return yearService.createYear(year);
    }

    // GET ALL (MOST USED)
    @GetMapping
    public List<Year> getAllYears() {
        return yearService.getAllYears();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Year getYearById(@PathVariable Long id) {
        return yearService.getYearById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Year updateYear(@PathVariable Long id,
                           @RequestBody Year year) {
        return yearService.updateYear(id, year);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteYear(@PathVariable Long id) {
        yearService.deleteYear(id);
    }
}