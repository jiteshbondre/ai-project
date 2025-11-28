package com.Schoolai.WebModule.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Schoolai.WebModule.dto.BroadcastRequest;
import com.Schoolai.WebModule.entity.Notification;
import com.Schoolai.WebModule.repository.NotificationRepository;
import com.Schoolai.WebModule.repository.StudentRepository;
import com.Schoolai.WebModule.repository.TeacherRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BroadcastService {

	private final StudentRepository studentRepository;
	private final TeacherRepository teacherRepository;
	private final NotificationRepository notificationRepository;

	@Transactional
	public int broadcast(BroadcastRequest request) {
		List<Notification> notifications = new ArrayList<>();
		if (request.isToStudents()) {
			studentRepository.findBySchoolId(request.getSchoolId()).forEach(s -> {
				Notification n = Notification.builder()
						.userId(s.getId())
						.message(request.getMessage())
						.type(request.getType())
						.status("SENT")
						.build();
				notifications.add(n);
			});
		}
		if (request.isToTeachers()) {
			teacherRepository.findBySchoolId(request.getSchoolId()).forEach(t -> {
				Notification n = Notification.builder()
						.userId(t.getId())
						.message(request.getMessage())
						.type(request.getType())
						.status("SENT")
						.build();
				notifications.add(n);
			});
		}
		notificationRepository.saveAll(notifications);
		return notifications.size();
	}
}


