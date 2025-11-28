package com.Schoolai.WebModule.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AskQuestionRequest {
	private Integer studentId;
	private String question;
	private Integer teacherId; // optional
	private Integer subjectId; // optional
}


