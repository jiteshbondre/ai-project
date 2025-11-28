package com.Schoolai.WebModule.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chat_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "chat_id")
	private Integer id;

	@Column(name = "sender_id")
	private Integer senderId;

	@Column(name = "receiver_id")
	private Integer receiverId;

	@Column(name = "message")
	private String message;

	@Column(name = "timestamp")
	private LocalDateTime timestamp;

	@Column(name = "response")
	private String response;
}


