package com.javacrud.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String type;
    private String refreshToken;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String role;

}
