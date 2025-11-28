package com.Schoolai.WebModule.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoViewInfo {
	private Integer videoId;
	private Integer studentId;
	private String studentName;
	private LocalDateTime viewedAt;
}


