package com.Schoolai.WebModule.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
	private String schoolName;
	private String username; // email for both student and teacher or manager/principal
	private String password;
	private String role; // STUDENT, TEACHER, PRINCIPAL, MANAGER
}


