package com.byemypet.backend;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ActivityApiTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void memberLoginAndPostFlowWorks() throws Exception {
		mockMvc.perform(post("/members")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"홍길동","studentId":"20260001","password":"1234"}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("홍길동"))
				.andExpect(jsonPath("$.studentId").value("20260001"));

		mockMvc.perform(post("/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"studentId":"20260001","password":"1234"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("홍길동"));

		mockMvc.perform(multipart("/posts")
						.param("studentId", "20260001")
						.param("activityType", "EXERCISE")
						.param("description", "30분 운동 완료"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.activityType").value("EXERCISE"))
				.andExpect(jsonPath("$.description").value("30분 운동 완료"));

		mockMvc.perform(get("/posts"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].authorName").value("홍길동"));
	}
}
