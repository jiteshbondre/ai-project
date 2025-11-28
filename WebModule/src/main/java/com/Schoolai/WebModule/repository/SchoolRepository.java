package com.Schoolai.WebModule.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.School;

public interface SchoolRepository extends JpaRepository<School, Integer> {
	Optional<School> findBySchoolName(String schoolName);
}


