package com.Schoolai.WebModule.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Schoolai.WebModule.dto.StudentRegistrationRequest;
import com.Schoolai.WebModule.dto.StudentResponse;
import com.Schoolai.WebModule.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

	private final StudentService studentService;

	@PostMapping("/register")
	public ResponseEntity<StudentResponse> register(@RequestBody StudentRegistrationRequest request) {
		StudentResponse response = studentService.register(request);
		if (response.getStudentId() != null) {
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.badRequest().body(response);
	}
}


