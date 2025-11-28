package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Performance;

public interface PerformanceRepository extends JpaRepository<Performance, Integer> {
	List<Performance> findByStudentId(Integer studentId);
	List<Performance> findByAssessmentId(Integer assessmentId);
}


