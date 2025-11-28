package com.Schoolai.WebModule.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
	List<Payment> findByStudentId(Integer studentId);
	List<Payment> findByStatus(String status);
	List<Payment> findByDueDateBefore(LocalDate dueDate);
}


