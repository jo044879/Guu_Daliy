package com.byemypet.backend.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberCreateRequest(
		@NotBlank @Size(max = 50) String name,
		@NotBlank @Size(max = 30) String studentId,
		@NotBlank @Size(min = 4, max = 100) String password
) {
}
