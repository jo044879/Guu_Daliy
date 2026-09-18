package com.byemypet.backend.member;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.byemypet.backend.member.dto.LoginRequest;
import com.byemypet.backend.member.dto.MemberCreateRequest;
import com.byemypet.backend.member.dto.MemberResponse;

import jakarta.validation.Valid;

@RestController
public class MemberController {

	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	@PostMapping("/members")
	@ResponseStatus(HttpStatus.CREATED)
	public MemberResponse create(@Valid @RequestBody MemberCreateRequest request) {
		return memberService.create(request);
	}

	@GetMapping("/members")
	public List<MemberResponse> findAll() {
		return memberService.findAll();
	}

	@PostMapping("/login")
	public MemberResponse login(@Valid @RequestBody LoginRequest request) {
		return memberService.login(request);
	}
}
