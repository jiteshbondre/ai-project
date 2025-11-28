package com.Schoolai.WebModule.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Topic;

public interface TopicRepository extends JpaRepository<Topic, Integer> {
	List<Topic> findByTeacherId(Integer teacherId);
	List<Topic> findByClassName(String className);
	List<Topic> findBySubjectId(Integer subjectId);
	List<Topic> findByTeacherIdAndDate(Integer teacherId, LocalDate date);
}


