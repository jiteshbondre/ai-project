package com.Schoolai.WebModule.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Schoolai.WebModule.dto.AssignmentSummary;
import com.Schoolai.WebModule.dto.PerformanceSummary;
import com.Schoolai.WebModule.dto.StudentProgressResponse;
import com.Schoolai.WebModule.dto.StudentSubjectProgress;
import com.Schoolai.WebModule.dto.SubjectInfo;
import com.Schoolai.WebModule.dto.VideoInfo;
import com.Schoolai.WebModule.entity.Assignment;
import com.Schoolai.WebModule.entity.Performance;
import com.Schoolai.WebModule.entity.Student;
import com.Schoolai.WebModule.entity.Subject;
import com.Schoolai.WebModule.entity.Video;
import com.Schoolai.WebModule.repository.AssessmentRepository;
import com.Schoolai.WebModule.repository.AssignmentRepository;
import com.Schoolai.WebModule.repository.PerformanceRepository;
import com.Schoolai.WebModule.repository.StudentRepository;
import com.Schoolai.WebModule.repository.SubjectRepository;
import com.Schoolai.WebModule.repository.VideoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentProgressService {

	private final StudentRepository studentRepository;
	private final SubjectRepository subjectRepository;
	private final AssignmentRepository assignmentRepository;
	private final AssessmentRepository assessmentRepository;
	private final PerformanceRepository performanceRepository;
	private final VideoRepository videoRepository;

	@Transactional(readOnly = true)
	public StudentProgressResponse getProgress(Integer studentId) {
		Student student = studentRepository.findById(studentId).orElse(null);
		if (student == null) {
			return StudentProgressResponse.builder().studentId(studentId).studentName(null).className(null).subjects(List.of()).build();
		}

		String className = student.getClassName();
		List<Subject> subjects = new ArrayList<>();
		if (student.getCurriculum() != null) {
			subjects = subjectRepository.findByClassNameAndCurriculumId(className, student.getCurriculum().getId());
		} else {
			subjects = subjectRepository.findByClassName(className);
		}

		int totalAssignments = 0;
		int totalSubmitted = 0;
		int totalPending = 0;
		int assessmentsTaken = 0;

		List<StudentSubjectProgress> perSubject = new ArrayList<>();
		for (Subject subject : subjects) {
			List<Assignment> subjectAssignments = assignmentRepository.findBySubjectId(subject.getId());
			int subjectTotal = subjectAssignments.size();
			int subjectSubmitted = (int) subjectAssignments.stream().filter(a -> a.getSubmittedOn() != null).count();
			int subjectPending = subjectTotal - subjectSubmitted;

			totalAssignments += subjectTotal;
			totalSubmitted += subjectSubmitted;
			totalPending += subjectPending;

			int subjectAssessments = assessmentRepository.findBySubjectId(subject.getId()).size();
			assessmentsTaken += subjectAssessments;

			List<Performance> perf = performanceRepository.findByStudentId(studentId).stream()
					.filter(p -> p.getAssessment() != null && p.getAssessment().getSubject() != null && p.getAssessment().getSubject().getId().equals(subject.getId()))
					.collect(Collectors.toList());
			BigDecimal avg = perf.isEmpty() ? BigDecimal.ZERO : BigDecimal.valueOf(perf.stream()
					.map(p -> p.getMarksObtained() != null ? p.getMarksObtained().doubleValue() : 0.0)
					.mapToDouble(Double::doubleValue)
					.average().orElse(0.0)).setScale(2, RoundingMode.HALF_UP);
			String lastGrade = perf.isEmpty() ? null : perf.get(perf.size() - 1).getGrade();

			List<Video> videos = videoRepository.findBySubjectId(subject.getId());
			StudentSubjectProgress ssp = StudentSubjectProgress.builder()
					.subjectId(subject.getId())
					.subjectName(subject.getSubjectName())
					.className(subject.getClassName())
					.totalAssignments(subjectTotal)
					.submittedAssignments(subjectSubmitted)
					.pendingAssignments(subjectPending)
					.assessmentsCount(subjectAssessments)
					.averageMarks(avg)
					.lastGrade(lastGrade)
					.videosCount(videos.size())
					.videoTitles(videos.stream().map(Video::getTitle).collect(Collectors.toList()))
					.build();
			perSubject.add(ssp);
		}

		return StudentProgressResponse.builder()
					.studentId(student.getId())
					.studentName(student.getFullName())
					.schoolId(student.getSchool() != null ? student.getSchool().getId() : null)
					.className(className)
					.totalAssignments(totalAssignments)
					.totalSubmitted(totalSubmitted)
					.totalPending(totalPending)
					.assessmentsTaken(assessmentsTaken)
					.subjects(perSubject)
					.build();
	}

	@Transactional(readOnly = true)
	public List<SubjectInfo> getSubjects(Integer studentId) {
		Student student = studentRepository.findById(studentId).orElse(null);
		if (student == null) return List.of();
		String className = student.getClassName();
		List<Subject> subjects;
		if (student.getCurriculum() != null) {
			subjects = subjectRepository.findByClassNameAndCurriculumId(className, student.getCurriculum().getId());
		} else {
			subjects = subjectRepository.findByClassName(className);
		}
		return subjects.stream().map(s -> SubjectInfo.builder()
				.subjectId(s.getId())
				.subjectName(s.getSubjectName())
				.className(s.getClassName())
				.build()).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<AssignmentSummary> getAssignments(Integer studentId) {
		Student student = studentRepository.findById(studentId).orElse(null);
		if (student == null) return List.of();
		List<SubjectInfo> subjects = getSubjects(studentId);
		List<AssignmentSummary> result = new ArrayList<>();
		for (SubjectInfo s : subjects) {
			List<Assignment> assignments = assignmentRepository.findBySubjectId(s.getSubjectId());
			for (Assignment a : assignments) {
				result.add(AssignmentSummary.builder()
						.assignmentId(a.getId())
						.subjectId(s.getSubjectId())
						.subjectName(s.getSubjectName())
						.title(a.getTitle())
						.dueDate(a.getDueDate())
						.submitted(a.getSubmittedOn() != null)
						.build());
			}
		}
		return result;
	}

	@Transactional(readOnly = true)
	public List<PerformanceSummary> getPerformance(Integer studentId) {
		Student student = studentRepository.findById(studentId).orElse(null);
		if (student == null) return List.of();
		List<Performance> perf = performanceRepository.findByStudentId(studentId);
		return perf.stream().map(p -> PerformanceSummary.builder()
				.assessmentId(p.getAssessment() != null ? p.getAssessment().getId() : null)
				.subjectId(p.getAssessment() != null && p.getAssessment().getSubject() != null ? p.getAssessment().getSubject().getId() : null)
				.subjectName(p.getAssessment() != null && p.getAssessment().getSubject() != null ? p.getAssessment().getSubject().getSubjectName() : null)
				.title(p.getAssessment() != null ? p.getAssessment().getTitle() : null)
				.marksObtained(p.getMarksObtained())
				.grade(p.getGrade())
				.build()).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<VideoInfo> getVideos(Integer studentId) {
		Student student = studentRepository.findById(studentId).orElse(null);
		if (student == null) return List.of();
		List<SubjectInfo> subjects = getSubjects(studentId);
		List<VideoInfo> result = new ArrayList<>();
		for (SubjectInfo s : subjects) {
			List<Video> videos = videoRepository.findBySubjectId(s.getSubjectId());
			for (Video v : videos) {
				result.add(VideoInfo.builder()
						.videoId(v.getId())
						.subjectId(s.getSubjectId())
						.subjectName(s.getSubjectName())
						.title(v.getTitle())
						.url(v.getUrl())
						.videoType(v.getVideoType())
						.build());
			}
		}
		return result;
	}
}


