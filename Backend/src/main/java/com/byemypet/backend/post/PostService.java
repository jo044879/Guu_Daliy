package com.byemypet.backend.post;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.byemypet.backend.common.NotFoundException;
import com.byemypet.backend.member.Member;
import com.byemypet.backend.member.MemberRepository;
import com.byemypet.backend.post.ImageStorageService.StoredImage;
import com.byemypet.backend.post.dto.PostResponse;

@Service
@Transactional(readOnly = true)
public class PostService {

	private final PostRepository postRepository;
	private final MemberRepository memberRepository;
	private final ImageStorageService imageStorageService;

	public PostService(PostRepository postRepository, MemberRepository memberRepository, ImageStorageService imageStorageService) {
		this.postRepository = postRepository;
		this.memberRepository = memberRepository;
		this.imageStorageService = imageStorageService;
	}

	@Transactional
	public PostResponse create(String studentId, ActivityType activityType, String description, MultipartFile image) {
		Member author = memberRepository.findByStudentId(studentId.trim())
				.orElseThrow(() -> new NotFoundException("회원 정보를 찾을 수 없습니다."));
		StoredImage storedImage = imageStorageService.store(image);

		Post post = new Post(
				activityType,
				description.trim(),
				storedImage.imageUrl(),
				storedImage.originalImageName(),
				author
		);

		return PostResponse.from(postRepository.save(post));
	}

	public List<PostResponse> findAll() {
		return postRepository.findAllByOrderByCreatedAtDesc().stream()
				.map(PostResponse::from)
				.toList();
	}
}
