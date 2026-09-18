package com.byemypet.backend.member;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "members")
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 50)
	private String name;

	@Column(nullable = false, unique = true, length = 30)
	private String studentId;

	@Column(nullable = false, length = 128)
	private String passwordHash;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	protected Member() {
	}

	public Member(String name, String studentId, String passwordHash) {
		this.name = name;
		this.studentId = studentId;
		this.passwordHash = passwordHash;
	}

	@PrePersist
	void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getStudentId() {
		return studentId;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
