package com.Schoolai.WebModule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Schoolai.WebModule.entity.Timetable;

public interface TimetableRepository extends JpaRepository<Timetable, Integer> {
	List<Timetable> findByClassName(String className);
	List<Timetable> findByTeacherId(Integer teacherId);
	List<Timetable> findBySubjectId(Integer subjectId);
}


