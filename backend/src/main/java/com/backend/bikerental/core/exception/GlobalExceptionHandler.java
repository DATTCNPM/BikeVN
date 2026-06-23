package com.backend.bikerental.core.exception;

import com.backend.bikerental.core.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return  ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception)
    {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException exception)
    {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(exception.getMessage())
                        .build());
    }

    @ExceptionHandler(value = ObjectOptimisticLockingFailureException.class)
    ResponseEntity<ApiResponse> handlingObjectOptimisticLockingFailureException
            (ObjectOptimisticLockingFailureException exception)
    {
        ErrorCode errorCode = ErrorCode.DATA_CONCURRENCY_CONFLICT;
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(exception.getMessage())
                        .build());
    }

    @ExceptionHandler(value = DataIntegrityViolationException.class)
    ResponseEntity<ApiResponse> handlingDataIntegrityViolationException(DataIntegrityViolationException exception)
    {
        ErrorCode errorCode = ErrorCode.EXISTED_DATA;
        String message = exception.getMostSpecificCause() != null 
                ? exception.getMostSpecificCause().getMessage() 
                : exception.getMessage();
        
        String duplicateField = "Data";
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("for key '([^']+)'").matcher(message);
        if (matcher.find()) {
            String key = matcher.group(1);
            if (key.contains(".")) {
                key = key.substring(key.lastIndexOf('.') + 1);
            }
            if (key.startsWith("unique_")) {
                key = key.substring(7);
            }
            duplicateField = key.substring(0, 1).toUpperCase() + key.substring(1);
        }

        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(String.format(errorCode.getMessage(), duplicateField))
                        .build());
    }
}
