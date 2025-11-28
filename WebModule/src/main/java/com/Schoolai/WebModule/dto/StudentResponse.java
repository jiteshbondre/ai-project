package com.Schoolai.WebModule.dto;

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
public class StudentResponse {
	private Integer studentId;
	private Integer schoolId;
	private Integer curriculumId;
	private String message;
}


