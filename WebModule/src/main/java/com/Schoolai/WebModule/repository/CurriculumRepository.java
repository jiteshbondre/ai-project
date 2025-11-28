package com.Schoolai.WebModule.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Curriculum;
import com.Schoolai.WebModule.entity.School;

public interface CurriculumRepository extends JpaRepository<Curriculum, Integer> {
	List<Curriculum> findBySchool(School school);
	List<Curriculum> findBySchoolId(Integer schoolId);
	Optional<Curriculum> findByIdAndSchoolId(Integer id, Integer schoolId);
}


