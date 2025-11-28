package com.Schoolai.WebModule.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.ExtraActivity;

public interface ExtraActivityRepository extends JpaRepository<ExtraActivity, Integer> {
	List<ExtraActivity> findByStudentId(Integer studentId);
	List<ExtraActivity> findByDateBetween(LocalDate start, LocalDate end);
}


