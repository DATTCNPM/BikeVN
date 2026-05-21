package com.backend.bikerental.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_EXISTED("User not existed", "001"),
    EMAIL_ALREADY_EXISTS("Email already exists", "002"),
    INVALID_PASSWORD("Invalid password", "003"),
    UNAUTHENTICATED("Unauthenticated", "004"),
    UNAUTHORIZED("You don't have permission", "005");

    private final String message;
    private final String code;
}
