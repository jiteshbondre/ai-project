package com.Schoolai.WebModule.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Schoolai.WebModule.dto.AskQuestionRequest;
import com.Schoolai.WebModule.dto.AskQuestionResponse;
import com.Schoolai.WebModule.dto.VideoGenerationRequest;
import com.Schoolai.WebModule.dto.VideoGenerationResponse;
import com.Schoolai.WebModule.dto.AssignmentFeedbackResponse;
import com.Schoolai.WebModule.dto.AssignmentSubmissionRequest;
import com.Schoolai.WebModule.service.AiService;

import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

	private final AiService aiService;
	private final ObjectMapper objectMapper;

	@PostMapping("/ask")
	public ResponseEntity<AskQuestionResponse> ask(@RequestBody AskQuestionRequest request) {
		return ResponseEntity.ok(aiService.askQuestion(request));
	}

	@PostMapping("/videos")
	public ResponseEntity<VideoGenerationResponse> generateVideo(@RequestBody VideoGenerationRequest request) {
		return ResponseEntity.ok(aiService.generateVideo(request));
	}

	@PostMapping(value = "/assignments/submit", consumes = { "multipart/form-data" })
	public ResponseEntity<?> submitAssignment(
			@RequestPart("file") MultipartFile file,
			@RequestPart("details") String detailsJson) {
		try {
			if (file == null || file.isEmpty()) {
				return ResponseEntity.badRequest().body("File is required");
			}

			AssignmentSubmissionRequest details;
			try {
				details = objectMapper.readValue(detailsJson, AssignmentSubmissionRequest.class);
			} catch (Exception e) {
				return ResponseEntity.badRequest().body("Invalid details JSON: " + e.getMessage());
			}

			if (details.getStudentId() == null) {
				return ResponseEntity.badRequest().body("Student ID is required");
			}

			AssignmentFeedbackResponse response = aiService.submitAssignment(
					file.getBytes(), 
					file.getOriginalFilename(),
					details.getAssignmentId(),
					details.getStudentId(),
					details.getSubjectId(),
					details.getNotes()
			);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error processing submission: " + e.getMessage());
		}
	}
}


