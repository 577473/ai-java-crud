package com.javacrud.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javacrud.auth.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;
    private String userToken;
    private Long adminId;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User admin = userRepository.save(User.builder()
                .username("admin")
                .firstName("Admin")
                .lastName("User")
                .email("admin@test.com")
                .password(passwordEncoder.encode("Admin123!"))
                .role("admin")
                .build());

        User jdoe = userRepository.save(User.builder()
                .username("jdoe")
                .firstName("John")
                .lastName("Doe")
                .email("jdoe@test.com")
                .password(passwordEncoder.encode("Password123!"))
                .role("user")
                .build());

        adminId = admin.getId();
        adminToken = jwtTokenProvider.generateAccessToken("admin", "admin");
        userToken = jwtTokenProvider.generateAccessToken("jdoe", "user");
    }

    @Test
    void getUsers_ShouldReturn200_WhenAdmin() throws Exception {
        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void getUsers_ShouldReturn403_WhenRegularUser() throws Exception {
        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void getCurrentUser_ShouldReturn200_WhenAuthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("jdoe"));
    }

    @Test
    void getUserById_ShouldReturnUser_WhenAdmin() throws Exception {
        mockMvc.perform(get("/api/users/" + adminId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    void createUser_ShouldReturn201_WhenAdmin() throws Exception {
        UserDto newUser = UserDto.builder()
                .username("newuser")
                .firstName("New")
                .lastName("User")
                .email("new@test.com")
                .password("Password123!")
                .role("user")
                .build();

        mockMvc.perform(post("/api/users")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newuser"));
    }

    @Test
    void deleteOwnAccount_ShouldReturn400_WhenSelfDeletion() throws Exception {
        mockMvc.perform(delete("/api/users/" + adminId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteLastAdmin_ShouldReturn400_WhenOnlyAdmin() throws Exception {
        mockMvc.perform(delete("/api/users/" + adminId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest());
    }

}
