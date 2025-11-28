package com.Schoolai.WebModule.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Schoolai.WebModule.dto.AssignmentSummary;
import com.Schoolai.WebModule.dto.CreateAssignmentRequest;
import com.Schoolai.WebModule.dto.CreateTopicRequest;
import com.Schoolai.WebModule.dto.PerformanceSummary;
import com.Schoolai.WebModule.dto.SubjectInfo;
import com.Schoolai.WebModule.dto.VideoInfo;
import com.Schoolai.WebModule.dto.TeacherRegistrationRequest;
import com.Schoolai.WebModule.dto.TeacherResponse;
import com.Schoolai.WebModule.dto.VideoViewInfo;
import com.Schoolai.WebModule.entity.Assignment;
import com.Schoolai.WebModule.entity.Performance;
import com.Schoolai.WebModule.entity.Assessment;
import com.Schoolai.WebModule.entity.Student;
import com.Schoolai.WebModule.entity.Subject;
import com.Schoolai.WebModule.entity.Teacher;
import com.Schoolai.WebModule.entity.Topic;
import com.Schoolai.WebModule.entity.School;
import com.Schoolai.WebModule.entity.Video;
import com.Schoolai.WebModule.entity.VideoView;
import com.Schoolai.WebModule.repository.AssessmentRepository;
import com.Schoolai.WebModule.repository.AssignmentRepository;
import com.Schoolai.WebModule.repository.PerformanceRepository;
import com.Schoolai.WebModule.repository.StudentRepository;
import com.Schoolai.WebModule.repository.SubjectRepository;
import com.Schoolai.WebModule.repository.TeacherRepository;
import com.Schoolai.WebModule.repository.SchoolRepository;
import com.Schoolai.WebModule.repository.TopicRepository;
import com.Schoolai.WebModule.repository.VideoRepository;
import com.Schoolai.WebModule.repository.VideoViewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherService {

	private final TeacherRepository teacherRepository;
	private final SubjectRepository subjectRepository;
	private final StudentRepository studentRepository;
	private final AssignmentRepository assignmentRepository;
	private final PerformanceRepository performanceRepository;
	private final AssessmentRepository assessmentRepository;
	private final VideoRepository videoRepository;
	private final VideoViewRepository videoViewRepository;
	private final TopicRepository topicRepository;
	private final SchoolRepository schoolRepository;

	@Transactional
	public Integer addAssignment(CreateAssignmentRequest request) {
		Subject subject = subjectRepository.findById(request.getSubjectId()).orElseThrow();
		Teacher teacher = teacherRepository.findById(request.getTeacherId()).orElseThrow();
		Assignment a = Assignment.builder()
				.subject(subject)
				.title(request.getTitle())
				.dueDate(request.getDueDate())
				.description(request.getDescription())
				.assignedBy(teacher)
				.type(request.getType())
				.submissionTime(request.getSubmissionTime())
				.instructions(request.getInstructions())
				.maxMarks(request.getMaxMarks())
				.build();
		a = assignmentRepository.save(a);
		return a.getId();
	}

	@Transactional
	public Integer addTopic(CreateTopicRequest request) {
		Subject subject = subjectRepository.findById(request.getSubjectId()).orElseThrow();
		Teacher teacher = teacherRepository.findById(request.getTeacherId()).orElseThrow();
		Topic topic = Topic.builder()
				.className(request.getClassName())
				.subject(subject)
				.teacher(teacher)
				.date(request.getDate())
				.title(request.getTitle())
				.description(request.getDescription())
				.build();
		topic = topicRepository.save(topic);
		return topic.getId();
	}

	@Transactional(readOnly = true)
	public List<AssignmentSummary> getAssignmentsBySubject(Integer teacherId, Integer subjectId) {
		Teacher teacher = teacherRepository.findById(teacherId).orElseThrow();
		List<Assignment> assignments = assignmentRepository.findBySubjectId(subjectId);
		return assignments.stream().filter(a -> a.getAssignedBy() != null && a.getAssignedBy().getId().equals(teacher.getId()))
				.map(a -> AssignmentSummary.builder()
						.assignmentId(a.getId())
						.subjectId(subjectId)
						.subjectName(a.getSubject() != null ? a.getSubject().getSubjectName() : null)
						.title(a.getTitle())
						.dueDate(a.getDueDate())
						.submitted(a.getSubmittedOn() != null)
						.build())
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<PerformanceSummary> getPerformanceBySubject(Integer subjectId) {
		List<Assessment> assessments = assessmentRepository.findBySubjectId(subjectId);
		List<Integer> assessmentIds = assessments.stream().map(Assessment::getId).collect(Collectors.toList());
		List<Performance> perf = assessmentIds.isEmpty() ? List.of() : performanceRepository.findAll().stream()
				.filter(p -> p.getAssessment() != null && assessmentIds.contains(p.getAssessment().getId()))
				.collect(Collectors.toList());
		return perf.stream().map(p -> PerformanceSummary.builder()
				.assessmentId(p.getAssessment() != null ? p.getAssessment().getId() : null)
				.subjectId(subjectId)
				.subjectName(p.getAssessment() != null && p.getAssessment().getSubject() != null ? p.getAssessment().getSubject().getSubjectName() : null)
				.title(p.getAssessment() != null ? p.getAssessment().getTitle() : null)
				.marksObtained(p.getMarksObtained())
				.grade(p.getGrade())
				.build()).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<VideoViewInfo> getVideoViewsBySubject(Integer subjectId) {
		List<Video> videos = videoRepository.findBySubjectId(subjectId);
		return videos.stream()
				.flatMap(v -> videoViewRepository.findByVideoId(v.getId()).stream()
						.map(vv -> VideoViewInfo.builder()
								.videoId(v.getId())
								.studentId(vv.getStudent() != null ? vv.getStudent().getId() : null)
								.studentName(vv.getStudent() != null ? vv.getStudent().getFullName() : null)
								.viewedAt(vv.getViewedAt())
								.build()))
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<Student> getClassStudents(String className) {
		return studentRepository.findByClassName(className);
	}

	@Transactional
	public TeacherResponse registerTeacher(TeacherRegistrationRequest request) {
		School school = schoolRepository.findById(request.getSchoolId()).orElse(null);
		if (school == null) {
			return TeacherResponse.builder().message("Invalid school").build();
		}
		Teacher teacher = Teacher.builder()
				.fullName(request.getFullName())
				.email(request.getEmail())
				.password(request.getPassword())
				.contactNo(request.getContactNo())
				.dob(request.getDob())
				.qualification(request.getQualification())
				.experienceYears(request.getExperienceYears())
				.designation(request.getDesignation())
				.school(school)
				.build();
		if (request.getSubjectId() != null) {
			teacher.setSubject(subjectRepository.findById(request.getSubjectId()).orElse(null));
		}
		teacher = teacherRepository.save(teacher);
		return TeacherResponse.builder().teacherId(teacher.getId()).schoolId(school.getId()).message("Teacher registered")
				.build();
	}
}


