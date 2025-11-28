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
public class LoginResponse {
	private boolean success;
	private String message;
	private String role;
	private Integer userId;
	private Integer schoolId;
	private String token;
}


