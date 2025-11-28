package com.Schoolai.WebModule.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AssignmentSubmissionRequest {
	private Integer assignmentId;
	private Integer studentId;
	private Integer subjectId;
	private String notes;
}

