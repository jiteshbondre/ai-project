package com.Schoolai.WebModule.dto;

import java.util.List;

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
public class StudentProgressResponse {
	private Integer studentId;
	private String studentName;
	private Integer schoolId;
	private String className;
	private Integer totalAssignments;
	private Integer totalSubmitted;
	private Integer totalPending;
	private Integer assessmentsTaken;
	private List<StudentSubjectProgress> subjects;
}


