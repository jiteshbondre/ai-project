package com.Schoolai.WebModule.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSummary {
	private Integer assignmentId;
	private Integer subjectId;
	private String subjectName;
	private String title;
	private LocalDate dueDate;
	private boolean submitted;
}


