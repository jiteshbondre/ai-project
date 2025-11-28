package com.Schoolai.WebModule.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Schoolai.WebModule.dto.AssignmentSummary;
import com.Schoolai.WebModule.dto.CreateAssignmentRequest;
import com.Schoolai.WebModule.dto.CreateTopicRequest;
import com.Schoolai.WebModule.dto.PerformanceSummary;
import com.Schoolai.WebModule.dto.VideoViewInfo;
import com.Schoolai.WebModule.dto.TeacherRegistrationRequest;
import com.Schoolai.WebModule.dto.TeacherResponse;
import com.Schoolai.WebModule.entity.Student;
import com.Schoolai.WebModule.service.TeacherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

	private final TeacherService teacherService;

	@PostMapping("/assignments")
	public ResponseEntity<Integer> createAssignment(@RequestBody CreateAssignmentRequest request) {
		Integer id = teacherService.addAssignment(request);
		return ResponseEntity.ok(id);
	}

	@PostMapping("/register")
	public ResponseEntity<TeacherResponse> registerTeacher(@RequestBody TeacherRegistrationRequest request) {
		return ResponseEntity.ok(teacherService.registerTeacher(request));
	}

	@PostMapping("/topics")
	public ResponseEntity<Integer> createTopic(@RequestBody CreateTopicRequest request) {
		Integer id = teacherService.addTopic(request);
		return ResponseEntity.ok(id);
	}

	@GetMapping("/{teacherId}/subjects/{subjectId}/assignments")
	public ResponseEntity<List<AssignmentSummary>> getAssignmentsBySubject(@PathVariable Integer teacherId, @PathVariable Integer subjectId) {
		return ResponseEntity.ok(teacherService.getAssignmentsBySubject(teacherId, subjectId));
	}

	@GetMapping("/subjects/{subjectId}/performance")
	public ResponseEntity<List<PerformanceSummary>> getPerformanceBySubject(@PathVariable Integer subjectId) {
		return ResponseEntity.ok(teacherService.getPerformanceBySubject(subjectId));
	}

	@GetMapping("/subjects/{subjectId}/video-views")
	public ResponseEntity<List<VideoViewInfo>> getVideoViewsBySubject(@PathVariable Integer subjectId) {
		return ResponseEntity.ok(teacherService.getVideoViewsBySubject(subjectId));
	}

	@GetMapping("/classes/{className}/students")
	public ResponseEntity<List<Student>> getClassStudents(@PathVariable String className) {
		return ResponseEntity.ok(teacherService.getClassStudents(className));
	}
}


