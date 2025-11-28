package com.Schoolai.WebModule.dto;

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
public class VideoInfo {
	private Integer videoId;
	private Integer subjectId;
	private String subjectName;
	private String title;
	private String url;
	private String videoType;
}


