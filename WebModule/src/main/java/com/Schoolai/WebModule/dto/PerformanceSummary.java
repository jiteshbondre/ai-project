package com.Schoolai.WebModule.dto;

import java.math.BigDecimal;

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
public class PerformanceSummary {
	private Integer assessmentId;
	private Integer subjectId;
	private String subjectName;
	private String title;
	private BigDecimal marksObtained;
	private String grade;
}


