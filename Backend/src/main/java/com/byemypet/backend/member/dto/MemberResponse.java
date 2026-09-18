package com.byemypet.backend.member.dto;

import java.time.LocalDateTime;

import com.byemypet.backend.member.Member;

public record MemberResponse(
		Long id,
		String name,
		String studentId,
		LocalDateTime createdAt
) {
	public static MemberResponse from(Member member) {
		return new MemberResponse(
				member.getId(),
				member.getName(),
				member.getStudentId(),
				member.getCreatedAt()
		);
	}
}
