package com.byemypet.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
		String uploadDir,
		Cors cors
) {
	public record Cors(String allowedOriginPatterns) {
	}
}
