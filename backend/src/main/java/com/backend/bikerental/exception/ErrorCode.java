package com.backend.bikerental.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1003, "User not existed", HttpStatus.NOT_FOUND),
    INVALID_PASSWORD(1004, "Invalid password",HttpStatus.BAD_REQUEST),
    VEHICLE_NOT_EXISTED(1005, "Vehicle not existed",HttpStatus.NOT_FOUND),
    BRAND_NOT_EXISTED(1006, "Brand not existed",HttpStatus.NOT_FOUND),
    MODEL_NOT_EXISTED(1007, "Model not existed",HttpStatus.NOT_FOUND),
    BRANCH_NOT_EXISTED(1008, "Branch not existed",HttpStatus.NOT_FOUND),
    BRANCH_EXISTED(1009, "Branch existed",HttpStatus.BAD_REQUEST),
    MODEL_EXISTED(1010, "Model existed",HttpStatus.BAD_REQUEST),
    BRAND_EXISTED(1011, "Brand existed",HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAILED(1012, "File upload failed", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(5555,"Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(5050, "You don't have permission", HttpStatus.FORBIDDEN),
    EXISTED_DATA(5055, "Data is already existed", HttpStatus.BAD_REQUEST);

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
