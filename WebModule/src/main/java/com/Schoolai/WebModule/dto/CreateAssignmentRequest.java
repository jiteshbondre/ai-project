package com.Schoolai.WebModule.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateAssignmentRequest {
	private Integer subjectId;
	private Integer teacherId;
	private String title;
	private LocalDate dueDate;
	private String description;
	private String type;
	private LocalDateTime submissionTime;
	private String instructions;
	private Integer maxMarks;
}


