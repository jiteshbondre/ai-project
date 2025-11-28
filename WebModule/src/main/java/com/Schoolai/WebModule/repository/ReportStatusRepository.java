package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.ReportStatus;

public interface ReportStatusRepository extends JpaRepository<ReportStatus, Integer> {
	List<ReportStatus> findByStudentId(Integer studentId);
}


