package com.javacrud.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(
                "test-access-secret-key-must-be-at-least-256-bits-long",
                "test-refresh-secret-key-must-be-at-least-256-bits-long",
                300000,
                1800000
        );
    }

    @Test
    void generateAccessToken_ShouldReturnValidToken() {
        String token = jwtTokenProvider.generateAccessToken("admin", "admin");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateAccessToken(token));
        assertEquals("admin", jwtTokenProvider.getUsernameFromAccessToken(token));
        assertEquals("admin", jwtTokenProvider.getRoleFromAccessToken(token));
    }

    @Test
    void generateRefreshToken_ShouldReturnValidToken() {
        String token = jwtTokenProvider.generateRefreshToken("jdoe");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateRefreshToken(token));
        assertEquals("jdoe", jwtTokenProvider.getUsernameFromRefreshToken(token));
    }

    @Test
    void validateAccessToken_ShouldReturnFalse_ForInvalidToken() {
        assertFalse(jwtTokenProvider.validateAccessToken("invalid-token"));
    }

    @Test
    void validateRefreshToken_ShouldReturnFalse_ForInvalidToken() {
        assertFalse(jwtTokenProvider.validateRefreshToken("invalid-token"));
    }

}
