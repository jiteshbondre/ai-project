package com.Schoolai.WebModule.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BroadcastRequest {
	private Integer schoolId;
	private String message;
	private boolean toStudents;
	private boolean toTeachers;
	private String type; // e.g., INFO, ALERT
}


