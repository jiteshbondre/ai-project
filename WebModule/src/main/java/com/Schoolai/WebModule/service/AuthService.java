package com.Schoolai.WebModule.service;

import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Schoolai.WebModule.dto.LoginRequest;
import com.Schoolai.WebModule.dto.LoginResponse;
import com.Schoolai.WebModule.entity.School;
import com.Schoolai.WebModule.entity.Student;
import com.Schoolai.WebModule.entity.Teacher;
import com.Schoolai.WebModule.repository.SchoolRepository;
import com.Schoolai.WebModule.repository.StudentRepository;
import com.Schoolai.WebModule.repository.TeacherRepository;
import com.Schoolai.WebModule.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final SchoolRepository schoolRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		String role = normalize(request.getRole());
		Optional<School> schoolOpt = schoolRepository.findBySchoolName(request.getSchoolName());
		if (schoolOpt.isEmpty()) {
			return LoginResponse.builder()
					.success(false)
					.message("Invalid school name")
					.build();
		}
		School school = schoolOpt.get();

		switch (role) {
			case "STUDENT":
				return loginStudent(school, request);
			case "TEACHER":
				return loginTeacher(school, request, "TEACHER");
			case "PRINCIPAL":
				return loginTeacher(school, request, "PRINCIPAL");
			case "MANAGER":
				return loginTeacher(school, request, "MANAGER");
			default:
				return LoginResponse.builder().success(false).message("Unsupported role").build();
		}
	}

	private LoginResponse loginStudent(School school, LoginRequest request) {
		return studentRepository.findByEmail(request.getUsername())
				.filter(student -> {
					// Verify password using PasswordEncoder
					if (student.getPassword() == null || !passwordEncoder.matches(request.getPassword(), student.getPassword())) {
						return false;
					}
					// Verify school match
					if (student.getSchool() == null || !school.getId().equals(student.getSchool().getId())) {
						return false;
					}
					return true;
				})
				.map(student -> {
					String token = jwtService.generateToken(student.getEmail(), java.util.Map.of(
							"role", "STUDENT",
							"userId", student.getId(),
							"schoolId", school.getId()
					));
					return LoginResponse.builder()
							.success(true)
							.message("Login successful")
							.role("STUDENT")
							.userId(student.getId())
							.schoolId(school.getId())
							.token(token)
							.build();
				})
				.orElse(LoginResponse.builder().success(false).message("Invalid credentials").build());
	}

	private LoginResponse loginTeacher(School school, LoginRequest request, String mappedRole) {
		return teacherRepository.findByEmail(request.getUsername())
				.filter(teacher -> {
					// Verify password using PasswordEncoder
					if (teacher.getPassword() == null || !passwordEncoder.matches(request.getPassword(), teacher.getPassword())) {
						return false;
					}
					// Verify school match
					if (teacher.getSchool() == null || !school.getId().equals(teacher.getSchool().getId())) {
						return false;
					}
					return true;
				})
				.map(teacher -> {
					String token = jwtService.generateToken(teacher.getEmail(), java.util.Map.of(
							"role", mappedRole,
							"userId", teacher.getId(),
							"schoolId", school.getId()
					));
					return LoginResponse.builder()
							.success(true)
							.message("Login successful")
							.role(mappedRole)
							.userId(teacher.getId())
							.schoolId(school.getId())
							.token(token)
							.build();
				})
				.orElse(LoginResponse.builder().success(false).message("Invalid credentials").build());
	}

	private String normalize(String role) {
		if (role == null) return "";
		return role.trim().toUpperCase(Locale.ROOT);
	}
}


