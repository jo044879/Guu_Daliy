package com.byemypet.backend.post;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.byemypet.backend.post.dto.PostResponse;

import jakarta.validation.constraints.NotBlank;

@RestController
public class PostController {

	private final PostService postService;

	public PostController(PostService postService) {
		this.postService = postService;
	}

	@GetMapping("/posts")
	public List<PostResponse> findAll() {
		return postService.findAll();
	}

	@PostMapping("/posts")
	@ResponseStatus(HttpStatus.CREATED)
	public PostResponse create(
			@RequestParam @NotBlank String studentId,
			@RequestParam ActivityType activityType,
			@RequestParam @NotBlank String description,
			@RequestParam(required = false) MultipartFile image
	) {
		return postService.create(studentId, activityType, description, image);
	}
}
