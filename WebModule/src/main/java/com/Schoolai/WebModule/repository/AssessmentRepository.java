package com.Schoolai.WebModule.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {
	List<Assessment> findBySubjectId(Integer subjectId);
	List<Assessment> findByAssignedById(Integer teacherId);
	List<Assessment> findByDueDateBetween(LocalDate start, LocalDate end);
}


