package com.Schoolai.WebModule.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Schoolai.WebModule.dto.AssignmentSummary;
import com.Schoolai.WebModule.dto.PerformanceSummary;
import com.Schoolai.WebModule.dto.StudentProgressResponse;
import com.Schoolai.WebModule.dto.SubjectInfo;
import com.Schoolai.WebModule.dto.VideoInfo;
import com.Schoolai.WebModule.service.StudentProgressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentProgressController {

	private final StudentProgressService studentProgressService;

	@GetMapping("/{studentId}/progress")
	public ResponseEntity<StudentProgressResponse> getProgress(@PathVariable Integer studentId) {
		StudentProgressResponse response = studentProgressService.getProgress(studentId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{studentId}/subjects")
	public ResponseEntity<List<SubjectInfo>> getSubjects(@PathVariable Integer studentId) {
		return ResponseEntity.ok(studentProgressService.getSubjects(studentId));
	}

	@GetMapping("/{studentId}/assignments")
	public ResponseEntity<List<AssignmentSummary>> getAssignments(@PathVariable Integer studentId) {
		return ResponseEntity.ok(studentProgressService.getAssignments(studentId));
	}

	@GetMapping("/{studentId}/performance")
	public ResponseEntity<List<PerformanceSummary>> getPerformance(@PathVariable Integer studentId) {
		return ResponseEntity.ok(studentProgressService.getPerformance(studentId));
	}

	@GetMapping("/{studentId}/videos")
	public ResponseEntity<List<VideoInfo>> getVideos(@PathVariable Integer studentId) {
		return ResponseEntity.ok(studentProgressService.getVideos(studentId));
	}
}


