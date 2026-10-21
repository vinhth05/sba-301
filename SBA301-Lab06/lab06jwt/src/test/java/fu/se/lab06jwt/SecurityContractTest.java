package fu.se.lab06jwt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fu.se.lab06jwt.dtos.LoginUserDto;
import fu.se.lab06jwt.dtos.RegisterUserDto;
import fu.se.lab06jwt.entities.User;
import fu.se.lab06jwt.repositories.UserRepository;
import fu.se.lab06jwt.services.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityContractTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("T01: POST /auth/signup valid -> 201 Created and response excludes password")
    void t01_signup_valid_returns201() throws Exception {
        RegisterUserDto dto = new RegisterUserDto("SBA301 Student", "student01@fpt.edu.vn", "P@ssword123");

        mvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.fullName").value("SBA301 Student"))
                .andExpect(jsonPath("$.email").value("student01@fpt.edu.vn"))
                .andExpect(jsonPath("$.password").doesNotExist());

        User saved = userRepository.findByEmail("student01@fpt.edu.vn").orElseThrow();
        assertThat(saved.getPassword()).isNotEqualTo("P@ssword123");
        assertThat(saved.getPassword()).startsWith("$2a$");
    }

    @Test
    @DisplayName("T02: POST /auth/signup duplicate email -> 409 Conflict")
    void t02_signup_duplicate_returns409() throws Exception {
        RegisterUserDto dto = new RegisterUserDto("SBA301 Student", "duplicate@fpt.edu.vn", "P@ssword123");

        mvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        mvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    @DisplayName("T03: POST /auth/login valid credentials -> 200 OK + JWT token")
    void t03_login_valid_returns200AndToken() throws Exception {
        createTestUser("login01@fpt.edu.vn", "P@ssword123");

        LoginUserDto loginDto = new LoginUserDto("login01@fpt.edu.vn", "P@ssword123");
        MvcResult result = mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.expiresIn").value(greaterThan(0)))
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        String token = json.get("token").asText();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("T04: POST /auth/login bad password -> 401 Unauthorized")
    void t04_login_badPassword_returns401() throws Exception {
        createTestUser("wrongpass@fpt.edu.vn", "CorrectPassword123");

        LoginUserDto loginDto = new LoginUserDto("wrongpass@fpt.edu.vn", "WrongPassword123");
        mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @DisplayName("T05: GET /users/me without token -> 401 Unauthorized")
    void t05_usersMe_withoutToken_isUnauthorized() throws Exception {
        mvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("T06: GET /users/me with valid Bearer token -> 200 OK + principal identity")
    void t06_usersMe_withValidToken_returnsPrincipal() throws Exception {
        User user = createTestUser("principal@fpt.edu.vn", "P@ssword123");
        String token = jwtService.generateToken(user);

        mvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("principal@fpt.edu.vn"))
                .andExpect(jsonPath("$.fullName").value("Test User"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("T07: GET /users with valid token -> 200 OK + user list without password")
    void t07_users_withValidToken_returnsListWithoutPassword() throws Exception {
        User user1 = createTestUser("user1@fpt.edu.vn", "P@ssword123");
        createTestUser("user2@fpt.edu.vn", "P@ssword123");
        String token = jwtService.generateToken(user1);

        mvc.perform(get("/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].email").value("user1@fpt.edu.vn"))
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(jsonPath("$[1].password").doesNotExist());
    }

    @Test
    @DisplayName("T08: GET /users/me with malformed token -> 401 Unauthorized")
    void t08_usersMe_malformedToken_returns401() throws Exception {
        mvc.perform(get("/users/me")
                        .header("Authorization", "Bearer abc.malformed.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("T09: GET /users/me with tampered token -> 401 Unauthorized")
    void t09_usersMe_tamperedToken_returns401() throws Exception {
        User user = createTestUser("tamper@fpt.edu.vn", "P@ssword123");
        String token = jwtService.generateToken(user);

        // Tamper with signature
        String tamperedToken = token.substring(0, token.length() - 4) + "XXXX";

        mvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + tamperedToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("T10: GET /users/me with expired token -> 401 Unauthorized")
    void t10_usersMe_expiredToken_returns401() throws Exception {
        User user = createTestUser("expired@fpt.edu.vn", "P@ssword123");

        // Generate already-expired token (-10 seconds)
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);
        String expiredToken = Jwts.builder()
                .claims(new HashMap<>())
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis() - 20000))
                .expiration(new Date(System.currentTimeMillis() - 10000))
                .signWith(key)
                .compact();

        mvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("T11: POST /auth/signup invalid email -> 400 Bad Request")
    void t11_signup_invalidEmail_returns400() throws Exception {
        RegisterUserDto dto = new RegisterUserDto("Bad Email", "invalid-email-format", "P@ssword123");

        mvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    @DisplayName("T12: POST /auth/signup short password -> 400 Bad Request")
    void t12_signup_shortPassword_returns400() throws Exception {
        RegisterUserDto dto = new RegisterUserDto("Short Pass", "shortpass@fpt.edu.vn", "123");

        mvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    private User createTestUser(String email, String rawPassword) {
        User user = new User();
        user.setFullName("Test User");
        user.setEmail(email.toLowerCase());
        user.setPassword(passwordEncoder.encode(rawPassword));
        return userRepository.save(user);
    }
}
