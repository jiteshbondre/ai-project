package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
	List<Notification> findByUserId(Integer userId);
	List<Notification> findByStatus(String status);
}


