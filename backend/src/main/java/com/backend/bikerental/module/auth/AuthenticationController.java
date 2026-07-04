package com.backend.bikerental.module.auth;

import com.backend.bikerental.module.auth.dto.*;
import com.backend.bikerental.core.dto.ApiResponse;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    //TEST CONTROLLER
    // Đổi từ /test thành /ping cho đồng bộ với useServerRecovery ở Frontend
    @GetMapping("/test")
    public ApiResponse<String> ping() {
        return ApiResponse.<String>builder()
                .code(1000) // Đảm bảo trả về code 1000 chuẩn logic của bạn
                .result("pong")
                .build();
    }
    //LOGIN
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request)
    {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    
    //LOGOUT
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException
    {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logged out successfully")
                .build();
    }
    
    //INTROSPECT
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException
    {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.refreshToken(request))
                .build();
    }

}
