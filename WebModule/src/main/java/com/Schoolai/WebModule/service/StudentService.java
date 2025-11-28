package com.Schoolai.WebModule.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Schoolai.WebModule.dto.StudentRegistrationRequest;
import com.Schoolai.WebModule.dto.StudentResponse;
import com.Schoolai.WebModule.entity.Curriculum;
import com.Schoolai.WebModule.entity.School;
import com.Schoolai.WebModule.entity.Student;
import com.Schoolai.WebModule.repository.CurriculumRepository;
import com.Schoolai.WebModule.repository.SchoolRepository;
import com.Schoolai.WebModule.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

	private final SchoolRepository schoolRepository;
	private final CurriculumRepository curriculumRepository;
	private final StudentRepository studentRepository;

	@Transactional
	public StudentResponse register(StudentRegistrationRequest request) {
		Optional<School> schoolOpt = schoolRepository.findBySchoolName(request.getSchoolName());
		if (schoolOpt.isEmpty()) {
			return StudentResponse.builder().message("Invalid school name").build();
		}
		School school = schoolOpt.get();

		if (request.getEmail() != null && studentRepository.findByEmail(request.getEmail()).isPresent()) {
			return StudentResponse.builder().message("Email already registered").build();
		}

		Curriculum curriculum = null;
		if (request.getCurriculumId() != null) {
			curriculum = curriculumRepository.findByIdAndSchoolId(request.getCurriculumId(), school.getId())
					.orElse(null);
		}

		Student student = Student.builder()
					.fullName(request.getFullName())
					.className(request.getClassName())
					.school(school)
					.password(request.getPassword())
					.medium(request.getMedium())
					.email(request.getEmail())
					.contactNo(request.getContactNo())
					.dob(request.getDob())
					.gender(request.getGender())
					.address(request.getAddress())
					.admissionDate(request.getAdmissionDate())
					.curriculum(curriculum)
					.build();

		student = studentRepository.save(student);
		return StudentResponse.builder()
					.studentId(student.getId())
					.schoolId(school.getId())
					.curriculumId(curriculum != null ? curriculum.getId() : null)
					.message("Student registered successfully")
					.build();
	}
}


