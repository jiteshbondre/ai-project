package com.Schoolai.WebModule.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.Schoolai.WebModule.dto.AskQuestionRequest;
import com.Schoolai.WebModule.dto.AskQuestionResponse;
import com.Schoolai.WebModule.dto.VideoGenerationRequest;
import com.Schoolai.WebModule.dto.VideoGenerationResponse;
import com.Schoolai.WebModule.dto.AssignmentFeedbackResponse;
import com.Schoolai.WebModule.entity.ChatHistory;
import com.Schoolai.WebModule.entity.Subject;
import com.Schoolai.WebModule.entity.Teacher;
import com.Schoolai.WebModule.entity.Video;
import com.Schoolai.WebModule.entity.Assignment;
import com.Schoolai.WebModule.entity.AssignmentSubmission;
import com.Schoolai.WebModule.entity.Student;
import com.Schoolai.WebModule.repository.ChatHistoryRepository;
import com.Schoolai.WebModule.repository.SubjectRepository;
import com.Schoolai.WebModule.repository.TeacherRepository;
import com.Schoolai.WebModule.repository.VideoRepository;
import com.Schoolai.WebModule.repository.AssignmentRepository;
import com.Schoolai.WebModule.repository.AssignmentSubmissionRepository;
import com.Schoolai.WebModule.repository.StudentRepository;
import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiService {

	private final RestTemplate restTemplate = new RestTemplate();
	private final ChatHistoryRepository chatHistoryRepository;
	private final SubjectRepository subjectRepository;
	private final TeacherRepository teacherRepository;
	private final VideoRepository videoRepository;
	private final AssignmentRepository assignmentRepository;
	private final AssignmentSubmissionRepository assignmentSubmissionRepository;
	private final StudentRepository studentRepository;

	@Transactional
	public AskQuestionResponse askQuestion(AskQuestionRequest request) {
		String encoded = URLEncoder.encode(request.getQuestion(), StandardCharsets.UTF_8);
		String url = "http://chatbot/qution?" + encoded;
		String answer = "";
		try {
			ResponseEntity<String> resp = restTemplate.getForEntity(URI.create(url), String.class);
			answer = resp.getBody() != null ? resp.getBody() : "";
		} catch (RestClientException e) {
			answer = "Service unavailable";
		}

		ChatHistory chat = ChatHistory.builder()
				.senderId(request.getStudentId())
				.receiverId(request.getTeacherId())
				.message(request.getQuestion())
				.response(answer)
				.build();
		chatHistoryRepository.save(chat);
		return AskQuestionResponse.builder().answer(answer).build();
	}

	@Transactional
	public VideoGenerationResponse generateVideo(VideoGenerationRequest request) {
		String encoded = URLEncoder.encode(request.getTopicContext(), StandardCharsets.UTF_8);
		String url = "http://chatbot/vidoes?" + encoded;
		String videoUrl = null;
		try {
			ResponseEntity<String> resp = restTemplate.getForEntity(URI.create(url), String.class);
			videoUrl = resp.getBody();
		} catch (RestClientException e) {
			return VideoGenerationResponse.builder().message("Video service unavailable").build();
		}

		Subject subject = subjectRepository.findById(request.getSubjectId()).orElse(null);
		Teacher teacher = request.getTeacherId() != null ? teacherRepository.findById(request.getTeacherId()).orElse(null) : null;
		Video video = Video.builder()
				.title(request.getTitle() != null ? request.getTitle() : request.getTopicContext())
				.subject(subject)
				.url(videoUrl)
				.generatedBy(teacher)
				.videoType("AI_GENERATED")
				.build();
		video = videoRepository.save(video);
		return VideoGenerationResponse.builder().videoId(video.getId()).url(video.getUrl()).message("Video created").build();
	}

	@Transactional
	public AssignmentFeedbackResponse submitAssignment(byte[] imageBytes, String filename, Integer assignmentId, Integer studentId, Integer subjectId, String notes) {
		Assignment assignment = null;
		Student student = null;
		Subject subject = null;
		String aiFeedback = "";

		// Get assignment if provided
		if (assignmentId != null) {
			assignment = assignmentRepository.findById(assignmentId).orElse(null);
			if (assignment != null) {
				assignment.setSubmittedOn(LocalDateTime.now());
				assignmentRepository.save(assignment);
			}
		}

		// Get student if provided
		if (studentId != null) {
			student = studentRepository.findById(studentId).orElse(null);
		}

		// Get subject if provided
		if (subjectId != null) {
			subject = subjectRepository.findById(subjectId).orElse(null);
		}

		// Send to AI service for feedback
		String url = "http://chatbot/assigmnet";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);

		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		ByteArrayResource resource = new ByteArrayResource(imageBytes) {
			@Override
			public String getFilename() {
				return filename;
			}
		};
		body.add("file", resource);
		
		// Add submission details to the request if needed by the AI service
		if (assignmentId != null) {
			body.add("assignmentId", assignmentId);
		}
		if (studentId != null) {
			body.add("studentId", studentId);
		}
		if (subjectId != null) {
			body.add("subjectId", subjectId);
		}
		if (notes != null && !notes.isEmpty()) {
			body.add("notes", notes);
		}

		HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
		try {
			ResponseEntity<String> resp = restTemplate.postForEntity(URI.create(url), requestEntity, String.class);
			aiFeedback = resp.getBody() != null ? resp.getBody() : "";
		} catch (RestClientException e) {
			aiFeedback = "Assignment service unavailable";
		}

		// Store submission in database (even if assignment is null, for AI Teacher Assistant)
		if (student == null) {
			throw new IllegalArgumentException("Student not found with ID: " + studentId);
		}

		// Determine file type from filename
		String fileType = "application/octet-stream";
		if (filename != null) {
			String lowerFilename = filename.toLowerCase();
			if (lowerFilename.endsWith(".pdf")) {
				fileType = "application/pdf";
			} else if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
				fileType = "image/jpeg";
			} else if (lowerFilename.endsWith(".png")) {
				fileType = "image/png";
			} else if (lowerFilename.endsWith(".gif")) {
				fileType = "image/gif";
			}
		}

		AssignmentSubmission submission = AssignmentSubmission.builder()
				.assignment(assignment) // Can be null for AI Teacher Assistant submissions
				.student(student)
				.subject(subject) // Can be null
				.fileName(filename)
				.fileData(imageBytes) // Store file as BLOB
				.fileSize((long) imageBytes.length)
				.fileType(fileType)
				.notes(notes)
				.submittedAt(LocalDateTime.now())
				.aiFeedback(aiFeedback)
				.build();

		assignmentSubmissionRepository.save(submission);

		return AssignmentFeedbackResponse.builder().feedback(aiFeedback).build();
	}

	@Transactional
	public AssignmentFeedbackResponse submitAssignmentImage(byte[] imageBytes, String filename) {
		return submitAssignment(imageBytes, filename, null, null, null, null);
	}
}


