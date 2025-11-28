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
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notification_id")
	private Integer id;

	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "message")
	private String message;

	@Column(name = "type", length = 50)
	private String type;

	@Column(name = "status", length = 20)
	private String status;

	@Column(name = "timestamp")
	private LocalDateTime timestamp;
}


