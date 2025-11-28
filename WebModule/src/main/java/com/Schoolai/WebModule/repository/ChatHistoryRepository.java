package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.ChatHistory;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Integer> {
	List<ChatHistory> findBySenderId(Integer senderId);
	List<ChatHistory> findByReceiverId(Integer receiverId);
}


