package com.byemypet.backend.member;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {

	public String hash(String rawPassword) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] encoded = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
			StringBuilder builder = new StringBuilder(encoded.length * 2);
			for (byte value : encoded) {
				builder.append(String.format("%02x", value));
			}
			return builder.toString();
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException("SHA-256 is not available.", exception);
		}
	}

	public boolean matches(String rawPassword, String passwordHash) {
		return hash(rawPassword).equals(passwordHash);
	}
}
