package com.Schoolai.WebModule.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StudentRegistrationRequest {
	private String schoolName;
	private String fullName;
	private String className;
	private String password;
	private String medium;
	private String email;
	private String contactNo;
	private LocalDate dob;
	private String gender;
	private String address;
	private LocalDate admissionDate;
	private Integer curriculumId; // optional
}


