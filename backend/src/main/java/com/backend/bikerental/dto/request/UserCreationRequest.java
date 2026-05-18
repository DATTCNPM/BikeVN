package com.backend.bikerental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationRequest {
    @NotBlank(message = "USER_INVALID")
    private String name;

    private String email;

    @Size(min = 6, message = "PASSWORD_INVALID")
    private String passwordHash;

    private String phone;

    private String cccdNumber;
}