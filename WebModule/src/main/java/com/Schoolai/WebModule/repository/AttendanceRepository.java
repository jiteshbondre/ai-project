package com.Schoolai.WebModule.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
	List<Attendance> findByStudentId(Integer studentId);
	List<Attendance> findByStudentIdAndDateBetween(Integer studentId, LocalDate start, LocalDate end);
}


