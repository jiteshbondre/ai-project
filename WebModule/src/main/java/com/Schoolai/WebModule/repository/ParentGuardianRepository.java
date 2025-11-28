package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.ParentGuardian;

public interface ParentGuardianRepository extends JpaRepository<ParentGuardian, Integer> {
	List<ParentGuardian> findByStudentId(Integer studentId);
}


