package com.javacrud.seed;

import com.javacrud.user.User;
import com.javacrud.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Users already exist, skipping seed data");
            return;
        }

        log.info("Seeding default users...");

        userRepository.save(User.builder()
                .username("admin")
                .firstName("Admin")
                .lastName("User")
                .email("admin@javacrud.demo")
                .password(passwordEncoder.encode("Admin123!"))
                .role("admin")
                .build());

        userRepository.save(User.builder()
                .username("jdoe")
                .firstName("John")
                .lastName("Doe")
                .email("jdoe@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role("user")
                .build());

        userRepository.save(User.builder()
                .username("jsmith")
                .firstName("Jane")
                .lastName("Smith")
                .email("jsmith@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role("user")
                .build());

        userRepository.save(User.builder()
                .username("alex_m")
                .firstName("Alex")
                .lastName("Martinez")
                .email("alex.m@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role("user")
                .build());

        userRepository.save(User.builder()
                .username("sara_c")
                .firstName("Sara")
                .lastName("Chen")
                .email("sara.c@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role("user")
                .build());

        userRepository.save(User.builder()
                .username("mike_w")
                .firstName("Mike")
                .lastName("Wilson")
                .email("mike.w@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role("user")
                .build());

        log.info("Seed data loaded: admin + 5 regular users");
    }

}
