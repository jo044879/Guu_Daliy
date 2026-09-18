package com.byemypet.backend.member;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.byemypet.backend.common.ConflictException;
import com.byemypet.backend.common.UnauthorizedException;
import com.byemypet.backend.member.dto.LoginRequest;
import com.byemypet.backend.member.dto.MemberCreateRequest;
import com.byemypet.backend.member.dto.MemberResponse;

@Service
@Transactional(readOnly = true)
public class MemberService {

	private final MemberRepository memberRepository;
	private final PasswordHasher passwordHasher;

	public MemberService(MemberRepository memberRepository, PasswordHasher passwordHasher) {
		this.memberRepository = memberRepository;
		this.passwordHasher = passwordHasher;
	}

	@Transactional
	public MemberResponse create(MemberCreateRequest request) {
		String studentId = request.studentId().trim();
		if (memberRepository.existsByStudentId(studentId)) {
			throw new ConflictException("이미 가입된 학번입니다.");
		}

		Member member = new Member(
				request.name().trim(),
				studentId,
				passwordHasher.hash(request.password())
		);

		return MemberResponse.from(memberRepository.save(member));
	}

	public MemberResponse login(LoginRequest request) {
		Member member = memberRepository.findByStudentId(request.studentId().trim())
				.filter(found -> passwordHasher.matches(request.password(), found.getPasswordHash()))
				.orElseThrow(() -> new UnauthorizedException("학번 또는 비밀번호를 확인해 주세요."));

		return MemberResponse.from(member);
	}

	public List<MemberResponse> findAll() {
		return memberRepository.findAll().stream()
				.map(MemberResponse::from)
				.toList();
	}
}
