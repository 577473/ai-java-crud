package com.javacrud.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;

    @NotBlank(groups = ValidationGroups.OnCreate.class)
    @Size(min = 3, max = 30)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$")
    private String username;

    @NotBlank(groups = ValidationGroups.OnCreate.class)
    @Size(min = 1, max = 100)
    private String firstName;

    @NotBlank(groups = ValidationGroups.OnCreate.class)
    @Size(min = 1, max = 100)
    private String lastName;

    @NotBlank(groups = ValidationGroups.OnCreate.class)
    @Email
    @Size(max = 255)
    private String email;

    @NotBlank(groups = ValidationGroups.OnCreate.class)
    @Size(min = 8, max = 100)
    private String password;

    @NotBlank(groups = ValidationGroups.OnCreate.class)
    private String role;

}
