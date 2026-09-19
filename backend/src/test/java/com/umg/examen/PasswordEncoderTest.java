package com.umg.examen;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderTest {

    @Test
    void testPasswordMatches() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String adminHash = "$2a$10$sJLPmgj80xBBVDWerwFQf.l0zi/B6wNKBEO6tNJVYcAZMYyZ3iOnC";
        String userHash = "$2a$10$kg/0BFloJGYtIkwCgKMFveTDlog2LvatqrQK8iS4mAL9GLmBEcuGW";

        assertTrue(encoder.matches("admin123", adminHash), "Admin password must match its Liquibase hash");
        assertTrue(encoder.matches("user123", userHash), "User password must match its Liquibase hash");
    }
}
