package com.byemypet.backend.member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

	boolean existsByStudentId(String studentId);

	Optional<Member> findByStudentId(String studentId);
}
