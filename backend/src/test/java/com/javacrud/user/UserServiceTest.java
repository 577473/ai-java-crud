package com.javacrud.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, userMapper, passwordEncoder);
    }

    @Test
    void createUser_ShouldThrow_WhenUsernameExists() {
        UserDto dto = UserDto.builder()
                .username("existing")
                .firstName("Test")
                .lastName("User")
                .email("test@test.com")
                .password("password123")
                .role("user")
                .build();

        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.createUser(dto));
    }

    @Test
    void getCurrentUser_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getCurrentUser("nonexistent"));
    }

    @Test
    void deleteUser_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser(999L, "admin"));
    }

    @Test
    void deleteUser_ShouldThrow_WhenSelfDeletion() {
        User currentAdmin = User.builder().id(1L).username("admin").role("admin").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(currentAdmin));

        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser(1L, "admin"));
    }

    @Test
    void deleteUser_ShouldThrow_WhenLastAdmin() {
        User admin = User.builder().id(1L).username("admin").role("admin").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(userRepository.countByRole("admin")).thenReturn(1L);

        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser(1L, "other"));
    }

    @Test
    void deleteUser_ShouldSucceed_WhenDifferentAdminAndMoreThanOneAdmin() {
        User admin = User.builder().id(1L).username("admin").role("admin").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(userRepository.countByRole("admin")).thenReturn(2L);

        userService.deleteUser(1L, "otheradmin");

        verify(userRepository).deleteById(1L);
    }

}
