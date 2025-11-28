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
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "student_id")
	private Integer id;

	@Column(name = "full_name", length = 100)
	private String fullName;

	@Column(name = "class", nullable = false, length = 50)
	private String className;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "school_id")
	private School school;

	@Column(name = "password", nullable = false, length = 255)
	private String password;

	@Column(name = "medium", length = 50)
	private String medium;

	@Column(name = "email", unique = true, length = 100)
	private String email;

	@Column(name = "contact_no", length = 20)
	private String contactNo;

	@Column(name = "dob")
	private LocalDate dob;

	@Column(name = "gender", length = 10)
	private String gender;

	@Column(name = "address")
	private String address;

	@Column(name = "admission_date")
	private LocalDate admissionDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "curriculum_id")
	private Curriculum curriculum;
}


