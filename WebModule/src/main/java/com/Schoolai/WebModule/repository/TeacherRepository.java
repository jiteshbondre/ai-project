package com.Schoolai.WebModule.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
	Optional<Teacher> findByEmail(String email);
	List<Teacher> findBySubjectId(Integer subjectId);
	Optional<Teacher> findByEmailAndPassword(String email, String password);
	List<Teacher> findBySchoolId(Integer schoolId);
}


