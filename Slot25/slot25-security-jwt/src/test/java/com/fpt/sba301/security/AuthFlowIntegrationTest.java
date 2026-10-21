package com.fpt.sba301.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.sba301.security.dto.LoginRequest;
import com.fpt.sba301.security.dto.OrchidRequest;
import com.fpt.sba301.security.dto.SignupRequest;
import com.fpt.sba301.security.entity.AppUser;
import com.fpt.sba301.security.repository.AppUserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Helper to log in and get JWT token
    private String obtainAccessToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest(email, password);
        MvcResult result = mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("accessToken").asText();
    }

    @Test
    @DisplayName("T01: GET /users/me without token returns 401 Unauthorized")
    void meWithoutToken_returns401() throws Exception {
        mvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("T02: POST /auth/signup creates user and stores BCrypt hash (not plaintext)")
    void signupValidUser_returns201AndHashesPassword() throws Exception {
        String testEmail = "newbie" + System.currentTimeMillis() + "@example.com";
        SignupRequest req = new SignupRequest(testEmail, "SuperSecret@123");

        mvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(testEmail))
                .andExpect(jsonPath("$.role").value("USER"));

        // Verify password in DB is hashed and matches via PasswordEncoder
        AppUser savedUser = userRepository.findByEmail(testEmail).orElseThrow();
        assertThat(savedUser.getPassword()).isNotEqualTo("SuperSecret@123");
        assertThat(savedUser.getPassword()).startsWith("$2");
        assertThat(passwordEncoder.matches("SuperSecret@123", savedUser.getPassword())).isTrue();
    }

    @Test
    @DisplayName("T03: POST /auth/signup duplicate email returns 409 Conflict")
    void signupDuplicateEmail_returns409() throws Exception {
        SignupRequest req = new SignupRequest("admin@example.com", "Password@123");

        mvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    @DisplayName("T04: POST /auth/login with valid credentials returns 200 and Bearer token")
    void loginValidCredentials_returns200AndToken() throws Exception {
        LoginRequest req = new LoginRequest("admin@example.com", "Admin@123456");

        mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(900));
    }

    @Test
    @DisplayName("T05: POST /auth/login with invalid password returns 401 Unauthorized")
    void loginInvalidPassword_returns401() throws Exception {
        LoginRequest req = new LoginRequest("admin@example.com", "WrongPassword!999");

        mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("T06: GET /users/me with valid Bearer token returns 200 and principal identity")
    void meWithValidToken_returns200AndPrincipal() throws Exception {
        String token = obtainAccessToken("user@example.com", "User@123456");

        mvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user@example.com"))
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.authorities[0]").value("ROLE_USER"));
    }

    @Test
    @DisplayName("T07: GET /users with valid token returns list of users")
    void usersListWithValidToken_returns200() throws Exception {
        String token = obtainAccessToken("user@example.com", "User@123456");

        mvc.perform(get("/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("T08: GET /admin/dashboard with USER role returns 403 Forbidden")
    void adminEndpointWithUserRole_returns403() throws Exception {
        String userToken = obtainAccessToken("user@example.com", "User@123456");

        mvc.perform(get("/admin/dashboard")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.error").value("FORBIDDEN"));
    }

    @Test
    @DisplayName("T09: GET /admin/dashboard with ADMIN role returns 200 OK")
    void adminEndpointWithAdminRole_returns200() throws Exception {
        String adminToken = obtainAccessToken("admin@example.com", "Admin@123456");

        mvc.perform(get("/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.caller").value("admin@example.com"));
    }

    @Test
    @DisplayName("T10: GET /users/me with tampered token returns 401 Unauthorized")
    void meWithTamperedToken_returns401() throws Exception {
        String token = obtainAccessToken("user@example.com", "User@123456");
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";

        mvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + tamperedToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("T11: GET /orchids is public and returns 200 without token")
    void getOrchidsWithoutToken_returns200() throws Exception {
        mvc.perform(get("/orchids"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("T12: POST /orchids without token returns 401 Unauthorized")
    void postOrchidWithoutToken_returns401() throws Exception {
        OrchidRequest req = new OrchidRequest("New Hybrid Orchid", true, "Test desc", true, "http://image.com");

        mvc.perform(post("/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("T13: POST /orchids with authenticated user returns 201 Created")
    void postOrchidWithToken_returns201() throws Exception {
        String token = obtainAccessToken("user@example.com", "User@123456");
        OrchidRequest req = new OrchidRequest("Cymbidium Golden Elf", true, "Fragrant miniature cymbidium", true, "http://image.com/elf.jpg");

        mvc.perform(post("/orchids")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orchidName").value("Cymbidium Golden Elf"));
    }

    @Test
    @DisplayName("T14: DELETE /orchids/{id} with USER role returns 403 Forbidden")
    void deleteOrchidWithUserRole_returns403() throws Exception {
        String userToken = obtainAccessToken("user@example.com", "User@123456");

        mvc.perform(delete("/orchids/1")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("T15: DELETE /orchids/{id} with ADMIN role returns 204 No Content")
    void deleteOrchidWithAdminRole_returns204() throws Exception {
        String adminToken = obtainAccessToken("admin@example.com", "Admin@123456");

        mvc.perform(delete("/orchids/1")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }
}
