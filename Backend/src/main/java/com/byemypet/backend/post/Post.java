package com.byemypet.backend.post;

import java.time.LocalDateTime;

import com.byemypet.backend.member.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private ActivityType activityType;

	@Lob
	@Column(nullable = false)
	private String description;

	@Column(length = 500)
	private String imageUrl;

	@Column(length = 255)
	private String originalImageName;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "member_id", nullable = false)
	private Member author;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	protected Post() {
	}

	public Post(ActivityType activityType, String description, String imageUrl, String originalImageName, Member author) {
		this.activityType = activityType;
		this.description = description;
		this.imageUrl = imageUrl;
		this.originalImageName = originalImageName;
		this.author = author;
	}

	@PrePersist
	void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public ActivityType getActivityType() {
		return activityType;
	}

	public String getDescription() {
		return description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public String getOriginalImageName() {
		return originalImageName;
	}

	public Member getAuthor() {
		return author;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
