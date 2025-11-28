package com.Schoolai.WebModule.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "teacher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "teacher_id")
	private Integer id;

	@Column(name = "full_name", nullable = false, length = 100)
	private String fullName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subject_id")
	private Subject subject;

	@Column(name = "email", unique = true, length = 100)
	private String email;

	@Column(name = "password", length = 255)
	private String password;

	@Column(name = "contact_no", length = 20)
	private String contactNo;

	@Column(name = "dob")
	private LocalDate dob;

	@Column(name = "qualification", length = 100)
	private String qualification;

	@Column(name = "experience_years")
	private Integer experienceYears;

	@Column(name = "designation", length = 50)
	private String designation;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "school_id")
	private School school;
}


