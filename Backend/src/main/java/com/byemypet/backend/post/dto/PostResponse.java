package com.byemypet.backend.post.dto;

import java.time.LocalDateTime;

import com.byemypet.backend.post.Post;

public record PostResponse(
		Long id,
		String activityType,
		String description,
		String imageUrl,
		String originalImageName,
		String authorName,
		String studentId,
		LocalDateTime createdAt
) {
	public static PostResponse from(Post post) {
		return new PostResponse(
				post.getId(),
				post.getActivityType().name(),
				post.getDescription(),
				post.getImageUrl(),
				post.getOriginalImageName(),
				post.getAuthor().getName(),
				post.getAuthor().getStudentId(),
				post.getCreatedAt()
		);
	}
}
