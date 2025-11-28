package com.Schoolai.WebModule.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateTopicRequest {
	private Integer subjectId;
	private Integer teacherId;
	private String className;
	private LocalDate date;
	private String title;
	private String description;
}


