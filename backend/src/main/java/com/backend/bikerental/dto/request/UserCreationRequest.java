package com.backend.bikerental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @NotBlank(message = "USER_INVALID")
    String name;

    String email;

    @Size(min = 6, message = "PASSWORD_INVALID")
    String passwordHash;

    String phone;

    String cccdNumber;

    String branchId;
}