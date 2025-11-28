package com.Schoolai.WebModule.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "assignment_submission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmission {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "submission_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assignment_id", nullable = true)
	private Assignment assignment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private Student student;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subject_id", nullable = true)
	private Subject subject;

	@Column(name = "file_name", length = 255)
	private String fileName;

	@Column(name = "file_path", length = 500)
	private String filePath;

	@Lob
	@Column(name = "file_data", columnDefinition = "BYTEA")
	private byte[] fileData;

	@Column(name = "file_size")
	private Long fileSize;

	@Column(name = "file_type", length = 100)
	private String fileType;

	@Column(name = "notes", columnDefinition = "TEXT")
	private String notes;

	@Column(name = "submitted_at")
	private LocalDateTime submittedAt;

	@Column(name = "ai_feedback", columnDefinition = "TEXT")
	private String aiFeedback;
}
