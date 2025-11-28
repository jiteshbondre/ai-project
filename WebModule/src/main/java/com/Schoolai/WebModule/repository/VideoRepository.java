package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Video;

public interface VideoRepository extends JpaRepository<Video, Integer> {
	List<Video> findBySubjectId(Integer subjectId);
	List<Video> findByGeneratedById(Integer teacherId);
}


