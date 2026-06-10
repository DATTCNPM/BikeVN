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
    INVALID_TIME(1013, "Invalid time", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_FOUND(1014, "Booking not found", HttpStatus.NOT_FOUND),
    PAYMENT_NOT_FOUND(1014, "Payment not found", HttpStatus.NOT_FOUND),
    PAYMENT_EXPIRED(1014, "Payment expired", HttpStatus.BAD_REQUEST),
    BOOKING_ALREADY_COMPLETED(1015, "Booking completed", HttpStatus.BAD_REQUEST),
    DUPLICATE_PAYMENT(1016, "duplicate payment",HttpStatus.BAD_REQUEST),
    BOOKING_TIME_CONFLICT(1017, "conflict booking time",HttpStatus.BAD_REQUEST),
    VEHICLE_ALREADY_LOCKED(1018, "vehicle already locked",HttpStatus.FORBIDDEN),
    LOCK_NOT_FOUND(1019, "lock not found",HttpStatus.NOT_FOUND),
    BOOKING_EXPIRED(1020, "booking expired",HttpStatus.BAD_REQUEST),
    PAYMENT_ALREADY_COMPLETED(1021, "payment completed", HttpStatus.BAD_REQUEST),
    VEHICLE_NOT_AVAILABLE(1022, "vehicle is not available", HttpStatus.BAD_REQUEST),
    RETURN_ALREADY_EXISTS(1023, "return already exist", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(5555,"Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(5050, "You don't have permission", HttpStatus.FORBIDDEN),
    EXISTED_DATA(5055, "%s already exists", HttpStatus.BAD_REQUEST);


    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
