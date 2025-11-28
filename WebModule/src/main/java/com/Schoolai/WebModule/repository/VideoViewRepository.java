package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.VideoView;

public interface VideoViewRepository extends JpaRepository<VideoView, Integer> {
	List<VideoView> findByVideoId(Integer videoId);
	List<VideoView> findByStudentId(Integer studentId);
	long countByVideoId(Integer videoId);
}


