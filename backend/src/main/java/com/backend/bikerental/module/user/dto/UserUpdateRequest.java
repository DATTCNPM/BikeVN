package com.backend.bikerental.module.user.dto;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
     String name;
     String email;
     String password;
     String phone;
     String cccdNumber;
     String branchId;
}
