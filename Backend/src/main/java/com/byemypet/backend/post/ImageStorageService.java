package com.byemypet.backend.post;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.byemypet.backend.config.AppProperties;

@Service
public class ImageStorageService {

	private final Path uploadDir;

	public ImageStorageService(AppProperties appProperties) {
		this.uploadDir = Path.of(appProperties.uploadDir()).toAbsolutePath().normalize();
	}

	public StoredImage store(MultipartFile image) {
		if (image == null || image.isEmpty()) {
			return StoredImage.empty();
		}

		String contentType = image.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
		}

		try {
			Files.createDirectories(uploadDir);
			String originalName = StringUtils.cleanPath(image.getOriginalFilename() == null ? "image" : image.getOriginalFilename());
			String extension = getExtension(originalName);
			String storedName = UUID.randomUUID() + extension;
			Path target = uploadDir.resolve(storedName).normalize();
			image.transferTo(target);

			return new StoredImage("/uploads/" + storedName, originalName);
		} catch (IOException exception) {
			throw new IllegalStateException("이미지를 저장하지 못했습니다.", exception);
		}
	}

	private String getExtension(String fileName) {
		int dotIndex = fileName.lastIndexOf('.');
		if (dotIndex < 0) {
			return "";
		}
		return fileName.substring(dotIndex);
	}

	public record StoredImage(String imageUrl, String originalImageName) {
		public static StoredImage empty() {
			return new StoredImage(null, null);
		}
	}
}
