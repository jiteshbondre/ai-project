package com.Schoolai.WebModule.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {
	Optional<Student> findByEmail(String email);
	List<Student> findBySchoolId(Integer schoolId);
	List<Student> findByClassNameAndSchoolId(String className, Integer schoolId);
	Optional<Student> findByEmailAndPassword(String email, String password);
	List<Student> findByClassName(String className);
}


