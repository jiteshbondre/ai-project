package com.Schoolai.WebModule.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
	List<Assignment> findBySubjectId(Integer subjectId);
	List<Assignment> findByAssignedById(Integer teacherId);
	List<Assignment> findByDueDateBetween(LocalDate start, LocalDate end);
	List<Assignment> findByType(String type);
}


