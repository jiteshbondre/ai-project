package com.Schoolai.WebModule.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VideoGenerationRequest {
	private Integer subjectId;
	private Integer studentId; // who requested
	private Integer teacherId; // optional
	private String topicContext;
	private String title;
}


