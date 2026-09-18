package com.byemypet.backend.post;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

	@EntityGraph(attributePaths = "author")
	List<Post> findAllByOrderByCreatedAtDesc();
}
