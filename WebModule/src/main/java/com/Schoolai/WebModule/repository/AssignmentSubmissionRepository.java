package com.Schoolai.WebModule.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.AssignmentSubmission;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Integer> {
	List<AssignmentSubmission> findByAssignmentId(Integer assignmentId);
	List<AssignmentSubmission> findByStudentId(Integer studentId);
	List<AssignmentSubmission> findByAssignmentIdAndStudentId(Integer assignmentId, Integer studentId);
	Optional<AssignmentSubmission> findFirstByAssignmentIdAndStudentIdOrderBySubmittedAtDesc(Integer assignmentId, Integer studentId);
}

