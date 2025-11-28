package com.Schoolai.WebModule.dto;

import java.math.BigDecimal;
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
public class StudentSubjectProgress {
	private Integer subjectId;
	private String subjectName;
	private String className;
	private Integer totalAssignments;
	private Integer submittedAssignments;
	private Integer pendingAssignments;
	private Integer assessmentsCount;
	private BigDecimal averageMarks;
	private String lastGrade;
	private Integer videosCount;
	private List<String> videoTitles;
}


