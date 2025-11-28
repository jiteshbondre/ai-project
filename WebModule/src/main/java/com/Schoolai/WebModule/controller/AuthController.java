package com.Schoolai.WebModule.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Schoolai.WebModule.dto.LoginRequest;
import com.Schoolai.WebModule.dto.LoginResponse;
import com.Schoolai.WebModule.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
		LoginResponse response = authService.login(request);
		if (response.isSuccess()) {
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.status(401).body(response);
	}
}


