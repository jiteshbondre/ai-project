package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Integer> {
	List<Subject> findByCurriculumId(Integer curriculumId);
	List<Subject> findByClassNameAndCurriculumId(String className, Integer curriculumId);
	List<Subject> findByClassName(String className);
}


