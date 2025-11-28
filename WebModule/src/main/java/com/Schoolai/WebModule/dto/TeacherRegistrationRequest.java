package com.Schoolai.WebModule.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TeacherRegistrationRequest {
	private Integer schoolId;
	private String fullName;
	private Integer subjectId; // optional
	private String email;
	private String password;
	private String contactNo;
	private LocalDate dob;
	private String qualification;
	private Integer experienceYears;
	private String designation;
}


